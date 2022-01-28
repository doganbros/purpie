import { TextInput } from 'grommet';
import { Search } from 'grommet-icons';
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchScope } from '../../store/types/search.types';

interface SearchBarProps {
  initialValue?: string;
  scope?: SearchScope;
}

const SearchBar: FC<SearchBarProps> = ({
  initialValue = '',
  scope = SearchScope.post,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const history = useHistory();

  const handleSearch = (v: string, s: SearchScope) => {
    history.push(`/search/${s}/${v}`);
  };

  return (
    <TextInput
      icon={
        <Search
          onClick={() => handleSearch(inputValue, scope)}
          color="light-4"
        />
      }
      onKeyUp={(e) => {
        if (e.key === 'Enter') handleSearch(inputValue, scope);
      }}
      reverse
      placeholder="Search"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default SearchBar;
