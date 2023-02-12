import React, { FC, ReactElement } from 'react';
import { Button, Text } from 'grommet';
import { theme } from '../../config/app-config';
import ExtendedBox from '../../components/utils/ExtendedBox';

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
      <ExtendedBox
        elevation="small"
        pad="small"
        gap="small"
        align="center"
        height="201px"
        round="small"
        transition="all 0.1s"
        transform={hover ? 'scale(1.05)' : 'scale(1)'}
        background={
          hover
            ? `linear-gradient(180deg, ${theme.global?.colors?.['neutral-2']} 0%, ${theme.global?.colors?.['brand-dark']} 52.62%,${theme.global?.colors?.['light-turquoise']} 100%)`
            : `linear-gradient(180deg, ${theme.global?.colors?.['neutral-2']} 0%, ${theme.global?.colors?.['brand-alt']} 100%)`
        }
      >
        {icon}
        <Text color="white">{title}</Text>
        <Text size="xsmall" color="white">
          {description}
        </Text>
      </ExtendedBox>
    )}
  </Button>
);

export default AddContentButton;
