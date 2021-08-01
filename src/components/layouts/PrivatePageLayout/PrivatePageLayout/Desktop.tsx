import { Avatar, Box, Button } from 'grommet';
import { Icon } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import React, { FC } from 'react';
import Logo from '../../../../assets/octopus-logo/logo-white.svg';
import Sidebar from '../Sidebar';
import ZoneSelector from '../ZoneSelector';

interface Props {
  topComponent?: React.ReactNode;
  icon?: Icon;
  rightComponent?: React.ReactNode;
}

const Background = styled(Box)`
  height: 100vh;
  border-raius: 45px;
  box-shadow: 0px 30px 50px rgba(243, 111, 62, 0.15);
`;

const LeftSidebarContainer = styled(Box)`
  background: #7d4cdb;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 228px;
  box-sizing: border-box;
  padding: 0 93px 0 0;
  border-radius: 45px;
`;

const MiddleContainerBackground = styled(Box)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 135px;
  right: 0;
  border-radius: 45px 0 0 45px;
  background: white;
`;

const MiddleContainer = styled(Box)<{
  rightComponent: boolean;
  topComponent: boolean;
}>`
  position: absolute;
  top: 0;
  left: 135px;
  right: ${(props) => (props.rightComponent ? '432px' : '45px')};
  min-height: 100vh;
  padding-top ${(props) => (props.topComponent ? '140px' : '0')};
  padding-left: 45px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const TopContainer = styled(Box)<{ rightComponent: boolean }>`
  position: fixed;
  top: 0;
  right: ${(props) => (props.rightComponent ? '387px' : 0)};
  left: 135px;
  height: 140px;
  border-radius: 45px 0 0 0;
  background-color: white;
  padding-left: 45px;
`;

const RightContainer = styled(Box)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 387px;
  background-color: white;
  border-radius: 45px;
  box-shadow: -5px 5px 30px rgba(61, 19, 141, 0.15);
  overflow: auto;
`;

const Content = styled(Box)`
  min-width: min-content;
`;

const Desktop: FC<Props> = ({ children, rightComponent, topComponent }) => {
  const history = useHistory();

  return (
    <Background>
      <LeftSidebarContainer>
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
      </LeftSidebarContainer>
      <MiddleContainerBackground />
      <MiddleContainer
        rightComponent={!!rightComponent}
        topComponent={!!topComponent}
      >
        {topComponent && (
          <TopContainer rightComponent={!!rightComponent}>
            <Box fill overflow="auto">
              <Content fill>{topComponent}</Content>
            </Box>
            <Box fill="horizontal" height="3px" pad={{ right: '45px' }}>
              <Box fill background="#E4E9F2" />
            </Box>
          </TopContainer>
        )}
        {children}
        {rightComponent && (
          <RightContainer>
            <Content>{rightComponent}</Content>
          </RightContainer>
        )}
      </MiddleContainer>
    </Background>
  );
};

export default Desktop;
