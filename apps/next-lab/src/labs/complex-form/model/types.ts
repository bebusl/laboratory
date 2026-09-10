import { CAMPAIGN_MODES, CAMPAIGN_SECTION_IDS } from './constants';

export type CampaignFormMode = (typeof CAMPAIGN_MODES)[keyof typeof CAMPAIGN_MODES];

export type CampaignSectionId = (typeof CAMPAIGN_SECTION_IDS)[keyof typeof CAMPAIGN_SECTION_IDS];
