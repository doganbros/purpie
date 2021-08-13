import { Avatar, Box, Button } from 'grommet';
import { useHistory } from 'react-router-dom';
import React, { FC } from 'react';
import ExtendedBox from '../../../utils/ExtendedBox';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import ZoneSelector from '../ZoneSelector';
import Divider from '../../../utils/Divider';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Desktop: FC<Props> = ({ children, rightComponent, topComponent }) => {
  const history = useHistory();

  const leftComponentWidth = 135;
  const topComponentHeight = 140;
  const rightComponentWidth = 400;

  return (
    <Box width="100vw" height="100vh" elevation="xlarge" round="large">
      <ExtendedBox
        background="#7d4cdb"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        pad={{ right: '100px' }}
        justify="between"
        width={`${leftComponentWidth + 100}px`}
      >
        <Box>
          <Button
            margin={{ vertical: 'medium' }}
            onClick={() => history.push('/')}
          >
            <Box align="center">
              <Avatar
                alignSelf="center"
                size="large"
                round="medium"
                src={Logo}
              />
            </Box>
          </Button>
          <Box>
            <ZoneSelector />
          </Box>
        </Box>
        <Box margin={{ vertical: 'large' }}>
          <Sidebar />
        </Box>
      </ExtendedBox>
      <ExtendedBox
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        left={`${leftComponentWidth}px`}
        background="white"
        round={{ corner: 'left', size: 'large' }}
      />
      <ExtendedBox
        position="absolute"
        top="0"
        left={`${leftComponentWidth}px`}
        right={`${rightComponent ? rightComponentWidth : 0}px`}
        minHeight="100vh"
        pad={{
          top: `${topComponent ? topComponentHeight : 0}px`,
          horizontal: 'large',
        }}
      >
        {topComponent && (
          <ExtendedBox
            position="fixed"
            top="0"
            right={`${rightComponent ? rightComponentWidth : 0}px`}
            left={`${leftComponentWidth}px`}
            height={`${topComponentHeight}px`}
            round={{ corner: 'top-left', size: 'large' }}
            background="white"
            pad={{ left: 'large' }}
          >
            <Box fill justify="center" overflow="auto">
              <ExtendedBox fill minWidth="min-content">
                {topComponent}
              </ExtendedBox>
            </Box>
            <Box fill="horizontal" pad={{ right: 'large' }}>
              <Divider />
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
            width={`${rightComponentWidth}px`}
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
