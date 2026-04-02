'use client';

import { type ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { CAMPAIGN_MODES, CAMPAIGN_SECTIONS } from '@/entities/campaign/model/constants';
import { CampaignFormMode } from '@/entities/campaign/model/types';
import { isValidCampaignFormMode } from '@/entities/campaign/model/utils';
import { scrollToElement } from '@/shared/utils/scroll-to-element-id';

interface CreateCampaignNavigatorProps {
  onChangeMode: (mode: CampaignFormMode) => void;
}

const CreateCampaignNavigator = ({ onChangeMode }: CreateCampaignNavigatorProps) => {
  const [mode, setMode] = useState<CampaignFormMode>(CAMPAIGN_MODES.SCHEDULED);

  const handleChangeMode: ChangeEventHandler<HTMLSelectElement> = e => {
    const value = e.target.value;

    if (isValidCampaignFormMode(value)) {
      setMode(value);
      onChangeMode?.(value);
    }
  };

  const handleClickMenu: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();

    const targetSectionId = e.currentTarget.value;
    scrollToElement(targetSectionId, { offset: 30 });
  };

  return (
    <>
      <ul>
        {CAMPAIGN_SECTIONS.map(section => (
          <li key={`navigate-to-${section.id}`}>
            <button type="button" value={section.id} onClick={handleClickMenu}>
              {section.label}
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <label htmlFor="save-option">저장 상태</label>
      <select id="save-option" value={mode} onChange={handleChangeMode}>
        <option value="draft">임시 저장</option>
        <option value="scheduled">저장</option>
      </select>
    </>
  );
};

export default CreateCampaignNavigator;
