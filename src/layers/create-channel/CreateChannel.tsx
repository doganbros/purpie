import React, { FC, useContext } from 'react';
import {
  Box,
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  Layer,
  ResponsiveContext,
  Select,
  Text,
  TextArea,
  TextInput,
  ThemeContext,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../store/reducers/root.reducer';
import { CreateChannelPayload } from '../../store/types/channel.types';
import {
  closeCreateChannelLayerAction,
  createChannelAction,
} from '../../store/actions/channel.action';
import { validators } from '../../helpers/validators';
import Switch from '../../components/utils/Switch';
import { CreateFormTheme } from '../create-zone/custom-theme';

interface CreateChannelProps {
  onDismiss: () => void;
}

const CreateChannel: FC<CreateChannelProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);

  return (
    <Layer onClickOutside={onDismiss}>
      <ThemeContext.Extend value={CreateFormTheme}>
        <Box
          width={size !== 'small' ? '720px' : undefined}
          round={size !== 'small' ? '20px' : undefined}
          fill={size === 'small'}
          background="white"
          pad="medium"
          gap="medium"
        >
          <Box direction="row" justify="between" align="start">
            <Box pad="xsmall">
              <Text size="large" weight="bold">
                {t('CreateChannel.title')}
              </Text>
              <Text size="small" color="status-disabled">
                {t('CreateZone.description')}
              </Text>
            </Box>
            <Button plain onClick={onDismiss}>
              <Close color="brand-alt" />
            </Button>
          </Box>
          <Form
            onSubmit={({
              value,
            }: FormExtendedEvent<
              CreateChannelPayload & { zoneId: number }
            >) => {
              const { zoneId, ...payload } = value;
              dispatch(createChannelAction(zoneId, payload));
              dispatch(closeCreateChannelLayerAction());
            }}
          >
            <Box height={{ min: 'min-content' }}>
              <FormField
                name="zoneId"
                validate={[validators.required(t('common.zone'))]}
              >
                <Select
                  name="zoneId"
                  options={
                    userZones
                      ?.filter((z) => !!z.id)
                      .map((z) => ({
                        name: z.zone.name,
                        cannotCreateChannel: !z.zoneRole.canCreateChannel,
                        id: z.id,
                        zoneId: z.zone.id,
                      })) || []
                  }
                  disabledKey="cannotCreateChannel"
                  labelKey="name"
                  valueKey={{ key: 'id', reduce: true }}
                  placeholder={`${t('common.zone')}*`}
                />
              </FormField>
              <Box direction="row" justify="between" align="start" gap="small">
                <FormField
                  width="60%"
                  name="name"
                  validate={[
                    validators.required(t('CreateChannel.channelName')),
                    validators.maxLength(32),
                    validators.minLength(t('CreateChannel.channelName'), 3),
                  ]}
                >
                  <TextInput
                    placeholder={`${t('CreateChannel.channelName')}*`}
                    name="name"
                  />
                </FormField>
                <FormField name="public" width="40%">
                  <Switch
                    defaultValue
                    label={t('common.public')}
                    name="public"
                  />
                </FormField>
              </Box>
              <FormField
                name="description"
                validate={[validators.maxLength(256)]}
              >
                <TextArea
                  resize={false}
                  placeholder={t('CreateChannel.channelDescription')}
                  name="description"
                />
              </FormField>
            </Box>

            <Button
              type="submit"
              primary
              label={t('common.create')}
              size="large"
              fill="horizontal"
              margin={{ top: 'medium' }}
            />
          </Form>
        </Box>
      </ThemeContext.Extend>
    </Layer>
  );
};

export default CreateChannel;
