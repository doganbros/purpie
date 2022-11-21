import React, { FC } from 'react';
import { Avatar, Box, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';
import { apiURL } from '../../config/http';

interface ChannelAvatarProps {
  title?: string;
  src: string | undefined;
  onClickEdit?: () => void;
  showMenu?: () => void;
  closeMenu?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
}

export const ChannelAvatar: FC<ChannelAvatarProps> = ({
  title,
  src,
  onClickEdit,
  editAvatar,
  outerCircle,
  id,
  showMenu,
  ...textProps
}) => {
  const AvatarComponent = () => {
    return src ? (
      <Avatar
        alignSelf="center"
        round="full"
        src={`${apiURL}/channel/display-photo/${src}`}
      />
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
    </Box>
  );
};
