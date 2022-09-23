import React, { FC, useEffect, useState } from 'react';
import { Avatar, AvatarExtendedProps, Text, TextExtendedProps } from 'grommet';
import { getColorPairFromId } from '../../helpers/utils';

interface InitialsAvatarProps extends Omit<AvatarExtendedProps, 'id'> {
  id: number;
  value: string;
  textProps?: TextExtendedProps;
}

const InitialsAvatar: FC<InitialsAvatarProps> = (props) => {
  const { id, value, textProps, ...avatarProps } = props;
  const { background, foreground } = getColorPairFromId(id);
  const [avatarText, setAvatarText] = useState<string>('');

  useEffect(() => {
    const values = value.trim().split(' ');
    const firstLetter = values[0].charAt(0).toUpperCase();
    const lastLetter = values[values.length - 1].charAt(0).toUpperCase();
    setAvatarText(
      values.length > 1 ? `${firstLetter}${lastLetter}` : firstLetter
    );
  }, [value]);

  return value ? (
    <Avatar round background={{ color: background }} {...avatarProps}>
      <Text color={foreground} {...textProps}>
        {avatarText}
      </Text>
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
};

export default InitialsAvatar;
