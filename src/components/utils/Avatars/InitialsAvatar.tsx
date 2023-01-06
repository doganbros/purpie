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
      round={roundSize || 'full'}
      background={{ color: background }}
      {...avatarProps}
    >
      <Text color={foreground} {...textProps} weight="normal">
        {value
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .split(' ')
          .filter((_v, i: number) => i < 2)
          .map((v) => v && v[0].toUpperCase())
          .join('')}
      </Text>
    </Avatar>
  ) : (
    <Avatar round background="light-4" />
  );
};

export default InitialsAvatar;
