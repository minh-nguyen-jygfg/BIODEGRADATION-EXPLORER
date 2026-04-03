import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { router, useFocusEffect } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { ProfileService } from '@/services/profile.service'
import {
  BiodegradationService,
  Pollutant,
  CaseStudy,
  parseSpeedFromDescription,
  parseSalinityFromConditions,
} from '@/services/biodegradation.service'
import { Wind2 } from 'iconsax-react-native'
import { getAvatarUrl } from '@/utils/avatar'

const CompareEnvironmentsScreen = () => {
  // Auth chỉ phục vụ avatar & tính năng cá nhân, không bắt buộc để xem so sánh môi trường
  const { user } = useAuth()
  const [selectedPollutantId, setSelectedPollutantId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => (user?.id ? ProfileService.getProfile(user.id) : null),
    enabled: !!user?.id,
  })

  // Refetch profile when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetchProfile()
      }
    }, [user?.id, refetchProfile])
  )

  const { data: pollutants = [], isLoading: pollutantsLoading } = useQuery({
    queryKey: ['pollutants'],
    queryFn: () => BiodegradationService.getPollutants(),
    // Nội dung khoa học là public
    enabled: true,
  })

  const firstPollutantId = pollutants[0]?.id ?? null
  const activePollutantId = selectedPollutantId ?? firstPollutantId

  const {
    data: comparison,
    isLoading: comparisonLoading,
    refetch: refetchComparison,
  } = useQuery({
    queryKey: ['case-studies-comparison', activePollutantId],
    queryFn: () =>
      activePollutantId
        ? BiodegradationService.getCaseStudiesForComparison(activePollutantId)
        : { freshwater: null, marine: null },
    // So sánh case study cũng là public
    enabled: !!activePollutantId,
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetchComparison()
    if (user?.id) {
      await refetchProfile()
    }
    setRefreshing(false)
  }

  const handleAvatarPress = () => {
    router.push(ERouteTable.USER)
  }

  const freshwater = comparison?.freshwater ?? null
  const marine = comparison?.marine ?? null

  const speedFresh = parseSpeedFromDescription(freshwater?.description ?? null)
  const speedMarine = parseSpeedFromDescription(marine?.description ?? null)
  const salinityFresh = parseSalinityFromConditions(freshwater?.conditions ?? null)
  const salinityMarine = parseSalinityFromConditions(marine?.conditions ?? null)
  const microFresh =
    freshwater?.microorganisms?.scientific_name ||
    freshwater?.microorganisms?.name ||
    '—'
  const microMarine =
    marine?.microorganisms?.scientific_name || marine?.microorganisms?.name || '—'
  
  // Parse đặc tính từ advantages (lấy câu ngắn gọn nhất)
  const getShortCharacteristic = (text: string | null): string => {
    if (!text) return '—'
    const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean)
    return sentences[0] || '—'
  }
  
  const characteristicFresh = getShortCharacteristic(freshwater?.advantages ?? null)
  const characteristicMarine = getShortCharacteristic(marine?.advantages ?? null)

  const speedNumFresh = parseFloat(speedFresh.replace('%', '')) || 0
  const speedNumMarine = parseFloat(speedMarine.replace('%', '')) || 0
  const maxSpeed = Math.max(speedNumFresh, speedNumMarine, 1)

  const conclusionText =
    marine?.description ||
    freshwater?.description ||
    'Chưa có kết luận khoa học cho loại nhựa này.'

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#22C55E"
            colors={['#22C55E']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>So sánh môi trường</Text>
        </View>

        {/* Plastic type selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plasticRow}
          style={styles.plasticScroll}
        >
          {pollutantsLoading ? (
            <ActivityIndicator size="small" color="#22C55E" style={{ marginVertical: 12 }} />
          ) : (
            pollutants.map((p: Pollutant) => {
              const isSelected = p.id === activePollutantId
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPollutantId(p.id)}
                  style={[styles.plasticChip, isSelected && styles.plasticChipSelected]}
                >
                  <Text
                    style={[styles.plasticChipText, isSelected && styles.plasticChipTextSelected]}
                    numberOfLines={1}
                  >
                    Nhựa {p.name}
                  </Text>
                </TouchableOpacity>
              )
            })
          )}
        </ScrollView>

        {/* Environment labels: Nước ngọt SO VỚI Nước biển */}
        <View style={styles.envSection}>
          <View style={styles.envBlock}>
            <View style={styles.envIconWrapBlue}>
              <Ionicons name="water" size={28} color="#0EA5E9" />
            </View>
            <Text style={styles.envLabel}>Nước ngọt</Text>
          </View>
          <Text style={styles.envVs}>SO VỚI</Text>
          <View style={styles.envBlock}>
            <View style={styles.envIconWrapGreen}>
              <Wind2 size="28" color="#22C55E"/>
            </View>
            <Text style={styles.envLabel}>Nước biển</Text>
          </View>
        </View>

        {comparisonLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : (
          <>
            {/* Comparison table card */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.tableHeaderCriteria}>TIÊU CHÍ</Text>
                <Text style={[styles.tableHeader, styles.colFresh]}>NƯỚC NGỌT</Text>
                <Text style={[styles.tableHeader, styles.colMarine]}>NƯỚC BIỂN</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCriteria}>Tốc độ</Text>
                <View style={styles.cellWithBar}>
                  <Text style={[styles.cellValue, styles.colFresh]}>{speedFresh}</Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        styles.barFresh,
                        { width: `${Math.min(100, (speedNumFresh / maxSpeed) * 100)}%` },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.cellWithBar}>
                  <Text style={[styles.cellValue, styles.colMarine]}>{speedMarine}</Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        styles.barMarine,
                        { width: `${Math.min(100, (speedNumMarine / maxSpeed) * 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCriteria}>Độ mặn</Text>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText} numberOfLines={1}>
                    {salinityFresh}
                  </Text>
                </View>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText} numberOfLines={1}>
                    {salinityMarine}
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCriteria}>Vi sinh</Text>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText} numberOfLines={5}>
                    {microFresh}
                  </Text>
                </View>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText}>
                    {microMarine}
                  </Text>
                </View>
              </View>

              <View style={[styles.tableRow, styles.tableRowLast]}>
                <Text style={styles.tableCriteria}>Đặc tính</Text>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText} numberOfLines={5}>
                    {characteristicFresh}
                  </Text>
                </View>
                <View style={styles.cellWrapper}>
                  <Text style={styles.cellValueText} numberOfLines={5}>
                    {characteristicMarine}
                  </Text>
                </View>
              </View>
            </View>

            {/* Scientific conclusion card */}
            <View style={styles.conclusionCard}>
              <View style={styles.conclusionHeader}>
                <Ionicons name="bulb" size={22} color="#DC2626" />
                <Text style={styles.conclusionTitle}>Kết luận khoa học</Text>
              </View>
              <Text style={styles.conclusionText}>{conclusionText}</Text>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 66,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plasticScroll: {
    marginBottom: 24,
  },
  plasticRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  plasticChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  plasticChipSelected: {
    backgroundColor: '#22C55E',
  },
  plasticChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  plasticChipTextSelected: {
    color: '#fff',
  },
  envSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
  },
  envBlock: {
    alignItems: 'center',
  },
  envIconWrapBlue: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  envIconWrapGreen: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  envLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  envVs: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
    fontWeight: '600',
    paddingTop: 16,
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  tableCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    minHeight: 44,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableHeaderCriteria: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  colFresh: {
    color: '#0EA5E9',
  },
  colMarine: {
    color: '#22C55E',
  },
  tableCriteria: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
    paddingRight: 4,
  },
  cellWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cellWithBar: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cellValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  cellValueText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 16,
    textAlign: 'center',
  },
  barBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  barFresh: {
    backgroundColor: '#0EA5E9',
  },
  barMarine: {
    backgroundColor: '#22C55E',
  },
  conclusionCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  conclusionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  conclusionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  conclusionText: {
    fontSize: 14,
    color: '#4338CA',
    lineHeight: 22,
  },
})

export default CompareEnvironmentsScreen
