import React, { FC } from 'react';
import { Avatar, Text } from 'grommet';
import { getColorPairFromId } from '../../helpers/utils';

interface InitialsAvatarProps {
  id: number;
  value: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}

const InitialsAvatar: FC<InitialsAvatarProps> = ({
  id,
  value,
  size,
  fontSize,
}) => {
  const { background, foreground } = getColorPairFromId(id);
  return value ? (
    <Avatar
      round="full"
      background={{ color: background }}
      width={size}
      height={size}
    >
      <Text
        color={foreground}
        size={fontSize || size}
        style={{ userSelect: 'none' }}
      >
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
