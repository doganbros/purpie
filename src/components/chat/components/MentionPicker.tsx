import React, { FC } from 'react';
import { Box } from 'grommet';
import ExtendedBox from '../../utils/ExtendedBox';
import { UserBasic } from '../../../store/types/auth.types';
import UserItem from './UserItem';

interface Props {
  visibility: boolean;
  bottom: string;
  width: string;
  userList: UserBasic[];
  onSelect: (user: any) => void;
}

const MentionPicker: FC<Props> = ({
  visibility,
  bottom,
  width,
  userList,
  onSelect,
}) => {
  if (!visibility) return <></>;
  return (
    <ExtendedBox
      position="absolute"
      round="small"
      elevation="indigo"
      bottom={bottom}
      width={width}
      background="white"
    >
      <Box id="mention_picker">
        {userList.map((user) => {
          return (
            <UserItem
              key={user.id}
              user={user}
              onClick={() => onSelect(user)}
            />
          );
        })}
      </Box>
    </ExtendedBox>
  );
};

export default MentionPicker;
