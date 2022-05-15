import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Trash } from 'grommet-icons';

type MessageFilesProp = {
  fileList: File[];
};

const MessageFiles = ({ fileList }: MessageFilesProp) => {
  return (
    <Box>
      {fileList.map((file: File) => (
        <Box
          pad={{ left: 'small', right: 'small' }}
          direction="row"
          justify="between"
          align="center"
          margin="xxsmall"
          hoverIndicator={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <Text size="small">{file.name}</Text>
          <Button icon={<Trash size="small" />} style={{ padding: '5px' }} />
        </Box>
      ))}
    </Box>
  );
};

export default MessageFiles;
