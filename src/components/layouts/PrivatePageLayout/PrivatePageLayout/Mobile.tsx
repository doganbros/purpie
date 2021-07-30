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
import Sidebar from '../Sidebar';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import ZoneSelector from '../ZoneSelector';

interface Props {
  topComponent?: React.ReactNode;
  icon?: Icon;
  rightSideItem?: React.ReactNode;
}
const Mobile: FC<Props> = ({ children, topComponent, rightSideItem }) => {
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
        <Button
          icon={<Previous size="medium" color="white" />}
          onClick={() => {
            setShowRightSidebar(true);
          }}
        />
      </Header>
      {topComponent && <Box pad="medium">{topComponent}</Box>}
      <Box flex="grow" style={{ position: 'relative' }}>
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
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
          onClick={() => {
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
            {rightSideItem}
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Mobile;
