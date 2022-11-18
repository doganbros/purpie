import React, { FC } from 'react';
import { Avatar, Box, Text, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';

interface AvatarItemProps {
  title?: string;
  subtitle?: string;
  src: string | undefined;
  onClickEdit?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  title,
  subtitle,
  src,
  onClickEdit,
  editAvatar,
  outerCircle,
  id,
  ...textProps
}) => {
  const AvatarComponent = () => {
    return src ? (
      <Avatar alignSelf="center" round="full" src={src} />
    ) : (
      <InitialsAvatar id={id} value={title} textProps={textProps} />
    );
  };
  return (
    <Box direction="row" align="center" gap="small">
      <ExtendedBox
        align="end"
        justify="center"
        position="relative"
        onClick={() => {
          if (onClickEdit) {
            onClickEdit();
          }
        }}
      >
        {editAvatar && (
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
            <Edit size="small" />
          </ExtendedBox>
        )}

        {outerCircle ? (
          <Box
            round="full"
            border={{ color: '#F2F2F2', size: 'medium' }}
            wrap
            justify="center"
            pad="5px"
          >
            <AvatarComponent />
          </Box>
        ) : (
          <AvatarComponent />
        )}
      </ExtendedBox>
      {title && (
        <Box>
          <Text>{title}</Text>
          {subtitle && <Text color="#8F9BB3">{subtitle}</Text>}
        </Box>
      )}
    </Box>
  );
};
