/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react';
import { Avatar, Box, Button, Image, Text, TextExtendedProps } from 'grommet';
import { Edit } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import InitialsAvatar from '../utils/InitialsAvatar';

interface AvatarItemProps {
  title?: string;
  src: string | undefined;
  onClickEdit?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
}

export const ZoneAvatar: FC<AvatarItemProps> = ({
  title,
  src,
  onClickEdit,
  editAvatar,
  outerCircle,
  id,
  ...textProps
}) => {
  const AvatarComponent = () => {
    return src ? (
      <Avatar alignSelf="center" round="small" src={src} background="red" />
    ) : (
      <InitialsAvatar
        id={id}
        value={title}
        textProps={textProps}
        roundSize="small"
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
