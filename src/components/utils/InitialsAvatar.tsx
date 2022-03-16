import React, { FC } from 'react';
import { Avatar, AvatarExtendedProps, Text, TextExtendedProps } from 'grommet';
import { getColorPairFromId } from '../../helpers/utils';

interface InitialsAvatarProps {
  id: number;
  value: string;
  avatarProps?: AvatarExtendedProps;
  textProps?: TextExtendedProps;
}

const InitialsAvatar: FC<InitialsAvatarProps> = ({
  id,
  value,
  avatarProps,
  textProps,
}) => {
  const { background, foreground } = getColorPairFromId(id);
  return value ? (
    <Avatar round background={{ color: background }} {...avatarProps}>
      <Text color={foreground} {...textProps}>
        {value
          .split(' ')
          .filter((_v, i: number) => i < 2)
          .map((v) => v[0].toUpperCase())
          .join('')}
      </Text>
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
};

export default InitialsAvatar;
