import { Box, Text } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import InitialsAvatar from '../../../components/utils/Avatars/InitialsAvatar';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { addFolderItemAction } from '../../../store/actions/folder.action';

interface Props {
  id: number;
  name: string;
  videoCount: number;
  selected: boolean;
  postId: number;
}

export const FolderListItem: FC<Props> = ({
  id,
  name,
  videoCount,
  postId,
  selected,
}) => {
  const dispatch = useDispatch();

  const [hover, setHover] = useState(false);

  const addToFolder = () => {
    dispatch(addFolderItemAction(id, postId));
  };

  return (
    <ExtendedBox
      onClick={() => addToFolder()}
      direction="row"
      align="center"
      gap="small"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      border={{
        size: '1px',
        side: 'all',
        color: hover || selected ? '#00C781' : 'white',
      }}
      minHeight="36px"
      round="xsmall"
    >
      <InitialsAvatar
        id={id}
        value={name}
        size="38px"
        round={{ corner: 'left', size: 'xsmall' }}
      />
      <Box>
        <EllipsesOverflowText
          maxWidth="212px"
          lineClamp={1}
          size="small"
          weight={500}
        >
          {name}
        </EllipsesOverflowText>
        <Text size="xsmall" color="status-disabled">
          {videoCount} videos
        </Text>
      </Box>
    </ExtendedBox>
  );
};
