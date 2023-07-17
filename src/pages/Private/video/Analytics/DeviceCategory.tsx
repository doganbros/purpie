/* eslint-disable no-unused-vars */
import React, { FC, ReactNode } from 'react';
import { Box, Menu, Text } from 'grommet';
import { Desktop, PhoneHorizontal, PhoneVertical } from 'grommet-icons';
import { useTranslation } from 'react-i18next';

interface DeviceCategoryItem {
  phoneRate?: number;
  desktopRate?: number;
  tabletRate?: number;
}

interface DeviceCategoryProps {
  deviceRates?: DeviceCategoryItem;
}

const DeviceCategory: FC<DeviceCategoryProps> = ({ deviceRates }) => {
  const { t } = useTranslation();

  const DEVICE_CATEGORIES = [
    {
      icon: <PhoneVertical />,
      text: 'Analytics.mobile',
      rate: deviceRates?.phoneRate || 0,
    },
    {
      icon: <Desktop />,
      text: 'Analytics.desktop',
      rate: deviceRates?.desktopRate || 0,
    },
    {
      icon: <PhoneHorizontal />,
      text: 'Analytics.tablet',
      rate: deviceRates?.tabletRate || 0,
    },
  ];
  const renderDeviceCategory = ({
    icon,
    text,
    rate,
  }: {
    icon: ReactNode;
    text: string;
    rate: number;
  }) => (
    <Box direction="row" align="center" justify="between" gap="small">
      <Box direction="row" align="center" gap="small">
        <Box
          background="rgba(144, 96, 235, 0.2)"
          justify="center"
          round="small"
          pad="xsmall"
        >
          {icon}
        </Box>
        <Text size="small">{t(text)}</Text>
      </Box>
      <Text weight="bold" color="#3D138D">
        {rate}%
      </Text>
    </Box>
  );

  return (
    <Box
      width="100%"
      border={{ color: '#EFF0F6', size: 'small' }}
      round
      pad="small"
      gap="small"
    >
      <Text>{t('Analytics.deviceCategory')}</Text>
      {DEVICE_CATEGORIES.map(renderDeviceCategory)}
    </Box>
  );
};

export default DeviceCategory;
