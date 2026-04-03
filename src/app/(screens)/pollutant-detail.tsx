import React from 'react'
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
import { Ionicons } from '@expo/vector-icons'
import {
  BiodegradationService,
  type Pollutant,
  type Enzyme,
  type Microorganism,
} from '@/services/biodegradation.service'
import { ERouteTable } from '@/constants/route-table'

const SECTION_ACCENT = '#F97316'

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  )
}

function BulletList({ content }: { content: string }) {
  const lines = content
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <View style={styles.bulletList}>
      {lines.map((line, i) => (
        <Text key={i} style={styles.bulletItem}>
          • {line}
        </Text>
      ))}
    </View>
  )
}

function formatMechanism(enzymes: Enzyme[], micro: Microorganism | null): string {
  const parts: string[] = []
  enzymes.forEach((e) => {
    if (e.mechanism) parts.push(e.mechanism)
  })
  if (micro?.name) {
    parts.push(`Vi khuẩn tiêu biểu: ${micro.name}.`)
  }
  return parts.join(' ')
}

function formatOptimalConditions(enzymes: Enzyme[]): string {
  if (!enzymes.length) return ''
  const ph = enzymes
    .filter((e) => e.optimal_ph_min != null || e.optimal_ph_max != null)
    .map((e) => {
      if (e.optimal_ph_min != null && e.optimal_ph_max != null)
        return `pH ~${e.optimal_ph_min}-${e.optimal_ph_max}`
      if (e.optimal_ph_min != null) return `pH ~${e.optimal_ph_min}`
      if (e.optimal_ph_max != null) return `pH ~${e.optimal_ph_max}`
      return ''
    })
    .filter(Boolean)
  const temp = enzymes
    .filter((e) => e.optimal_temperature_celsius != null)
    .map((e) => `${e.optimal_temperature_celsius}°C`)
  const phStr = [...new Set(ph)].join(', ') || ''
  const tempStr = [...new Set(temp)].join('-') || ''
  const items: string[] = []
  if (phStr) items.push(phStr)
  if (tempStr) items.push(`nhiệt độ ~${tempStr} để enzyme hoạt động tối ưu.`)
  return items.join(', ')
}

export default function PollutantDetailScreen() {
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

  const { data: microorganism, isLoading: loadingMicro } = useQuery({
    queryKey: ['representativeMicroorganism', pollutantId],
    queryFn: () =>
      BiodegradationService.getRepresentativeMicroorganismForPollutant(
        pollutantId
      ),
    enabled: !!pollutantId,
  })

  const isLoading =
    loadingPollutant || (!!pollutantId && (loadingEnzymes || loadingMicro))

  const handleBack = () => router.back()

  if (!pollutantId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Thiếu thông tin chất ô nhiễm.</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (isLoading && !pollutant) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    )
  }

  if (!pollutant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy thông tin.</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const mechanismText = formatMechanism(enzymes, microorganism ?? null)
  const conditionsText = formatOptimalConditions(enzymes)
  const displayName = `Nhựa ${pollutant.name}`

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Green banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{displayName}</Text>
          <Text style={styles.bannerSubtitle}>
            {pollutant.scientific_name || pollutant.name}
          </Text>
        </View>

        {/* Mô tả khoa học */}
        <SectionTitle title="Mô tả khoa học" />
        <BulletList content={pollutant.description || 'Chưa có mô tả.'} />

        {/* Công thức hóa học - dùng link riêng structure_image_url */}
        {(pollutant.structure_image_url || pollutant.structure_formula) && (
          <View style={styles.formulaBlock}>
            {pollutant.structure_image_url ? (
              <Image
                source={{ uri: pollutant.structure_image_url }}
                style={styles.formulaImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.formulaPlaceholder}>
                <Text style={styles.formulaPlaceholderText}>
                  {pollutant.structure_formula || 'Công thức hóa học'}
                </Text>
              </View>
            )}
            <Text style={styles.formulaLabel}>Công thức hóa học</Text>
          </View>
        )}

        {/* Cơ chế phân hủy sinh học */}
        <SectionTitle title="Cơ chế phân hủy sinh học" />
        <BulletList
          content={
            mechanismText ||
            'Chưa có dữ liệu cơ chế phân hủy cho chất này.'
          }
        />

        {/* Điều kiện tối ưu */}
        <SectionTitle title="Điều kiện tối ưu" />
        <BulletList
          content={
            conditionsText ||
            'Chưa có dữ liệu điều kiện tối ưu cho chất này.'
          }
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom tabs: Mô phỏng / Quá trình */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={[styles.bottomTab, styles.bottomTabInactive]}
          onPress={() => {
            router.push({
              pathname: ERouteTable.SIMULATION_CONDITIONS,
              params: { id: pollutant.id },
            })
          }}
        >
          <Text style={styles.bottomTabTextInactive}>Mô phỏng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomTab, styles.bottomTabActive]}
          onPress={() => {
            router.push({
              pathname: ERouteTable.DEGRADATION_PROCESS,
              params: { id: pollutant.id },
            })
          }}
        >
          <Text style={styles.bottomTabTextActive}>Quá trình</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  headerBack: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  banner: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: SECTION_ACCENT,
    marginRight: 10,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  bulletList: {
    marginBottom: 24,
  },
  bulletItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
  },
  formulaBlock: {
    marginBottom: 24,
    alignItems: 'center',
  },
  formulaImage: {
    width: '100%',
    maxWidth: 320,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  formulaPlaceholder: {
    width: '100%',
    maxWidth: 320,
    minHeight: 120,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formulaPlaceholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formulaLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
  },
  bottomPadding: {
    height: 24,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    gap: 12,
  },
  bottomTab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabActive: {
    backgroundColor: '#2E7D32',
  },
  bottomTabInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bottomTabTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomTabTextInactive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
})
