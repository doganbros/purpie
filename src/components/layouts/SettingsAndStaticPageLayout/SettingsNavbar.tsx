import { Avatar, Box } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';
import LogoWhite from '../../../assets/purpie-logo/logo-white.svg';

interface SettingsNavbarProps {
  search: string;
  setSearch: (val: string) => void;
}

const SettingsNavbar: FC<SettingsNavbarProps> = ({ search, setSearch }) => {
  const history = useHistory();

  return (
    <Box direction="row" pad="medium" background="brand" height="100px">
      <Box
        onClick={() => history.push('/')}
        width="300px"
        align="start"
        justify="center"
        focusIndicator={false}
      >
        <Avatar round="0" src={LogoWhite} />
      </Box>
      <Box fill="horizontal" justify="center">
        <Box
          fill="horizontal"
          width={{ max: '1440px' }}
          alignSelf="center"
          pad={{ horizontal: 'medium' }}
        >
          <SearchBar value={search} onChange={setSearch} />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsNavbar;
