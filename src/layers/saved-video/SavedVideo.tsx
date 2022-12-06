import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import GradientScroll from '../../components/utils/GradientScroll';
import { Folder } from '../../store/types/folder.types';
import SavedVideoItem from './SavedVideoItem';

interface Props {
  folder: Folder;
}

const SavedVideo: FC<Props> = ({ folder }) => {
  const history = useHistory();

  return (
    <Box direction="column" gap="small">
      <Box direction="row" gap="small">
        <Box direction="column" width={{ min: 'small', max: 'small' }}>
          <Box>
            <Text color="dark" size="large" weight="bold">
              {folder.title}
            </Text>
            <Text size="small" color="status-disabled">
              {folder.itemCount} Video
            </Text>
          </Box>
        </Box>
        <Box>
          <GradientScroll>
            <Box direction="row" gap="small">
              {folder.folderItems.map((item) => (
                <SavedVideoItem
                  key={item.id}
                  post={item.post}
                  onClickPlay={() => history.push(`video/${item.postId}`)}
                />
              ))}
            </Box>
          </GradientScroll>
        </Box>
      </Box>
      {/* <Box direction="row" gap="small" align="center"> */}
      {/*  <AddCircle color="brand" size="medium" /> */}
      {/*  <Text color="brand" size="small"> */}
      {/*    Add New Video */}
      {/*  </Text> */}
      {/* </Box> */}
    </Box>
  );
};

export default SavedVideo;
