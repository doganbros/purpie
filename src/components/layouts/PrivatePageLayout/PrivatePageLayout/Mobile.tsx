import { Avatar, Box, Button, Header, Layer } from 'grommet';
import { Close, Menu, Previous } from 'grommet-icons';
import React, { FC, useState } from 'react';
import Sidebar from '../Sidebar';
import Logo from '../../../../assets/purpie-logo/logo-white.svg';
import ZoneSelector from '../ZoneSelector/ZoneSelector';
import ExtendedBox from '../../../utils/ExtendedBox';
import Divider from '../../../utils/Divider';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Mobile: FC<Props> = ({ children, topComponent, rightComponent }) => {
  const topComponentHeight = 120;
  const leftComponentWidth = 135;

  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <Box height="100vh">
      <Header
        background="brand-alt"
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
      >
        <Box direction="row" align="center" gap="medium" justify="between" fill>
          <Button
            onClick={() => {
              setShowLeftSidebar(true);
            }}
            icon={<Menu size="medium" color="white" />}
          />
          <Button
            onClick={() => navigateToSubdomain()}
            icon={
              <Avatar
                alignSelf="center"
                size="40px"
                round="medium"
                src={Logo}
              />
            }
          />
          {rightComponent ? (
            <Button
              icon={<Previous size="medium" color="white" />}
              onClick={() => {
                setShowRightSidebar(true);
              }}
            />
          ) : (
            <Box pad="large" />
          )}
        </Box>
      </Header>
      {topComponent && (
        <ExtendedBox pad={{ horizontal: 'medium' }}>
          <ExtendedBox
            direction="row"
            align="center"
            height={{ min: `${topComponentHeight}px` }}
            overflow={{ horizontal: 'auto' }}
            pad={{ vertical: 'medium' }}
          >
            <ExtendedBox minWidth="min-content">{topComponent}</ExtendedBox>
          </ExtendedBox>
          <Divider marginBottom="small" />
        </ExtendedBox>
      )}
      <Box pad="medium" fill overflow="auto">
        <ExtendedBox minHeight="min-content">{children}</ExtendedBox>
      </Box>
      {showLeftSidebar && (
        <Layer
          full="vertical"
          position="left"
          responsive={false}
          onEsc={() => {
            setShowLeftSidebar(false);
          }}
          onClickOutside={() => {
            setShowLeftSidebar(false);
          }}
        >
          <Box
            width={`${leftComponentWidth}px`}
            pad={{
              vertical: 'large',
            }}
            fill="vertical"
            background="brand-alt"
            justify="between"
          >
            <Box
              pad={{
                horizontal: 'medium',
              }}
            >
              <ZoneSelector />
            </Box>

            <Box pad={{ bottom: 'large' }} width="100%">
              <Sidebar handleClick={() => setShowLeftSidebar(false)} />
            </Box>
          </Box>
        </Layer>
      )}
      {showRightSidebar && (
        <Layer
          position="right"
          animation="slide"
          onEsc={() => {
            setShowRightSidebar(false);
          }}
          onClickOutside={() => {
            setShowRightSidebar(false);
          }}
        >
          <Box fill>
            <Box direction="row" pad="small">
              <Button
                icon={<Close size="medium" color="dark-1" />}
                onClick={() => {
                  setShowRightSidebar(false);
                }}
              />
            </Box>
            <Box fill overflow="auto" pad="small">
              <Box flex="grow" height="min-content">
                {rightComponent}
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Mobile;
