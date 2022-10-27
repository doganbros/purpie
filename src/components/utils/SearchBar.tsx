import { TextInput } from 'grommet';
import { Search } from 'grommet-icons';
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SearchScope } from '../../models/utils';

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
  const { t } = useTranslation();

  const handleSearch = (v: string, s: SearchScope) => {
    if (v && s) {
      history.push(`/search/${s}/${v}`);
    }
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
      placeholder={t('common.search')}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default SearchBar;
