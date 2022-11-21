import React, { FC } from 'react';
import { Avatar, Box, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';
import {
  REACT_APP_API_VERSION,
  REACT_APP_SERVER_HOST,
} from '../../config/http';

interface AvatarItemProps {
  title?: string;
  src: string | undefined;
  onClickEdit?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
  size?: string;
}

export const ZoneAvatar: FC<AvatarItemProps> = ({
  title,
  src,
  onClickEdit,
  editAvatar,
  outerCircle,
  id,
  size,
  ...textProps
}) => {
  const AvatarComponent = () => {
    return src ? (
      <Avatar
        alignSelf="center"
        round="small"
        src={`${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}/zone/display-photo/${src}`}
        background="red"
        size={size || 'medium'}
      />
    ) : (
      <InitialsAvatar
        id={id}
        value={title}
        textProps={textProps}
        roundSize="small"
        size={size || 'medium'}
      />
    );
  };
  return (
    <Box direction="row" align="center" gap="small">
      <ExtendedBox align="end" justify="center" position="relative">
        {editAvatar && (
          <ExtendedBox
            background="accent-1"
            width="25px"
            height="25px"
            justify="center"
            align="center"
            right="0"
            position="absolute"
            top="0px"
            round
            onClick={(e) => e.stopPropagation()}
          >
            <Edit
              size="small"
              onClick={() => {
                if (onClickEdit) {
                  onClickEdit();
                }
              }}
            />
          </ExtendedBox>
        )}

        {outerCircle ? (
          <Box
            border={{ color: '#F2F2F2', size: 'medium' }}
            wrap
            justify="center"
            pad="5px"
            round="small"
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
