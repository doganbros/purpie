import { Avatar, Box, Button, Header, Layer } from 'grommet';
import { Menu, Previous, Close } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Sidebar from '../Sidebar';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import ZoneSelector from '../ZoneSelector';
import ExtendedBox from '../../../utils/ExtendedBox';

interface Props {
  topComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

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
        <ExtendedBox pad={{ horizontal: 'large' }} minHeight="min-content">
          <ExtendedBox
            overflow={{ horizontal: 'auto' }}
            pad={{ vertical: 'medium' }}
          >
            <ExtendedBox minWidth="min-content">{topComponent}</ExtendedBox>
          </ExtendedBox>
          <Box fill="horizontal" height="3px" background="#E4E9F2" />
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
            width="135px"
            pad={{
              vertical: 'large',
              horizontal: 'medium',
            }}
            fill="vertical"
            background="#7d4cdb"
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
              {rightComponent}
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Mobile;