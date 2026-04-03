import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

import {
  BiodegradationService,
  type Pollutant,
} from '@/services/biodegradation.service'

type DegradationStage = {
  index: number
  outerImageUrl: string | null
  modalImageUrl: string | null
  title: string
  contentLines: string[]
}

const FALLBACK_CONTENT = 'Chưa có mô tả cho giai đoạn này.'

function parseContent(text: string | null): string[] {
  if (!text) return [FALLBACK_CONTENT]
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  return lines.length ? lines : [FALLBACK_CONTENT]
}

function buildStages(pollutant: Pollutant): DegradationStage[] {
  const rawStages = [
    {
      outer: pollutant.degradation_stage1_outer_image_url,
      modal: pollutant.degradation_stage1_modal_image_url,
      title: pollutant.degradation_stage1_title,
      content: pollutant.degradation_stage1_content,
    },
    {
      outer: pollutant.degradation_stage2_outer_image_url,
      modal: pollutant.degradation_stage2_modal_image_url,
      title: pollutant.degradation_stage2_title,
      content: pollutant.degradation_stage2_content,
    },
    {
      outer: pollutant.degradation_stage3_outer_image_url,
      modal: pollutant.degradation_stage3_modal_image_url,
      title: pollutant.degradation_stage3_title,
      content: pollutant.degradation_stage3_content,
    },
    {
      outer: pollutant.degradation_stage4_outer_image_url,
      modal: pollutant.degradation_stage4_modal_image_url,
      title: pollutant.degradation_stage4_title,
      content: pollutant.degradation_stage4_content,
    },
    {
      outer: pollutant.degradation_stage5_outer_image_url,
      modal: pollutant.degradation_stage5_modal_image_url,
      title: pollutant.degradation_stage5_title,
      content: pollutant.degradation_stage5_content,
    },
    {
      outer: pollutant.degradation_stage6_outer_image_url,
      modal: pollutant.degradation_stage6_modal_image_url,
      title: pollutant.degradation_stage6_title,
      content: pollutant.degradation_stage6_content,
    },
  ]

  return rawStages.map((stage, index) => ({
    index,
    outerImageUrl: stage.outer,
    modalImageUrl: stage.modal,
    title: stage.title || `Bước ${index + 1}`,
    contentLines: parseContent(stage.content),
  }))
}

export default function DegradationProcessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pollutantId = id ?? ''
  const [selectedStage, setSelectedStage] = useState<DegradationStage | null>(null)

  const { data: pollutant, isLoading } = useQuery({
    queryKey: ['pollutant', pollutantId],
    queryFn: () => BiodegradationService.getPollutantById(pollutantId),
    enabled: !!pollutantId,
  })

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

  const stages = useMemo(() => buildStages(pollutant), [pollutant])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quá trình phân hủy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Quá trình phân hủy nhựa {pollutant.name}</Text>
          <Text style={styles.heroSubtitle}>Chọn từng bước để xem chi tiết</Text>
        </View>

        {/* Danh sách 5 giai đoạn (ảnh chồng dọc) */}
        <View style={styles.stageList}>
          {stages.map((stage) => (
            <TouchableOpacity
              key={stage.index}
              activeOpacity={0.9}
              onPress={() => setSelectedStage(stage)}
            >
              <View style={styles.stageCard}>
                {stage.outerImageUrl ? (
                  <Image
                    source={{ uri: stage.outerImageUrl }}
                    style={styles.stageImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.stageImagePlaceholder}>
                  </View>
                )}

              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Popup chi tiết giai đoạn */}
      <Modal
        visible={!!selectedStage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedStage(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              {selectedStage && (
                <View style={styles.modalStepBadge}>
                  <Text style={styles.modalStepBadgeText}>
                    Bước {selectedStage.index + 1}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => setSelectedStage(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedStage && (
              <>
                <Text style={styles.modalTitle}>{selectedStage.title}</Text>

                {selectedStage.modalImageUrl && (
                  <Image
                    source={{ uri: selectedStage.modalImageUrl }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                <ScrollView
                  style={styles.modalContentScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedStage.contentLines.map((line, index) => {
                    const isBullet = line.startsWith('- ')
                    const text = isBullet ? line.replace(/^-\\s*/, '') : line
                    return isBullet ? (
                      <View key={index} style={styles.modalBulletRow}>
                        <Text style={styles.modalBulletText}>{text}</Text>
                      </View>
                    ) : (
                      <Text key={index} style={styles.modalParagraph}>
                        {text}
                      </Text>
                    )
                  })}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    padding: 20,
    backgroundColor: '#fff',
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
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#DCFCE7',
  },
  stageList: {
    gap: 16,
  },
  stageCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  stageImage: {
    width: '100%',
    height: 220,
  },
  stageImagePlaceholder: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  stageImagePlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  stageBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stageBadgeNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  stageTitle: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalStepBadge: {
    backgroundColor: '#15803D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modalStepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  modalImage: {
    width: '100%',
    height: 180,
    marginBottom: 12,
  },
  modalContentScroll: {
    maxHeight: 220,
  },
  modalParagraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 6,
  },
  modalBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  modalBulletDot: {
    fontSize: 14,
    color: '#374151',
    marginRight: 6,
    marginTop: 1,
  },
  modalBulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
})

