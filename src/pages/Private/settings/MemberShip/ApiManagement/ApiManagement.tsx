import { useTranslation } from 'react-i18next';
import { Box, Button } from 'grommet';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '../../../../../components/layouts/SettingsAndStaticPageLayout/types';
import {
  generateApiKeyAndSecretAction,
  getApiKeyAndSecretAction,
} from '../../../../../store/actions/api.actions';
import { AppState } from '../../../../../store/reducers/root.reducer';
import ApiText from './ApiText';

const ApiManagement: () => Menu | null = () => {
  const { t } = useTranslation();
  const {
    api: { apiKey, apiSecret },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const handleCreate = () => {
    dispatch(generateApiKeyAndSecretAction());
  };
  useEffect(() => {
    dispatch(getApiKeyAndSecretAction());
  }, []);
  return {
    id: 0,
    key: 'apiManagement',
    label: t('settings.apiManagement'),
    url: 'apiManagement',
    items: [
      {
        key: 'apiManagement',
        label: t('settings.apiManagementSubText'),
        component: (
          <Box
            justify="between"
            align="start"
            round="small"
            gap="small"
            pad="xxsmall"
          >
            {/* <Text>Manage Your Api and Usage</Text> */}
            <Box gap="small">
              <ApiText
                text={apiKey || '*'.repeat(100)}
                title={t('settings.apiKey')}
                copyActive={
                  apiKey !== undefined && apiKey !== null && apiKey?.length > 0
                }
              />
              <ApiText
                text={apiSecret || '*'.repeat(apiKey?.length * 1.4 || 100)}
                title={t('settings.apiSecret')}
                copyActive={
                  apiSecret !== undefined &&
                  apiSecret !== null &&
                  apiSecret?.length > 0
                }
              />
            </Box>
            <Button
              onClick={handleCreate}
              primary
              label={t(
                apiKey.length > 0
                  ? 'settings.regenerateApi'
                  : 'settings.generateApi'
              )}
            />
          </Box>
        ),
      },
    ],
  };
};

export default ApiManagement;
