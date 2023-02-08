import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'grommet';

interface Props {
  tKey: string;
}

const StaticTitle: FC<Props> = ({ tKey }) => {
  const { t } = useTranslation();

  return (
    <Text color="dark" size="16px" weight={500}>
      {t(tKey)}
    </Text>
  );
};

export default StaticTitle;
