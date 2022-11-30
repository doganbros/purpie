import { Tip, Button, Text, Box } from 'grommet';
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
      plain
      content={
        <Box pad="medium">
          <Text color="accent-1">{title}</Text>
        </Box>
      }
      dropProps={{
        round: {
          corner: 'right',
          size: 'medium',
        },
        margin: { horizontal: '40px' },
        background: {
          color: 'brand-alt',
        },
        align: { left: 'right' },
      }}
    >
      <Button onClick={() => history.push(path)} plain>
        {({ hover }: any) => (
          <ExtendedBox
            opacity={location.pathname === path ? '1' : '0.5'}
            flex={false}
            pad={{ vertical: 'small' }}
            align="center"
          >
            <IconComponent size="28px" color={hover ? 'accent-1' : 'white'} />
          </ExtendedBox>
        )}
      </Button>
    </Tip>
  );
};
