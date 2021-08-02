import { Avatar, Box, Button } from 'grommet';
import { useHistory } from 'react-router-dom';
import React, { FC } from 'react';
import ExtendedBox from '../../../utils/ExtendedBox';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import ZoneSelector from '../ZoneSelector';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const leftSidebarWidth = 135;
const topHeight = 140;
const rightSidebarWidth = 400;

const Desktop: FC<Props> = ({ children, rightComponent, topComponent }) => {
  const history = useHistory();

  return (
    <Box width="100vw" height="100vh" elevation="xlarge" round="large">
      <ExtendedBox
        background="#7d4cdb"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        round="large"
        pad={{ right: '100px' }}
        width={`${leftSidebarWidth + 100}px`}
      >
        <Button
          margin={{ vertical: 'medium' }}
          onClick={() => history.push('/')}
        >
          <Box align="center">
            <Avatar alignSelf="center" size="large" round="medium" src={Logo} />
          </Box>
        </Button>
        <Box>
          <ZoneSelector />
        </Box>
        <Sidebar />
      </ExtendedBox>
      <ExtendedBox
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        left={`${leftSidebarWidth}px`}
        background="white"
        round={{ corner: 'left', size: 'large' }}
      />
      <ExtendedBox
        position="absolute"
        top="0"
        left={`${leftSidebarWidth}px`}
        right={`${rightComponent ? rightSidebarWidth : 0}px`}
        minHeight="100vh"
        pad={{
          top: `${topComponent ? topHeight : 0}px`,
          horizontal: 'large',
        }}
      >
        {topComponent && (
          <ExtendedBox
            position="fixed"
            top="0"
            right={`${rightComponent ? rightSidebarWidth : 0}px`}
            left={`${leftSidebarWidth}px`}
            height={`${topHeight}px`}
            round={{ corner: 'top-left', size: 'large' }}
            background="white"
            pad={{ left: 'large' }}
          >
            <Box fill justify="center" overflow="auto">
              <ExtendedBox fill minWidth="min-content">
                {topComponent}
              </ExtendedBox>
            </Box>
            <Box fill="horizontal" height="3px" pad={{ right: 'large' }}>
              <Box fill background="#E4E9F2" />
            </Box>
          </ExtendedBox>
        )}
        {children}
        {rightComponent && (
          <ExtendedBox
            position="fixed"
            top="0"
            bottom="0"
            right="0"
            width={`${rightSidebarWidth}px`}
            background="white"
            round="large"
            elevation="xlarge"
            overflow="auto"
          >
            <ExtendedBox fill minWidth="min-content">
              {rightComponent}
            </ExtendedBox>
          </ExtendedBox>
        )}
      </ExtendedBox>
    </Box>
  );
};

export default Desktop;
