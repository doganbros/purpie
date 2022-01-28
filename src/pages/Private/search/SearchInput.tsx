import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useHistory, useParams } from 'react-router-dom';
import SearchBar from '../../../components/utils/SearchBar';
import { SearchScope } from '../../../store/types/search.types';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const SearchFilter = [
  { id: 1, scope: SearchScope.post },
  { id: 2, scope: SearchScope.channel },
  { id: 3, scope: SearchScope.zone },
  { id: 4, scope: SearchScope.user },
];

const SearchInput: FC = () => {
  const { value, scope: activeScope } = useParams<SearchParams>();
  const history = useHistory();

  return (
    <Box direction="column">
      <Box pad={{ horizontal: 'small' }}>
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
                {scope[0].toUpperCase() + scope.substring(1)}
              </Text>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchInput;
