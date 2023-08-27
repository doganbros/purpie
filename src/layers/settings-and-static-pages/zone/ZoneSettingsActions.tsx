import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteZoneAction,
  leaveZoneAction,
  updateZoneInfoAction,
} from '../../../store/actions/zone.action';
import {
  UpdateZonePayload,
  UserZoneListItem,
} from '../../../store/types/zone.types';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import { AppState } from '../../../store/reducers/root.reducer';

interface ZoneSettingsActionsProps {
  selectedZone: UserZoneListItem | null;
  setSelectedZone: (zone: UserZoneListItem | null) => void;
  zonePayload: UpdateZonePayload;
}

const ZoneSettingsActions: FC<ZoneSettingsActionsProps> = ({
  selectedZone,
  setSelectedZone,
  zonePayload,
}) => {
  const {
    zone: { selectedUserZone },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  if (!selectedZone) return null;

  const isFormInitialState =
    zonePayload.name === selectedZone?.zone.name &&
    zonePayload.description === selectedZone?.zone.description &&
    zonePayload.subdomain === selectedZone?.zone.subdomain &&
    zonePayload.public === selectedZone?.zone.public;

  const canDelete = selectedZone?.zoneRole.canDelete;
  return (
    <Box direction="row" gap="small" align="end">
      <Button
        disabled={isFormInitialState}
        onClick={() =>
          dispatch(updateZoneInfoAction(selectedZone!.zone.id, zonePayload))
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
              : t('settings.zoneLeaveMessage')
          } \n ${selectedZone?.zone.name} zone?`}
          onConfirm={() => {
            dispatch(
              canDelete
                ? deleteZoneAction(
                    selectedZone!.zone.id,
                    selectedZone?.zone.id === selectedUserZone?.zone.id
                  )
                : dispatch(leaveZoneAction(selectedZone!.id!))
            );

            setShowDeletePopup(false);
            setSelectedZone(null);
          }}
          onDismiss={() => setShowDeletePopup(false)}
          textProps={{ wordBreak: 'break-word' }}
        />
      )}
    </Box>
  );
};

export default ZoneSettingsActions;
