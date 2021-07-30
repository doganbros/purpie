import { Avatar, Box, Button } from 'grommet';
import { Icon } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC } from 'react';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import ZoneSelector from '../ZoneSelector';

interface Props {
  topComponent?: React.ReactNode;
  icon?: Icon;
  rightComponent?: React.ReactNode;
}

const Desktop: FC<Props> = ({ children, rightComponent, topComponent }) => {
  const history = useHistory();

  return (
    <Box
      height="100vh"
      round="45px"
      style={{
        boxShadow: '0px 30px 50px rgba(243, 111, 62, 0.15)',
      }}
    >
      <Box
        background="#7D4CDB"
        width="228px"
        round="45px 0 0 45px"
        pad="0 93px 0 0"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Button
          margin={{ vertical: 'medium' }}
          onClick={() => history.push('/')}
        >
          <Box align="center">
            <Avatar alignSelf="center" size="72px" round="medium" src={Logo} />
          </Box>
        </Button>
        <Box>
          <ZoneSelector />
        </Box>
        <Sidebar />
      </Box>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '135px',
          right: 0,
          borderRadius: '45px 0 0 45px',
          background: 'white',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: '135px',
          right: '387px',
          minHeight: '100vh',
          paddingTop: topComponent ? '140px' : '0',
          paddingLeft: '45px',
        }}
      >
        {topComponent && (
          <Box
            style={{
              position: 'fixed',
              top: 0,
              right: '387px',
              left: '135px',
              height: '140px',
              overflow: 'auto',
              borderRadius: '45px 0 0 0',
              backgroundColor: 'white',
              paddingLeft: '45px',
            }}
          >
            <Box
              style={{
                minWidth: 'min-content',
              }}
            >
              {topComponent}
            </Box>
          </Box>
        )}
        {children}
        <Box
          style={{
            position: 'fixed',
            top: '0',
            bottom: '0',
            right: '0',
            width: '387px',
            backgroundColor: 'white',
            borderRadius: '45px',
            boxShadow: '-5px 5px 30px rgba(61, 19, 141, 0.15)',
            overflow: 'auto',
          }}
        >
          <Box
            style={{
              minHeight: 'min-content',
            }}
          >
            {rightComponent}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Desktop;
