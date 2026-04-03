import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import Slider from '@react-native-community/slider'
import Svg, { Circle, G, Path } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import {
  BiodegradationService,
  type Enzyme,
} from '@/services/biodegradation.service'

// Công thức khoa học: hoạt tính enzyme theo pH và nhiệt độ (mô hình Gaussian)
// Tham khảo: enzyme activity bell curve (optimum pH, optimum T)
const SIGMA_PH = 2.5
const SIGMA_TEMP = 18

function computeEfficiency(
  pH: number,
  temp: number,
  pHOpt: number,
  tempOpt: number
): number {
  const activityPH = Math.exp(
    -Math.pow(pH - pHOpt, 2) / (2 * Math.pow(SIGMA_PH, 2))
  )
  const activityTemp = Math.exp(
    -Math.pow(temp - tempOpt, 2) / (2 * Math.pow(SIGMA_TEMP, 2))
  )
  const relative = activityPH * activityTemp
  return Math.min(100, Math.round(relative * 100))
}

function getStatus(efficiency: number): 'THẤP' | 'SUY GIẢM' | 'TỐI ƯU' {
  if (efficiency >= 75) return 'TỐI ƯU'
  if (efficiency >= 40) return 'SUY GIẢM'
  return 'THẤP'
}

function getOptimalFromEnzymes(enzymes: Enzyme[]): { pHOpt: number; tempOpt: number } {
  let pHSum = 0
  let tempSum = 0
  let pHCount = 0
  let tempCount = 0
  enzymes.forEach((e) => {
    const phMin = e.optimal_ph_min ?? e.optimal_ph_max
    const phMax = e.optimal_ph_max ?? e.optimal_ph_min
    if (phMin != null || phMax != null) {
      const mid = ((phMin ?? phMax ?? 7) + (phMax ?? phMin ?? 7)) / 2
      pHSum += mid
      pHCount++
    }
    if (e.optimal_temperature_celsius != null) {
      tempSum += e.optimal_temperature_celsius
      tempCount++
    }
  })
  const pHOpt = pHCount ? pHSum / pHCount : 7
  const tempOpt = tempCount ? tempSum / tempCount : 37
  return {
    pHOpt: Math.round(pHOpt * 10) / 10,
    tempOpt: Math.round(tempOpt),
  }
}

