import { Avatar, Box, Button, Header, Layer } from 'grommet';
import { Menu, Previous, Close } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Sidebar from '../Sidebar';
import Logo from '../../../../assets/purpie-logo/logo-white.svg';
import ZoneSelector from '../ZoneSelector/ZoneSelector';
import ExtendedBox from '../../../utils/ExtendedBox';
import Divider from '../../../utils/Divider';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Mobile: FC<Props> = ({ children, topComponent, rightComponent }) => {
  const history = useHistory();

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
            onClick={() => history.push('/')}
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
        <ExtendedBox pad={{ horizontal: 'large' }}>
          <ExtendedBox
            direction="row"
            align="center"
            height={{ min: `${topComponentHeight}px` }}
            overflow={{ horizontal: 'auto' }}
            pad={{ vertical: 'medium' }}
          >
            <ExtendedBox minWidth="min-content">{topComponent}</ExtendedBox>
          </ExtendedBox>
          <Divider />
        </ExtendedBox>
      )}
      <Box pad="large" fill overflow="auto">
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
              horizontal: 'medium',
            }}
            fill="vertical"
            background="brand-alt"
            justify="between"
          >
            <ZoneSelector />
            <Box pad={{ bottom: 'large' }}>
              <Sidebar />
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
            <Box direction="row" pad="medium">
              <Button
                icon={<Close size="medium" color="dark-1" />}
                onClick={() => {
                  setShowRightSidebar(false);
                }}
              />
            </Box>
            <Box fill overflow="auto" pad="large">
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
