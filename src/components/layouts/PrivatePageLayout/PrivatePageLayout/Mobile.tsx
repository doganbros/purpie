import {
  Avatar,
  Box,
  Button,
  Header,
  Layer,
  Sidebar as SidebarContainer,
} from 'grommet';
import { Menu, Previous, Icon, Close } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import ZoneSelector from '../ZoneSelector';

interface Props {
  topComponent?: React.ReactNode;
  icon?: Icon;
  rightComponent?: React.ReactNode;
}

const TopContent = styled(Box)`
  min-width: min-content;
`;

const MainContent = styled(Box)`
  min-height: min-content;
`;

const Mobile: FC<Props> = ({ children, topComponent, rightComponent }) => {
  const history = useHistory();

  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <Box height="100vh">
      <Header background="brand" pad="medium">
        <Box direction="row" align="center" gap="medium">
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
                size="35px"
                round="medium"
                src={Logo}
              />
            }
          />
        </Box>
        {rightComponent && (
          <Button
            icon={<Previous size="medium" color="white" />}
            onClick={() => {
              setShowRightSidebar(true);
            }}
          />
        )}
      </Header>
      {topComponent && (
        <Box pad="large">
          <Box fill overflow="auto">
            <TopContent pad={{ vertical: 'large' }}>{topComponent}</TopContent>
          </Box>
          <Box fill="horizontal" height="3px" background="#E4E9F2" />
        </Box>
      )}
      <Box pad="large" fill overflow="auto">
        <MainContent>{children}</MainContent>
      </Box>
      {showLeftSidebar && (
        <Layer
          plain
          position="left"
          animation="slide"
          onEsc={() => {
            setShowLeftSidebar(false);
          }}
          onClickOutside={() => {
            setShowLeftSidebar(false);
          }}
          onClick={() => {
            setShowLeftSidebar(false);
          }}
        >
          <SidebarContainer width="135px" background="brand">
            <ZoneSelector />
            <Sidebar />
          </SidebarContainer>
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
              {rightComponent}
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Mobile;
