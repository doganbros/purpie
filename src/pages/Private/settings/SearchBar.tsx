import React, { FC } from 'react';
import { Text, TextInput, ThemeContext } from 'grommet';
import { Search } from 'grommet-icons';

interface SearchBarProps {
  value: string;
  onChange: (arg0: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => (
  <ThemeContext.Extend
    value={{
      textInput: {
        extend: () => `
          color: white;
          border-color: white;
        `,
      },
    }}
  >
    <TextInput
      placeholder={
        <Text color="white" size="small">
          Search
        </Text>
      }
      value={value}
      onChange={(event) => onChange(event.target.value)}
      icon={<Search color="white" />}
      reverse
    />
  </ThemeContext.Extend>
);

export default SearchBar;
