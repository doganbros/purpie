import React, { FC, useState } from 'react';
import { Box, Stack } from 'grommet';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '../../store/types/post.types';
import { VideoPost } from '../../components/post/VideoPost';
import { ImagePost } from '../../components/post/ImagePost';

dayjs.extend(relativeTime);

interface SavedVideoItemProps {
  post: Post;
  onClickPlay: (id: string) => any;
}

const SavedVideoItem: FC<SavedVideoItemProps> = ({ post, onClickPlay }) => {
  const [hover, setHover] = useState(false);
  const isVideoPost = post.videoName || post.streaming;
  return (
    <Stack
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      fill
      interactiveChild="first"
    >
      <Box
        fill
        gap="medium"
        direction="row"
        onClick={() => {
          if (isVideoPost) onClickPlay(post.id);
        }}
        focusIndicator={false}
      >
        <Box width="180px">
          <Box round={{ size: 'medium' }} overflow="hidden" gap="small">
            {isVideoPost ? (
              <VideoPost
                id={post.id}
                live={post.streaming}
                slug={post.slug}
                videoName={post.videoName}
                savedIcon={false}
              />
            ) : (
              <ImagePost id={post.id} />
            )}
          </Box>
        </Box>
      </Box>
      {hover && (
        <Box
          round="medium"
          fill
          background={{ color: 'brand', opacity: 'weak' }}
        />
      )}
    </Stack>
  );
};
export default SavedVideoItem;
