/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Avatar, Box, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';

interface ChannelAvatarProps {
  title?: string;
  subtitle?: string;
  src: string | undefined;
  onClickEdit?: () => void;
  showMenu?: () => void;
  closeMenu?: () => void;
  disabled?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
}

export const ChannelAvatar: FC<ChannelAvatarProps> = ({
  title,
  subtitle,
  src,
  onClickEdit,
  disabled,
  outerCircle,
  id,
  showMenu,
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
    <Box direction="row" gap="small">
      <ExtendedBox
        align="end"
        justify="center"
        position="relative"
        onClick={(e) => {
          e.stopPropagation();
          if (onClickEdit) {
            onClickEdit();
          }
        }}
      >
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
    </Box>
  );
};
