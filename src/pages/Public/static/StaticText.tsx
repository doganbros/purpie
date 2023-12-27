import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Text } from 'grommet';
import { nanoid } from 'nanoid';

interface Props {
  tKey: string | ReactNode;
  searchText?: string;
}

const StaticText: FC<Props> = ({ tKey, searchText }) => {
  const { t } = useTranslation();

  let labelParts: { part: string; id: string }[] = [];
  if (typeof tKey === 'string') {
    labelParts = t(tKey)
      .split(new RegExp(`(${searchText})`, 'gi'))
      .map((p) => ({ part: p, id: nanoid() }));
  }

  return (
    <Text color="dark" size="small" weight="normal">
      {labelParts.length > 0 && (
        <Box direction="column">
          <Text size="small" weight={400} color="dark">
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
        </Box>
      )}
      {/* {!searchText && typeof tKey === 'string' ? t(tKey) : tKey} */}
    </Text>
  );
};

export default StaticText;
