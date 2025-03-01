import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from 'grommet';
import { useDispatch } from 'react-redux';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import {
  UpdateChannelPayload,
  UserChannelListItem,
} from '../../../store/types/channel.types';
import {
  deleteChannelAction,
  unfollowChannelAction,
  updateChannelInfoAction,
} from '../../../store/actions/channel.action';

interface ChannelSettingsActionsProps {
  selectedUserChannel: UserChannelListItem | null;
  setSelectedUserChannel: (zone: UserChannelListItem | null) => void;
  channelPayload: UpdateChannelPayload;
}

const ChannelSettingsActions: FC<ChannelSettingsActionsProps> = ({
  selectedUserChannel,
  setSelectedUserChannel,
  channelPayload,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  if (!selectedUserChannel) return null;

  const isFormInitialState =
    channelPayload.name === selectedUserChannel?.channel.name &&
    channelPayload.description === selectedUserChannel?.channel?.description &&
    channelPayload.public === selectedUserChannel?.channel?.public;

  const canDelete = selectedUserChannel?.channelRole.canDelete;
  return (
    <Box direction="row" gap="small" align="end">
      <Button
        disabled={isFormInitialState}
        onClick={() =>
          dispatch(
            updateChannelInfoAction(
              selectedUserChannel.channel.id,
              channelPayload
            )
          )
        }
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
      />

      <Button
        onClick={() => setShowDeletePopup(true)}
        primary
        color="red"
        label={canDelete ? t('common.delete') : t('common.leave')}
        margin={{ vertical: 'medium' }}
      />

      {showDeletePopup && (
        <ConfirmDialog
          message={`${
            canDelete
              ? t('settings.deleteMessage')
              : t('settings.channelUnfollowMessage')
          } \n ${selectedUserChannel?.channel.name} channel?`}
          onConfirm={() => {
            if (canDelete) {
              dispatch(deleteChannelAction(selectedUserChannel.channel.id));
            } else {
              if (!selectedUserChannel) return;
              if (selectedUserChannel?.id) {
                dispatch(unfollowChannelAction(selectedUserChannel.id));
              }
            }
            setShowDeletePopup(false);
            setSelectedUserChannel(null);
          }}
          onDismiss={() => setShowDeletePopup(false)}
          textProps={{ wordBreak: 'break-word' }}
        />
      )}
    </Box>
  );
};

export default ChannelSettingsActions;
