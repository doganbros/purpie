import React, { FC } from 'react';
import { Avatar, Box, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import { useSelector } from 'react-redux';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';
import { apiURL } from '../../config/http';
import { AppState } from '../../store/reducers/root.reducer';

interface AvatarItemProps {
  title?: string;
  subtitle?: string;
  src?: string;
  onClickEdit?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
  size?: string;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  title,
  subtitle,
  src,
  onClickEdit,
  editAvatar,
  outerCircle,
  id,
  size,
  ...textProps
}) => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const avatarUrl = user?.displayPhoto ? user?.displayPhoto : null;
  const AvatarComponent = () => {
    return avatarUrl || src ? (
      <Avatar
        alignSelf="center"
        round="full"
        src={`${apiURL}/user/display-photo/${src || avatarUrl}`}
        size={size || 'medium'}
      />
    ) : (
      <InitialsAvatar
        id={id}
        value={title}
        textProps={textProps}
        size={size || 'medium'}
      />
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
    </Box>
  );
};
