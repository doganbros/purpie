import React, { FC, useContext, useState } from 'react';
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
import { getZoneCategoriesAction } from '../../store/actions/zone.action';
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
      getZoneCategories: { categories },
      getUserZones: { userZones },
      selectedUserZone,
    },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);

  const [userZone, setUserZone] = useState<any>(selectedUserZone?.id);
  const [category, setCategory] = useState();

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
              <Text size="large">{t('CreateChannel.title')}</Text>
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
            <Box height="262px" flex={false} overflow="auto">
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
                    placeholder={t('common.zone')}
                    onChange={({ option }) => {
                      setUserZone(option.id);
                      setCategory(undefined);
                      dispatch(getZoneCategoriesAction(option.zoneId));
                    }}
                  />
                </FormField>
                <FormField
                  name="name"
                  validate={[
                    validators.required(t('CreateChannel.channelName')),
                  ]}
                >
                  <TextInput
                    placeholder={t('CreateChannel.channelName')}
                    name="name"
                  />
                </FormField>
                <FormField name="description">
                  <TextArea
                    resize={false}
                    placeholder={t('CreateChannel.channelDescription')}
                    name="description"
                  />
                </FormField>
                <Box
                  direction="row"
                  justify="between"
                  align="start"
                  gap="small"
                >
                  <FormField name="categoryId" width="100%">
                    <Select
                      options={categories || []}
                      disabled={!userZone}
                      name="categoryId"
                      placeholder={t('common.category')}
                      labelKey="name"
                      valueKey={{ key: 'id', reduce: true }}
                      value={category}
                      onChange={({ value }) => setCategory(value)}
                    />
                  </FormField>
                  <FormField name="public" width="100%">
                    <Switch label={t('common.public')} name="public" />
                  </FormField>
                </Box>
              </Box>
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
