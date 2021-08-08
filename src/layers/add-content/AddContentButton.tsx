import React, { FC, ReactElement } from 'react';
import { Button, Box, Text } from 'grommet';

interface AddContentButtonProps {
  icon: ReactElement;
  title: string;
  description: string;
  onClick: () => void;
}

const AddContentButton: FC<AddContentButtonProps> = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <Button onClick={onClick} plain>
    {({ hover }: any) => (
      <Box
        elevation="small"
        pad="small"
        gap="small"
        align="center"
        width="151px"
        height="250px"
        round="small"
        background={
          hover
            ? 'linear-gradient(180deg, #3D138D 0%, #643FBB 52.62%, #74C0BF 100%)'
            : 'linear-gradient(180deg, #3D138D 0%, #7D4CDB 100%)'
        }
      >
        {icon}
        <Text color="white">{title}</Text>
        <Text size="xsmall" color="white">
          {description}
        </Text>
      </Box>
    )}
  </Button>
);

export default AddContentButton;
