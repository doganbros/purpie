import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'grommet';

interface Props {
  tKey: string | ReactNode;
}

const StaticText: FC<Props> = ({ tKey }) => {
  const { t } = useTranslation();

  return (
    <Text color="dark" size="small" weight="normal">
      {typeof tKey === 'string' ? t(tKey) : tKey}
    </Text>
  );
};

export default StaticText;
