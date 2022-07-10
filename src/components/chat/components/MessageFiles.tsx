import React from 'react';
import { Box } from 'grommet';
import { Close } from 'grommet-icons';
import { getFileKey } from '../../../helpers/utils';
import {
  ImageDeleteButton,
  UploadedImage,
  UploadedImageContainer,
} from './ChatComponentsStyle';

type Props = {
  files: Array<File>;
  onDeleteFile: (file: File) => void;
};

const MessageFiles: React.FC<Props> = ({ files, onDeleteFile }) => {
  return (
    <Box>
      {files.map((file) => {
        return (
          <UploadedImageContainer
            key={getFileKey(file)}
            pad="small"
            direction="row"
            justify="between"
            align="center"
            margin="xxsmall"
            hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
            round="small"
            width="100%"
          >
            <UploadedImage width="100%" src={URL.createObjectURL(file)} />
            <ImageDeleteButton
              margin="medium"
              color="green"
              onClick={() => onDeleteFile(file)}
              icon={<Close size="small" />}
            />
          </UploadedImageContainer>
        );
      })}
    </Box>
  );
};

export default MessageFiles;
