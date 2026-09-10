import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import CreateCampaignNavigator from './CreateCampaignNavigator';

it('notifies the parent when the campaign mode changes', async () => {
  const user = userEvent.setup();
  const onChangeMode = vi.fn();

  render(<CreateCampaignNavigator onChangeMode={onChangeMode} />);

  await user.selectOptions(screen.getByLabelText('저장 상태'), 'draft');

  expect(onChangeMode).toHaveBeenCalledWith('draft');
});
