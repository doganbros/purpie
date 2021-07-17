import {
  Avatar,
  Box,
  Button,
  Heading,
  ResponsiveContext,
  Sidebar,
} from 'grommet';
import { CloudComputer, Icon } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC, useContext } from 'react';
import { useTitle } from '../../../hooks/useTitle';
import Logo from '../../../assets/octopus-logo/logo-white.svg';
import { SidebarButton } from './SidebarButton';
import SidebarFooter from './SidebarFooter';
import ZoneSelector from '../../utils/ZoneSelector';

interface Props {
  title: string;
  changeTitle?: boolean;
  icon?: Icon;
  rightSideItem?: React.ReactNode;
}

const sidebarBtns = [
  {
    title: 'Zones',
    icon: CloudComputer,
    path: '/',
  },
  {
    title: 'My Meetings',
    icon: CloudComputer,
    path: '/my-meetings',
  },
];

const PrivatePageLayout: FC<Props> = ({
  children,
  title,
  icon: IconComponent,
  rightSideItem: RightSideItem,
  changeTitle,
}) => {
  useTitle(title, changeTitle);
  const history = useHistory();
  const size = useContext(ResponsiveContext);

  return (
    <Box
      height="100vh"
      direction="row"
      round="45px"
      style={{
        boxShadow: '0px 30px 50px rgba(243, 111, 62, 0.15)',
      }}
    >
      <Sidebar
        background="brand"
        width="228px"
        round="45px"
        margin={{ right: '-93px' }}
        header={
          <Box pad="small">
            <Button
              margin={{ bottom: 'medium' }}
              onClick={() => history.push('/')}
            >
              <Box align="center">
                <Avatar
                  alignSelf="center"
                  size="72px"
                  round="medium"
                  src={Logo}
                />
              </Box>
            </Button>
            <ZoneSelector />
          </Box>
        }
        pad={{ vertical: 'small', right: '93px' }}
        footer={<SidebarFooter />}
      >
        {sidebarBtns.map((v) => (
          <SidebarButton {...v} key={v.path} />
        ))}
      </Sidebar>
      <Box
        flex
        overflow="auto"
        background={{ light: 'white', dark: 'dark-1' }}
        pad={{ top: '30px', horizontal: '45px' }}
        round={{ corner: 'left', size: '45px' }}
        gap="45px"
      >
        <Box flex>
          <Box
            background={{ light: 'white', dark: 'dark-1' }}
            style={{ position: 'sticky', top: 0 }}
            height="150px"
            margin={{ bottom: 'medium' }}
          >
            <Heading level="2">
              {IconComponent && <IconComponent />} {title}
            </Heading>
          </Box>
          <Box>{children}</Box>
        </Box>
      </Box>
      {!['small', 'xsmall'].includes(size) && (
        <Box
          width="387px"
          round="45px"
          style={{
            boxShadow: '-5px 5px 30px rgba(61, 19, 141, 0.15)',
          }}
        >
          {RightSideItem}
        </Box>
      )}
    </Box>
  );
};

export default PrivatePageLayout;
