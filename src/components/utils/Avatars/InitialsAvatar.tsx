import React, { FC } from 'react';
import { Avatar, AvatarExtendedProps, Text, TextExtendedProps } from 'grommet';
import { getColorPairFromId } from '../../../helpers/utils';

interface InitialsAvatarProps extends Omit<AvatarExtendedProps, 'id'> {
  id: number;
  value?: string;
  textProps?: TextExtendedProps;
  roundSize?: string;
}

const InitialsAvatar: FC<InitialsAvatarProps> = ({
  id,
  value,
  textProps,
  roundSize,
  ...avatarProps
}) => {
  const { background, foreground } = getColorPairFromId(id);
  return value ? (
    <Avatar
      round={roundSize || true}
      background={{ color: background }}
      {...avatarProps}
    >
      <Text color={foreground} {...textProps}>
        {value
          .replace(/[^a-zA-Z ]/g, '')
          .split(' ')
          .filter((_v, i: number) => i < 2)
          .map((v) => v && v[0].toUpperCase())
          .join('')}
      </Text>
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
};

export default InitialsAvatar;