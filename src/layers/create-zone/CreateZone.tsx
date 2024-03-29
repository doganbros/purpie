import React, { FC, useContext, useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createZoneAction } from '../../store/actions/zone.action';
import { CreateZonePayload } from '../../store/types/zone.types';
import { nameToSubdomain } from '../../helpers/utils';
import { appSubdomain, hostname } from '../../helpers/app-subdomain';
import { validators } from '../../helpers/validators';
import Switch from '../../components/utils/Switch';
import { CreateFormTheme } from './custom-theme';
import { AppState } from '../../store/reducers/root.reducer';

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

  const { createZoneError } = useSelector((state: AppState) => state.zone);

  const size = useContext(ResponsiveContext);

  const [subdomain, setSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState('');
  const [subdomainInputFocus, setSubdomainInputFocus] = useState(false);

  useEffect(() => {
    if (
      createZoneError &&
      createZoneError.message === 'ZONE_SUBDOMAIN_ALREADY_EXIST'
    ) {
      setSubdomainError(createZoneError.error || '');
    }
  }, [createZoneError]);

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
                    error={subdomainError}
                    width="60%"
                    name="name"
                    validate={[
                      validators.required(t('CreateZone.zoneName')),
                      validators.maxLength(32),
                      validators.minLength(t('CreateZone.zoneName'), 3),
                    ]}
                  >
                    <TextInput
                      placeholder={`${t('CreateZone.zoneName')}*`}
                      name="name"
                      onChange={({ target: { value } }) => {
                        if (subdomainError) setSubdomainError('');
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
                <FormField
                  name="description"
                  validate={validators.maxLength(256)}
                >
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
