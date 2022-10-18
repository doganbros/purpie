import React, { FC, useContext, useState } from 'react';
import { Box, DropButton, ResponsiveContext } from 'grommet';
import { Add, SettingsOption } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';
import { AppState } from '../../../../store/reducers/root.reducer';
import Divider from './Divider';
import { openCreateZoneLayerAction } from '../../../../store/actions/zone.action';
import { openCreateChannelLayerAction } from '../../../../store/actions/channel.action';
import { logoutAction } from '../../../../store/actions/auth.action';
import InitialsAvatar from '../../../utils/InitialsAvatar';
import ListButton from '../../../utils/ListButton';
import EllipsesOverflowText from '../../../utils/EllipsesOverflowText';

const ZoneSelector: FC = () => {
  const { t } = useTranslation();
  const {
    zone: {
      getUserZones: { userZones },
      selectedUserZone,
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const createChannelButtonDisabled = userZones?.length === 0;
  return (
    <Box fill="horizontal" pad={{ horizontal: 'small' }}>
      <DropButton
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        fill="horizontal"
        plain
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        dropAlign={{ left: 'left', top: 'bottom' }}
        dropContent={
          <Box width={{ min: '250px' }}>
            <ListButton
              selected={!selectedUserZone}
              onClick={() => {
                navigateToSubdomain();
              }}
              leftIcon={
                user && (
                  <InitialsAvatar
                    id={user.id}
                    value={user.fullName}
                    size="small"
                    textProps={{ size: 'xsmall', weight: 'normal' }}
                  />
                )
              }
              label={user?.fullName}
            />
            {userZones &&
              userZones.map((z) => (
                <ListButton
                  selected={selectedUserZone?.zone.id === z.zone.id}
                  onClick={() => {
                    navigateToSubdomain(z.zone.subdomain);
                  }}
                  leftIcon={
                    <InitialsAvatar
                      id={z.zone.id}
                      value={z.zone.name}
                      size="small"
                      textProps={{ size: 'xsmall', weight: 'normal' }}
                    />
                  }
                  key={z.zone.id}
                  label={z.zone.name}
                />
              ))}
            <Divider />
            <ListButton
              onClick={() => {
                if (!createChannelButtonDisabled) {
                  setOpen(false);
                  dispatch(openCreateChannelLayerAction());
                }
              }}
              disabled={createChannelButtonDisabled}
              label={t('ZoneSelector.createChannel')}
              rightIcon={
                <Add
                  size="small"
                  color={
                    createChannelButtonDisabled ? 'status-disabled' : 'black'
                  }
                />
              }
            />
            <ListButton
              onClick={() => {
                setOpen(false);
                dispatch(openCreateZoneLayerAction());
              }}
              label={t('ZoneSelector.createZone')}
              rightIcon={<Add size="small" color="black" />}
            />
            <Divider />
            <ListButton
              label={t('ZoneSelector.settings')}
              rightIcon={<SettingsOption size="small" color="black" />}
            />
            <Divider />
            <ListButton
              onClick={() => dispatch(logoutAction())}
              label={t('ZoneSelector.signOut')}
            />
          </Box>
        }
        dropProps={{
          margin: { vertical: 'small' },
          elevation: 'medium',
          round: 'small',
          overflow: 'auto',
        }}
      >
        <Box fill="horizontal">
          <Box
            fill="horizontal"
            align="center"
            justify="around"
            background="brand"
            gap="small"
            pad={{
              horizontal: 'small',
              vertical: size === 'small' ? 'medium' : 'small',
            }}
            round="medium"
            elevation={hover ? 'indigo' : 'none'}
          >
            {selectedUserZone ? (
              <InitialsAvatar
                id={selectedUserZone.zone.id}
                value={selectedUserZone.zone.name}
              />
            ) : (
              user && <InitialsAvatar id={user.id} value={user.fullName} />
            )}
            <Box align="center">
              <EllipsesOverflowText
                maxWidth="111px"
                textAlign="center"
                weight="bold"
                size="xsmall"
                color="white"
              >
                {selectedUserZone ? selectedUserZone.zone.name : user?.fullName}
              </EllipsesOverflowText>
            </Box>
          </Box>
        </Box>
      </DropButton>
    </Box>
  );
};

export default ZoneSelector;
