import React, { FC } from 'react';
import { TextInput } from 'grommet';
import { Search } from 'grommet-icons';

const Searchbar: FC = () => (
  <TextInput icon={<Search color="light-4" />} reverse placeholder="Search" />
);

export default Searchbar;
