import React, { FC, useContext, useState } from 'react';
import { Box, DropButton, ResponsiveContext } from 'grommet';
import { Add, SettingsOption } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';
import { AppState } from '../../../../store/reducers/root.reducer';
import Divider from './Divider';
import { openCreateZoneLayerAction } from '../../../../store/actions/zone.action';
import { openCreateChannelLayerAction } from '../../../../store/actions/channel.action';
import { logoutAction } from '../../../../store/actions/auth.action';
import ListButton from '../../../utils/ListButton';
import EllipsesOverflowText from '../../../utils/EllipsesOverflowText';
import ExtendedBox from '../../../utils/ExtendedBox';
import ZoneDropTheme from './ZoneDropTheme';
import { UserAvatar } from '../../../utils/Avatars/UserAvatar';
import { ZoneAvatar } from '../../../utils/Avatars/ZoneAvatar';

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
  const history = useHistory();
  const size = useContext(ResponsiveContext);
  const [open, setOpen] = useState(false);

  const createChannelButtonDisabled = userZones?.length === 0;
  return (
    <Box fill="horizontal" pad={{ horizontal: '16px' }}>
      <ZoneDropTheme>
        <DropButton
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
            <Box width={{ min: '210px' }}>
              <ListButton
                selected={!selectedUserZone}
                onClick={() => {
                  navigateToSubdomain();
                }}
                leftIcon={
                  user && (
                    <UserAvatar
                      id={user.id}
                      name={user.fullName}
                      src={user.displayPhoto}
                      size="small"
                      textProps={{ size: 'xsmall', weight: 'normal' }}
                    />
                  )
                }
                label={user?.fullName}
              />
              <Divider margin="none" />
              {userZones &&
                userZones.map((z) => (
                  <ListButton
                    selected={selectedUserZone?.zone.id === z.zone.id}
                    onClick={() => {
                      navigateToSubdomain(z.zone.subdomain);
                    }}
                    leftIcon={
                      <Box width={{ min: '24px' }} height="24px">
                        <ZoneAvatar
                          id={z.zone.id}
                          name={z.zone.name}
                          src={z.zone.displayPhoto}
                          size="small"
                          textProps={{ size: 'xsmall', weight: 'normal' }}
                        />
                      </Box>
                    }
                    key={z.zone.id}
                    label={z.zone.name}
                  />
                ))}
              <Divider margin={{ vertical: 'xxsmall' }} />
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
                      createChannelButtonDisabled
                        ? 'status-disabled'
                        : '#444444'
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
                rightIcon={<Add size="small" color="#444444" />}
              />
              <Divider margin={{ vertical: 'xxsmall' }} />
              <ListButton
                label={t('ZoneSelector.settings')}
                onClick={() => history.push('/settings')}
                rightIcon={<SettingsOption size="small" color="#444444" />}
              />
              <Divider margin={{ vertical: 'xxsmall' }} />
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
            <ExtendedBox
              fill="horizontal"
              align="center"
              justify="around"
              gap="small"
              background="linear-gradient(133.92deg, #9060eb 0%, #7d4cdb 98.18%)"
              round="16px"
              border={{ size: '1.2px', color: 'white' }}
              pad={{
                horizontal: 'small',
                vertical: size === 'small' ? 'medium' : 'small',
              }}
              boxShadow="inset 0px 0px 15px 0.6px rgba(255, 255, 255, 0.2)"
            >
              {selectedUserZone ? (
                <ZoneAvatar
                  id={selectedUserZone.zone.id}
                  name={selectedUserZone.zone.name}
                  src={selectedUserZone.zone.displayPhoto}
                />
              ) : (
                user && (
                  <UserAvatar
                    id={user.id}
                    name={user.fullName}
                    src={user.displayPhoto}
                  />
                )
              )}
              <Box align="center">
                <EllipsesOverflowText
                  maxWidth="111px"
                  textAlign="center"
                  weight="bold"
                  size="xsmall"
                  color="white"
                >
                  {selectedUserZone
                    ? selectedUserZone.zone.name
                    : user?.fullName}
                </EllipsesOverflowText>
              </Box>
            </ExtendedBox>
          </Box>
        </DropButton>
      </ZoneDropTheme>
    </Box>
  );
};

export default ZoneSelector;
