import { supabase } from '@/lib/supabase';

export interface Pollutant {
  id: string;
  name: string;
  scientific_name: string | null;
  description: string | null;
  structure_formula: string | null;
  structure_image_url: string | null;

  /**
   * Tối đa 6 giai đoạn phân hủy:
   * - outer_image_url: ảnh hiển thị ngoài danh sách
   * - modal_image_url: ảnh hiển thị trong popup chi tiết
   * - title: tiêu đề bước
   * - content: nội dung mô tả (multi-line, có thể chứa bullet)
   */
  degradation_stage1_outer_image_url: string | null;
  degradation_stage1_modal_image_url: string | null;
  degradation_stage1_title: string | null;
  degradation_stage1_content: string | null;

  degradation_stage2_outer_image_url: string | null;
  degradation_stage2_modal_image_url: string | null;
  degradation_stage2_title: string | null;
  degradation_stage2_content: string | null;

  degradation_stage3_outer_image_url: string | null;
  degradation_stage3_modal_image_url: string | null;
  degradation_stage3_title: string | null;
  degradation_stage3_content: string | null;

  degradation_stage4_outer_image_url: string | null;
  degradation_stage4_modal_image_url: string | null;
  degradation_stage4_title: string | null;
  degradation_stage4_content: string | null;

  degradation_stage5_outer_image_url: string | null;
  degradation_stage5_modal_image_url: string | null;
  degradation_stage5_title: string | null;
  degradation_stage5_content: string | null;

  degradation_stage6_outer_image_url: string | null;
  degradation_stage6_modal_image_url: string | null;
  degradation_stage6_title: string | null;
  degradation_stage6_content: string | null;

  category: 'plastic' | 'oil' | 'chemical' | 'other' | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enzyme {
  id: string;
  name: string;
  full_name: string | null;
  ec_number: string | null;
  description: string | null;
  mechanism: string | null;
  optimal_ph_min: number | null;
  optimal_ph_max: number | null;
  optimal_temperature_celsius: number | null;
  structure_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Microorganism {
  id: string;
  name: string;
  scientific_name: string | null;
  kingdom: string | null;
  description: string | null;
  habitat: string | null;
  optimal_ph_min: number | null;
  optimal_ph_max: number | null;
  optimal_temperature_celsius: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string | null;
  environment_type: 'freshwater' | 'marine' | 'soil' | 'other';
  pollutant_id: string;
  microorganism_id: string | null;
  pathway_id: string | null;
  advantages: string | null;
  limitations: string | null;
  conditions: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  microorganisms?: { name: string; scientific_name: string | null } | null;
}

/** Parse speed % from description (e.g. "đạt 12% sau" or "chỉ đạt 5%") */
export function parseSpeedFromDescription(description: string | null): string {
  if (!description) return '—';
  const match = description.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? `${match[1]}%` : '—';
}

/** Parse salinity from conditions (e.g. "độ mặn: 0.2 ppt" or "35.2 ppt") */
export function parseSalinityFromConditions(conditions: string | null): string {
  if (!conditions) return '—';
  const match = conditions.match(/(?:độ mặn[:\s]*)?(\d+(?:\.\d+)?)\s*ppt/);
  return match ? `${match[1]} ppt` : '—';
}

export const BiodegradationService = {
  /**
   * Lấy danh sách pollutants
   */
  async getPollutants(): Promise<Pollutant[]> {
    try {
      const { data, error } = await supabase
        .from('pollutants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pollutants:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPollutants:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách enzymes
   */
  async getEnzymes(): Promise<Enzyme[]> {
    try {
      const { data, error } = await supabase
        .from('enzymes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching enzymes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEnzymes:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách microorganisms
   */
  async getMicroorganisms(): Promise<Microorganism[]> {
    try {
      const { data, error } = await supabase
        .from('microorganisms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching microorganisms:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMicroorganisms:', error);
      throw error;
    }
  },

  /**
   * Lấy một pollutant theo ID
   */
  async getPollutantById(id: string): Promise<Pollutant | null> {
    try {
      const { data, error } = await supabase
        .from('pollutants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching pollutant:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getPollutantById:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách enzymes liên quan đến một pollutant
   */
  async getEnzymesForPollutant(pollutantId: string): Promise<Enzyme[]> {
    try {
      const { data: linkData, error: linkError } = await supabase
        .from('enzyme_pollutant_relationships')
        .select('enzyme_id')
        .eq('pollutant_id', pollutantId);

      if (linkError || !linkData?.length) return [];

      const enzymeIds = linkData.map((r) => r.enzyme_id);
      const { data, error } = await supabase
        .from('enzymes')
        .select('*')
        .in('id', enzymeIds);

      if (error) {
        console.error('Error fetching enzymes for pollutant:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getEnzymesForPollutant:', error);
      return [];
    }
  },

  /**
   * Lấy một vi sinh vật tiêu biểu cho pollutant (qua enzyme chung)
   */
  async getRepresentativeMicroorganismForPollutant(
    pollutantId: string
  ): Promise<Microorganism | null> {
    try {
      const { data: linkData, error: linkError } = await supabase
        .from('enzyme_pollutant_relationships')
        .select('enzyme_id')
        .eq('pollutant_id', pollutantId)
        .limit(1);

      if (linkError || !linkData?.length) return null;

      const { data: microLink, error: microError } = await supabase
        .from('microorganism_enzyme_relationships')
        .select('microorganism_id')
        .eq('enzyme_id', linkData[0].enzyme_id)
        .limit(1)
        .maybeSingle();

      if (microError || !microLink) return null;

      const { data: micro, error } = await supabase
        .from('microorganisms')
        .select('*')
        .eq('id', microLink.microorganism_id)
        .single();

      if (error) return null;
      return micro;
    } catch (error) {
      console.error('Error in getRepresentativeMicroorganismForPollutant:', error);
      return null;
    }
  },

  /**
   * Lấy case studies so sánh nước ngọt vs nước biển cho một pollutant
   */
  async getCaseStudiesForComparison(pollutantId: string): Promise<{
    freshwater: CaseStudy | null;
    marine: CaseStudy | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select(`
          *,
          microorganisms (name, scientific_name)
        `)
        .eq('pollutant_id', pollutantId)
        .in('environment_type', ['freshwater', 'marine'])
        .order('environment_type', { ascending: true });

      if (error) {
        console.error('Error fetching case studies:', error);
        throw error;
      }

      const list = (data || []) as CaseStudy[];
      const freshwater = list.find((c) => c.environment_type === 'freshwater') ?? null;
      const marine = list.find((c) => c.environment_type === 'marine') ?? null;

      return { freshwater, marine };
    } catch (error) {
      console.error('Error in getCaseStudiesForComparison:', error);
      throw error;
    }
  },
};
