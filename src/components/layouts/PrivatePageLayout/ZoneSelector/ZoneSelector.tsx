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
import { UserAvatar } from '../../../utils/Avatars/UserAvatar';
import { ZoneAvatar } from '../../../utils/Avatars/ZoneAvatar';
import './Style.scss';

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
  const [hover, setHover] = useState(false);

  const createChannelButtonDisabled = userZones?.length === 0;

  return (
    <Box fill="horizontal" pad={{ horizontal: '16px' }}>
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
          <Box
            width={{ min: '210px' }}
            gap={size === 'small' ? 'medium' : 'xxsmall'}
            background="white"
            className="not-select--5"
          >
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
            <Box
              overflow="auto"
              height={{ max: '180px' }}
              className="font-weight--bold"
            >
              {userZones &&
                userZones.map((z) => (
                  <ListButton
                    selected={selectedUserZone?.zone.id === z.zone.id}
                    onClick={() => {
                      navigateToSubdomain(z.zone.subdomain);
                      setOpen(false);
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
                    height={{ min: '40px' }}
                    flex={{ shrink: 1 }}
                  />
                ))}
            </Box>
            {userZones && userZones.length > 0 && (
              <Divider margin={{ vertical: 'xxsmall' }} />
            )}
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
                    createChannelButtonDisabled ? 'status-disabled' : 'dark-1'
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
              rightIcon={<Add size="small" color="dark-1" />}
            />
            <Divider margin={{ vertical: 'xxsmall' }} />
            <ListButton
              label={t('ZoneSelector.settings')}
              onClick={() => history.push('/settings')}
              rightIcon={<SettingsOption size="small" color="dark-1" />}
            />
            <ListButton
              label={t('ZoneSelector.support')}
              onClick={() => history.push('/support')}
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
            onMouseEnter={() => setHover(false)}
            onMouseLeave={() => setHover(false)}
            fill="horizontal"
            align="center"
            justify="around"
            gap="small"
            background="rgba(125 76 219)"
            round="16px"
            pad={{
              horizontal: 'small',
              vertical: size === 'small' ? 'medium' : 'small',
            }}
            boxShadow={`#3d138b${hover || open ? '99' : '66'} 0 0 10px 0`}
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
                maxWidth={size === 'small' ? '75px' : '92px'}
                textAlign="center"
                weight="bold"
                size="xsmall"
                color="white"
                text={
                  selectedUserZone ? selectedUserZone.zone.name : user?.fullName
                }
              />
            </Box>
          </ExtendedBox>
        </Box>
      </DropButton>
    </Box>
  );
};

export default ZoneSelector;
