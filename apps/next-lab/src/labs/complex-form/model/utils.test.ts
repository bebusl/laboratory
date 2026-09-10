import { describe, expect, it } from 'vitest';

import { isValidCampaignFormMode } from './utils';

describe('isValidCampaignFormMode', () => {
  it.each(['draft', 'scheduled'])('accepts the supported mode %s', mode => {
    expect(isValidCampaignFormMode(mode)).toBe(true);
  });

  it('rejects an unsupported mode', () => {
    expect(isValidCampaignFormMode('published')).toBe(false);
  });
});
