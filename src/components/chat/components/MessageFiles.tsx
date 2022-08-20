import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Trash } from 'grommet-icons';
import { getFileKey } from '../../../helpers/utils';

type Props = {
  files: Array<File>;
  onDeleteFile: (file: File) => void;
};

const MessageFiles: React.FC<Props> = ({ files, onDeleteFile }) => {
  return (
    <Box>
      {files.map((file) => (
        <Box
          key={getFileKey(file)}
          pad={{ left: 'small', right: 'small' }}
          direction="row"
          justify="between"
          align="center"
          margin="xxsmall"
          hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
        >
          <Text size="small" truncate>
            {file.name}
          </Text>
          <Button
            onClick={() => onDeleteFile(file)}
            icon={<Trash size="small" />}
            style={{ padding: '5px' }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MessageFiles;
