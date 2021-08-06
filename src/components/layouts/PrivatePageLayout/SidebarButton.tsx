import { Box, Tip, Button } from 'grommet';
import { Icon } from 'grommet-icons';
import React, { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

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

  const iconColor = (hover: any) => {
    if (hover) {
      return 'black';
    }
    if (location.pathname === path) {
      return 'white';
    }
    return 'dark-6';
  };

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
          <Box flex={false} pad={{ vertical: 'small' }} align="center">
            <IconComponent size="medium" color={iconColor(hover)} />
          </Box>
        )}
      </Button>
    </Tip>
  );
};
