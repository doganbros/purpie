import React from 'react';
import { Box } from 'grommet';
import { Close } from 'grommet-icons';
import { getFileKey } from '../../../helpers/utils';
import Warning from '../../../assets/icons/warning.svg';
import {
  ImageDeleteButton,
  ImageErrorIcon,
  UploadedImage,
  UploadedImageContainer,
} from './ChatComponentsStyle';
import ImageProgressBar from './ImageProgressBar';

type Props = {
  files: Array<File>;
  uploadingFiles: Array<File>;
  uploadedFiles: string[];
  uploadErrors: string[];
  onDeleteFile: (file: File) => void;
};

const MessageFiles: React.FC<Props> = ({
  files,
  uploadingFiles = [],
  uploadedFiles = [],
  uploadErrors = [],
  onDeleteFile = () => {},
}) => {
  const fileList = [...files, ...uploadingFiles].filter(
    (i) => !uploadedFiles.includes(i.name)
  );

  if (fileList.length === 0) return null;
  return (
    <Box direction="row" overflow="auto" width="100%" pad="small">
      {fileList.map((file) => {
        return (
          <UploadedImageContainer
            key={getFileKey(file)}
            direction="row"
            justify="between"
            align="center"
            margin="xxsmall"
            hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
            round="small"
            width="100%"
          >
            <UploadedImage
              width="100%"
              height="100%"
              src={URL.createObjectURL(file)}
            />
            <ImageDeleteButton
              margin="xsmall"
              onClick={() => onDeleteFile(file)}
              icon={<Close size="small" color="white" />}
            />
            {uploadErrors.includes(file.name) && (
              <ImageErrorIcon src={Warning} />
            )}
            {uploadingFiles.includes(file) &&
              !uploadedFiles.includes(file.name) &&
              !uploadErrors.includes(file.name) && <ImageProgressBar />}
          </UploadedImageContainer>
        );
      })}
    </Box>
  );
};

export default MessageFiles;
