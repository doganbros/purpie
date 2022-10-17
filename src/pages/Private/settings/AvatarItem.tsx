import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../../../components/utils/ExtendedBox';

interface AvatarItemProps {
  title: string;
  subtitle?: string;
  src: string;
  onClickEdit?: () => void;
  disabled?: boolean;
}

export const AvatarItem: FC<AvatarItemProps> = ({
  title,
  subtitle,
  src,
  onClickEdit,
  disabled,
}) => {
  return (
    <Box direction="row" align="center" gap="small">
      <ExtendedBox align="end" justify="center" position="relative">
        {!disabled && (
          <ExtendedBox
            background="accent-1"
            width="25px"
            height="25px"
            round="full"
            justify="center"
            align="center"
            right="0"
            position="absolute"
            top="0px"
          >
            <Button
              onClick={() => {
                if (onClickEdit) {
                  onClickEdit();
                }
              }}
            >
              <Edit size="small" />
            </Button>
          </ExtendedBox>
        )}
        <Box
          round="full"
          border={{ color: '#F2F2F2', size: 'medium' }}
          wrap
          justify="center"
          pad="5px"
        >
          <Avatar alignSelf="center" size="60px" round="full" src={src} />
        </Box>
      </ExtendedBox>
      <Box>
        <Text>{title}</Text>
        {subtitle && <Text color="#8F9BB3">{subtitle}</Text>}
      </Box>
    </Box>
  );
};
