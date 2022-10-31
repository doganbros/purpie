import React, { FC, useContext, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  Layer,
  ResponsiveContext,
  Text,
  TextArea,
  TextInput,
  ThemeContext,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  closeCreateZoneLayerAction,
  createZoneAction,
} from '../../store/actions/zone.action';
import { CreateZonePayload } from '../../store/types/zone.types';
import { nameToSubdomain } from '../../helpers/utils';
import { appSubdomain, hostname } from '../../helpers/app-subdomain';
import { validators } from '../../helpers/validators';
import Switch from '../../components/utils/Switch';
import { CreateFormTheme } from './custom-theme';

const baseHost = hostname
  .split('.')
  .filter((v) => v !== appSubdomain)
  .join('.');

interface CreateZoneProps {
  onDismiss: () => void;
}

const CreateZone: FC<CreateZoneProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const size = useContext(ResponsiveContext);

  const [subdomain, setSubdomain] = useState('');
  const [subdomainInputFocus, setSubdomainInputFocus] = useState(false);

  return (
    <Layer onClickOutside={onDismiss}>
      <ThemeContext.Extend value={CreateFormTheme}>
        <Box
          width={size !== 'small' ? '710px' : undefined}
          round={size !== 'small' ? '20px' : undefined}
          fill={size === 'small'}
          background="white"
          pad="medium"
          gap="medium"
        >
          <Box direction="row" justify="between" align="start">
            <Box pad="xsmall">
              <Text size="large" weight="bold">
                {t('CreateZone.title')}
              </Text>
              <Text size="small" color="status-disabled">
                {t('CreateZone.description')}
              </Text>
            </Box>
            <Button plain onClick={onDismiss}>
              <Close color="brand-alt" />
            </Button>
          </Box>
          <Box height="100%">
            <Form
              onSubmit={({ value }: FormExtendedEvent<CreateZonePayload>) => {
                dispatch(createZoneAction({ ...value, subdomain }));
                dispatch(closeCreateZoneLayerAction());
              }}
            >
              <Box height={{ min: 'min-content' }}>
                <Box
                  direction="row"
                  justify="between"
                  align="start"
                  gap="small"
                >
                  <FormField
                    width="60%"
                    name="name"
                    validate={[validators.required(t('CreateZone.zoneName'))]}
                  >
                    <TextInput
                      placeholder={`${t('CreateZone.zoneName')}*`}
                      name="name"
                      onChange={({ target: { value } }) => {
                        setSubdomain(nameToSubdomain(value));
                      }}
                    />
                  </FormField>
                  <FormField width="40%" name="public">
                    <Switch
                      label={t('common.public')}
                      name="public"
                      defaultValue
                    />
                  </FormField>
                </Box>

                <FormField
                  name="subdomain"
                  // Validating subdomain state since component value can contain the full URL
                  validate={(_, data) =>
                    validators.required(t('CreateZone.zoneAddress'))(
                      subdomain,
                      data
                    ) ||
                    validators.minLength(t('CreateZone.zoneAddress'), 3)(
                      subdomain,
                      data
                    ) ||
                    validators.maxLength(
                      32,
                      t('CreateZone.zoneAddressTooLong')
                    )(subdomain, data) ||
                    validators.matches(
                      /^([a-z|\d][a-z|\d|-]+[a-z|\d])$/,
                      t('CreateZone.notValidZoneAddress')
                    )(subdomain, data) ||
                    undefined
                  }
                >
                  <TextInput
                    name="subdomain"
                    placeholder={`${t('CreateZone.zoneAddress')}*`}
                    value={
                      subdomainInputFocus || !subdomain
                        ? subdomain
                        : `${subdomain}.${baseHost}`
                    }
                    onChange={(e) => {
                      setSubdomain(e.target.value);
                    }}
                    onFocus={() => setSubdomainInputFocus(true)}
                    onBlur={() => setSubdomainInputFocus(false)}
                  />
                </FormField>
                <FormField name="description">
                  <TextArea
                    resize={false}
                    placeholder={t('CreateZone.zoneDescription')}
                    name="description"
                  />
                </FormField>
              </Box>
              <Button
                size="large"
                fill="horizontal"
                margin={{ top: 'medium' }}
                type="submit"
                primary
                label={t('common.create')}
              />
            </Form>
          </Box>
        </Box>
      </ThemeContext.Extend>
    </Layer>
  );
};

export default CreateZone;
