/* eslint-disable no-unused-vars */
import React, { FC, ReactNode } from 'react';
import { Box, Image, Menu, Text } from 'grommet';
import { Desktop, PhoneHorizontal, PhoneVertical } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import usa from '../../../../assets/country-flags/usa.svg';

interface TopCountriesItem {
  name: string;
  rate: number;
}

interface TopCountriesProps {
  topCountries: TopCountriesItem[];
}

const TopCountries: FC<TopCountriesProps> = ({ topCountries }) => {
  const { t } = useTranslation();

  const renderTopCountries = ({
    name,
    rate,
  }: {
    name: string;
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
          <Image sizes="small" src={usa} />
        </Box>
        <Text size="small">{name}</Text>
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
      <Text>{t('Analytics.topCountries')}</Text>
      {topCountries.map(renderTopCountries)}
    </Box>
  );
};

export default TopCountries;
