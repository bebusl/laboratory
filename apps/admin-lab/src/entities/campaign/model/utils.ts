import { CAMPAIGN_MODES } from './constants';
import { CampaignFormMode } from './types';

export const isValidCampaignFormMode = (mode: string): mode is CampaignFormMode =>
  Object.values(CAMPAIGN_MODES).some(value => value === mode);
