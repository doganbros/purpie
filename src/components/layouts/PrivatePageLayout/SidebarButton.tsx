import { Box, Tip, Button } from 'grommet';
import { Icon } from 'grommet-icons';
import React, { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ExtendedBox from '../../utils/ExtendedBox';

interface Props {
  title: string;
  path: string;
  icon: Icon;
}

export const SidebarButton: FC<Props> = ({
  title,
  path,
  icon: IconComponent,
}) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <Tip
      content={
        <Box
          flex={false}
          background={{ color: 'accent-1' }}
          pad="medium"
          animation="slideRight"
          round={{ size: 'medium', corner: 'right' }}
        >
          {title}
        </Box>
      }
      dropProps={{ align: { left: 'right' } }}
    >
      <Button
        hoverIndicator={{ color: 'accent-1', opacity: 0.9 }}
        onClick={() => history.push(path)}
        plain
      >
        {({ hover }: any) => (
          <ExtendedBox
            opacity={location.pathname === path ? '1' : '0.5'}
            flex={false}
            pad={{ vertical: 'small' }}
            align="center"
          >
            <IconComponent size="medium" color={hover ? 'dark-1' : 'white'} />
          </ExtendedBox>
        )}
      </Button>
    </Tip>
  );
};
