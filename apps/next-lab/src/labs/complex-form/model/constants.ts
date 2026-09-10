import { CampaignSectionId } from './types';

/**
 * 캠페인 폼의 섹션 element id입니다. 각 섹션에는 정해진 id를 사용해야 합니다.
 */
export const CAMPAIGN_SECTION_IDS = {
  BASIC: 'section-basic',
  PERIOD: 'section-period',
  BUDGET: 'section-budget',
  EXPOSURE: 'section-exposure',
  TARGETING: 'section-targeting',
  CREATIVE: 'section-creative',
} as const;

export interface CompaignSectionConfig {
  id: CampaignSectionId;
  label: string;
}

export const CAMPAIGN_SECTIONS: CompaignSectionConfig[] = [
  {
    id: CAMPAIGN_SECTION_IDS.BASIC,
    label: '기본 정보',
  },
  {
    id: CAMPAIGN_SECTION_IDS.PERIOD,
    label: '기간 설정',
  },
  {
    id: CAMPAIGN_SECTION_IDS.BUDGET,
    label: '예산 설정',
  },
  {
    id: CAMPAIGN_SECTION_IDS.EXPOSURE,
    label: '노출 시간대',
  },
  {
    id: CAMPAIGN_SECTION_IDS.TARGETING,
    label: '타게팅',
  },
  {
    id: CAMPAIGN_SECTION_IDS.CREATIVE,
    label: '광고 소재',
  },
];

export const CAMPAIGN_MODES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
} as const;
