import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Trash } from 'grommet-icons';

type Props = {
  fileList: File[];
  deleteFile: () => void;
};

const MessageFiles: React.FC<Props> = ({ fileList, deleteFile }) => {
  return (
    <Box>
      {fileList.map((file: File) => (
        <Box
          pad={{ left: 'small', right: 'small' }}
          direction="row"
          justify="between"
          align="center"
          margin="xxsmall"
          hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <Text size="small">{file.name}</Text>
          <Button
            onClick={deleteFile}
            icon={<Trash size="small" />}
            style={{ padding: '5px' }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MessageFiles;