function SemiCircleGauge({ percent }: { percent: number }) {
  const size = 200
  const stroke = 16
  const radius = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2

  const clamped = Math.max(0, Math.min(100, percent))
  const circumference = 2 * Math.PI * radius
  const halfCircumference = circumference / 2
  const progress = (clamped / 100) * halfCircumference

  return (
    <Svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size}`}>
      <G rotation={-180} origin={`${cx}, ${cy}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${circumference}`}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#22C55E"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </G>
    </Svg>
  )
}

export default function SimulationConditionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pollutantId = id ?? ''

  const { data: pollutant, isLoading: loadingPollutant } = useQuery({
    queryKey: ['pollutant', pollutantId],
    queryFn: () => BiodegradationService.getPollutantById(pollutantId),
    enabled: !!pollutantId,
  })

  const { data: enzymes = [], isLoading: loadingEnzymes } = useQuery({
    queryKey: ['enzymesForPollutant', pollutantId],
    queryFn: () => BiodegradationService.getEnzymesForPollutant(pollutantId),
    enabled: !!pollutantId,
  })

  const optimal = useMemo(
    () => getOptimalFromEnzymes(enzymes),
    [enzymes]
  )

  const [pH, setPH] = useState(7)
  const [temp, setTemp] = useState(37)
  const hasAppliedOptimal = useRef(false)

  useEffect(() => {
    if (enzymes.length > 0 && !hasAppliedOptimal.current) {
      hasAppliedOptimal.current = true
      setPH(optimal.pHOpt)
      setTemp(optimal.tempOpt)
    }
  }, [enzymes.length, optimal.pHOpt, optimal.tempOpt])

  const efficiency = useMemo(
    () => computeEfficiency(pH, temp, optimal.pHOpt, optimal.tempOpt),
    [pH, temp, optimal.pHOpt, optimal.tempOpt]
  )
  const status = getStatus(efficiency)
  const enzymeName = enzymes[0]?.name ?? 'Enzyme'

  const analysisText = useMemo(() => {
    if (status === 'TỐI ƯU') {
      return `Tại pH ${pH.toFixed(1)} và ${temp}°C, Enzyme ${enzymeName} đạt trạng thái lý tưởng nhất. Quá trình bẻ gãy liên kết polymer diễn ra ổn định với cường độ cao nhất.`
    }
    if (status === 'SUY GIẢM') {
      return `Tại pH ${pH.toFixed(1)} và ${temp}°C, hoạt tính ${enzymeName} ở mức trung bình (${efficiency}%). Điều chỉnh pH về ~${optimal.pHOpt} và nhiệt độ ~${optimal.tempOpt}°C để cải thiện hiệu suất.`
    }
    return `Tại pH ${pH.toFixed(1)} và ${temp}°C, hoạt tính ${enzymeName} rất thấp (${efficiency}%). Môi trường lệch xa điều kiện tối ưu (pH ~${optimal.pHOpt}, nhiệt độ ~${optimal.tempOpt}°C).`
  }, [pH, temp, status, efficiency, enzymeName, optimal])

  const handlePreset = (preset: 'THẤP' | 'TỐI ƯU' | 'SUY GIẢM') => {
    if (preset === 'TỐI ƯU') {
      setPH(optimal.pHOpt)
      setTemp(optimal.tempOpt)
    } else if (preset === 'THẤP') {
      setPH(3)
      setTemp(10)
    } else {
      setPH(5.5)
      setTemp(22)
    }
  }

  const handleBack = () => router.back()

  if (!pollutantId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Thiếu thông tin.</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (loadingPollutant || (!!pollutantId && loadingEnzymes)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    )
  }

  const firstEnzymeWithImage = enzymes.find((e) => e.image_url)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mô phỏng điều kiện</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông số môi trường */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông số môi trường</Text>
          <Text style={styles.cardDesc}>
            Điều chỉnh các biến số để quan sát sự thay đổi sinh học.
          </Text>

          <Text style={styles.sliderLabel}>Chỉ số pH (0-14)</Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={14}
              value={pH}
              onValueChange={setPH}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#3B82F6"
              step={0.1}
            />
            <Text style={[styles.sliderValue, { color: '#3B82F6' }]}>
              {pH.toFixed(1)}
            </Text>
          </View>

          <Text style={styles.sliderLabel}>Nhiệt độ (0-100°C)</Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={temp}
              onValueChange={setTemp}
              minimumTrackTintColor="#F97316"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#F97316"
              step={1}
            />
            <Text style={[styles.sliderValue, { color: '#F97316' }]}>
              {temp}°C
            </Text>
          </View>
        </View>

        {/* Hoạt động enzym */}
        <View style={styles.card}>
          <View style={styles.enzymeHeader}>
            <Text style={styles.cardTitle}>Hoạt động enzym</Text>
            <View
              style={[
                styles.statusTag,
                status === 'TỐI ƯU' && styles.statusOptimal,
                status === 'SUY GIẢM' && styles.statusDecreased,
                status === 'THẤP' && styles.statusLow,
              ]}
            >
              <Text
                style={[
                  styles.statusTagText,
                  status === 'TỐI ƯU' && styles.statusOptimalText,
                  status === 'SUY GIẢM' && styles.statusDecreasedText,
                  status === 'THẤP' && styles.statusLowText,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>

          {firstEnzymeWithImage?.image_url ? (
            <Image
              source={{ uri: firstEnzymeWithImage.image_url }}
              style={styles.enzymeImage}
              resizeMode="contain"
            />
          ) : null}

          <View style={styles.gaugeWrap}>
            <SemiCircleGauge percent={efficiency} />
            <View style={styles.gaugeOverlay}>
              <Text style={styles.gaugePercent}>{efficiency}%</Text>
              <Text style={styles.gaugeLabel}>Hiệu suất</Text>
            </View>
          </View>

          <View style={styles.presetRow}>
            <TouchableOpacity
              style={[styles.presetBtn, status === 'THẤP' && styles.presetLow]}
              onPress={() => handlePreset('THẤP')}
            >
              <View style={[styles.presetDot, styles.presetDotLow]} />
              <Text style={styles.presetText}>THẤP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetBtn, status === 'TỐI ƯU' && styles.presetOptimal]}
              onPress={() => handlePreset('TỐI ƯU')}
            >
              <View style={[styles.presetDot, styles.presetDotOptimal]} />
              <Text style={styles.presetText}>TỐI ƯU</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.presetBtn, status === 'SUY GIẢM' && styles.presetDecreased]}
              onPress={() => handlePreset('SUY GIẢM')}
            >
              <View style={[styles.presetDot, styles.presetDotDecreased]} />
              <Text style={styles.presetText}>SUY GIẢM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phân tích thực nghiệm */}
        <View style={styles.analysisCard}>
          <View style={styles.analysisTitleRow}>
            <Ionicons name="bar-chart" size={20} color="#2563EB" />
            <Text style={styles.analysisTitle}>Phân tích thực nghiệm</Text>
          </View>
          <Text style={styles.analysisText}>{analysisText}</Text>
        </View>

        <Text style={styles.warning}>
          CẢNH BÁO: Dựa trên tài liệu khoa học, không mang tính chẩn đoán. Các
          thông số có thể thay đổi tùy thuộc vào chủng loại Enzyme và loại nhựa
          cụ thể.
        </Text>
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { fontSize: 16, color: '#666', marginBottom: 16 },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerBack: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  headerRight: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#111' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  sliderLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  slider: { flex: 1, height: 40 },
  sliderValue: { fontSize: 16, fontWeight: '700', minWidth: 48, textAlign: 'right' },
  enzymeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusOptimal: { backgroundColor: '#DCFCE7' },
  statusDecreased: { backgroundColor: '#FEF3C7' },
  statusLow: { backgroundColor: '#FEE2E2' },
  statusTagText: { fontSize: 12, fontWeight: '700' },
  statusOptimalText: { color: '#166534' },
  statusDecreasedText: { color: '#B45309' },
  statusLowText: { color: '#B91C1C' },
  enzymeImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  gaugeWrap: {
    alignItems: 'center',
    marginVertical: 12,
    position: 'relative',
    height: 120,
  },
  gaugeOverlay: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercent: { fontSize: 28, fontWeight: '800', color: '#111' },
  gaugeLabel: { fontSize: 13, color: '#6B7280' },
  presetRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  presetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presetLow: { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
  presetOptimal: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
  presetDecreased: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  presetDot: { width: 8, height: 8, borderRadius: 4 },
  presetDotLow: { backgroundColor: '#DC2626' },
  presetDotOptimal: { backgroundColor: '#22C55E' },
  presetDotDecreased: { backgroundColor: '#F59E0B' },
  presetText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  analysisCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  analysisTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisTitle: { fontSize: 17, fontWeight: '700', color: '#2563EB' },
  analysisText: { fontSize: 15, color: '#1E40AF', lineHeight: 22 },
  warning: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  bottomPad: { height: 24 },
})
