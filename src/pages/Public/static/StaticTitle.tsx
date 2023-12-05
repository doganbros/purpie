import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'grommet';
import { nanoid } from 'nanoid';

interface Props {
  tKey: string;
  searchText?: string;
}

const StaticTitle: FC<Props> = ({ tKey, searchText }) => {
  const { t } = useTranslation();

  const labelParts: { part: string; id: string }[] = t(tKey)
    .split(new RegExp(`(${searchText})`, 'gi'))
    .map((p) => ({ part: p, id: nanoid() }));

  return (
    <Text color="dark" size="16px" weight={500}>
      {labelParts.map(({ part, id }) =>
        part.toLowerCase() !== searchText?.toLowerCase() ? (
          `${part}`
        ) : (
          <Text size="small" key={id} weight="bold">
            {part}
          </Text>
        )
      )}
    </Text>
  );
};

export default StaticTitle;
