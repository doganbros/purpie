import { Avatar, Box, Button } from 'grommet';
import React, { FC } from 'react';
import ExtendedBox from '../../../utils/ExtendedBox';
import LogoWhite from '../../../../assets/purpie-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import GradientScroll from '../../../utils/GradientScroll';
import Divider from '../../../utils/Divider';
import ZoneSelector from '../ZoneSelector/ZoneSelector';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';

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
  const leftComponentWidth = 135;
  const topComponentHeight = 140;
  const rightComponentWidth = 400;

  return (
    <Box width="100vw" height="100vh" elevation="xlarge" round="large">
      <ExtendedBox
        background="brand-alt"
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
            margin={{ vertical: 'large' }}
            onClick={() => navigateToSubdomain()}
          >
            <Box align="center">
              <Avatar
                alignSelf="center"
                size="medium"
                round="0"
                src={LogoWhite}
              />
            </Box>
          </Button>
          <Box>
            <ZoneSelector />
          </Box>
        </Box>
        <Box margin={{ vertical: 'large' }} width="100%">
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
        <Box fill alignSelf="center" width={{ max: '1800px' }}>
          {children}
        </Box>
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
            <GradientScroll justify="center" height="100%" pad="xsmall">
              {topComponent}
            </GradientScroll>
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
            <ExtendedBox
              fill
              minWidth={rightComponentWithoutOverflow ? '' : 'min-content'}
              maxWidth={
                rightComponentWithoutOverflow ? `${rightComponentWidth}px` : ''
              }
            >
              {rightComponent}
            </ExtendedBox>
          </ExtendedBox>
        )}
      </ExtendedBox>
    </Box>
  );
};

export default Desktop;
