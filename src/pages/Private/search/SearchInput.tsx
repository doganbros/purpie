import { Box, Button, Text } from 'grommet';
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from '../../../components/utils/SearchBar';
import { SearchParams, SearchScope } from '../../../models/utils';

const SearchFilter = [
  { id: 1, scope: SearchScope.post },
  { id: 2, scope: SearchScope.channel },
  { id: 3, scope: SearchScope.zone },
  { id: 4, scope: SearchScope.profile },
];

const SearchInput: FC = () => {
  const { value, scope: activeScope } = useParams<SearchParams>();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <Box direction="column">
      <Box>
        <SearchBar initialValue={value} scope={activeScope} />
        <Box direction="row" justify="around" margin={{ top: 'medium' }}>
          {SearchFilter.map(({ id, scope }) => (
            <Button
              key={id}
              plain
              onClick={() => history.push(`/search/${scope}/${value}`)}
            >
              <Text
                weight="bold"
                color={scope === activeScope ? 'brand' : 'status-disabled'}
              >
                {t(`common.${scope}`)}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchInput;
