import React, { FC } from 'react';
import { Avatar, Text } from 'grommet';
import { getColorPairFromId } from '../../helpers/utils';

interface InitialsAvatarProps {
  id: number;
  value: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string;
}

const InitialsAvatar: FC<InitialsAvatarProps> = ({
  id,
  value,
  size,
  fontSize,
}) => {
  const { background, foreground } = getColorPairFromId(id);
  return value ? (
    <Avatar round background={{ color: background }} size={size}>
      <Text color={foreground} size={fontSize || size}>
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
