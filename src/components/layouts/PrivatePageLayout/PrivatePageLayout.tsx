import {
  Avatar,
  Box,
  Button,
  Grid,
  Heading,
  ResponsiveContext,
  Sidebar,
} from 'grommet';
import { CloudComputer, Icon } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import React, { FC, useContext } from 'react';
import { useTitle } from '../../../hooks/useTitle';
import Logo from '../../../assets/octopus-logo/logo-color.png';
import { SidebarButton } from './SidebarButton';
import SidebarFooter from './SidebarFooter';

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
    <Grid
      fill
      rows={['auto', 'flex']}
      gap={{ column: 'small' }}
      columns={['auto', 'flex']}
      areas={[
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Sidebar
        gridArea="sidebar"
        background="brand"
        height="100vh"
        overflow="hidden"
        header={
          <Box pad="small">
            <Button onClick={() => history.push('/')}>
              <Avatar
                border={{ color: 'white', size: 'small' }}
                round="medium"
                src={Logo}
              />
            </Button>
          </Box>
        }
        pad={{ vertical: 'small' }}
        footer={<SidebarFooter />}
      >
        {sidebarBtns.map((v) => (
          <SidebarButton {...v} key={v.path} />
        ))}
      </Sidebar>
      <Box gridArea="main" overflow="auto" height="100vh">
        <Box justify="between" direction="row">
          <Box flex={{ grow: 5 }}>
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
          {!['small', 'xsmall'].includes(size) && RightSideItem}
        </Box>
      </Box>
    </Grid>
  );
};

export default PrivatePageLayout;
