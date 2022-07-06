import { Avatar, Box, Button } from 'grommet';
import { useHistory } from 'react-router-dom';
import React, { FC } from 'react';
import ExtendedBox from '../../../utils/ExtendedBox';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import ZoneSelector from '../ZoneSelector/ZoneSelector';
import GradientScroll from '../../../utils/GradientScroll';
import Divider from '../../../utils/Divider';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  rightComponentWithoutOverflow?: boolean;
}

const Desktop: FC<Props> = ({
  children,
  rightComponent,
  rightComponentWithoutOverflow = false,
  topComponent,
}) => {
  const history = useHistory();

  const leftComponentWidth = 135;
  const topComponentHeight = 140;
  const rightComponentWidth = 400;

  return (
    <Box width="100vw" height="100vh" elevation="xlarge" round="large">
      <ExtendedBox
        background="brand-2"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        pad={{ right: '100px' }}
        justify="between"
        align="center"
        width={`${leftComponentWidth + 100}px`}
      >
        <Box fill="horizontal">
          <Button
            margin={{ vertical: 'medium' }}
            onClick={() => history.push('/')}
          >
            <Box align="center">
              <Avatar
                alignSelf="center"
                size="90px"
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
        {children}
        {topComponent && (
          <ExtendedBox
            position="fixed"
            top="0"
            right={`${rightComponent ? rightComponentWidth : 0}px`}
            left={`${leftComponentWidth}px`}
            height={`${topComponentHeight}px`}
            round={{ corner: 'top-left', size: 'large' }}
            background="white"
            pad={{ horizontal: 'large' }}
            direction="column"
          >
            <GradientScroll height="100%">{topComponent}</GradientScroll>
            <Box fill="horizontal">
              <Divider />
            </Box>
          </ExtendedBox>
        )}
        {rightComponent && (
          <ExtendedBox
            position="fixed"
            top="0"
            bottom="0"
            right="0"
            width={`${rightComponentWidth}px`}
            background="white"
            round={{ corner: 'left', size: 'large' }}
            elevation="indigo"
            overflow={rightComponentWithoutOverflow ? 'hidden' : 'auto'}
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
