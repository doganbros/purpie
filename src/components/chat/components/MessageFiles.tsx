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
  UploadingProgressBar,
  UploadingProgressBarContainer,
} from './ChatComponentsStyle';

type Props = {
  files: Array<File>;
  uploadingFiles: string[];
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
  if (files.length === 0) return <></>;
  return (
    <Box direction="row" overflow="auto" width="100%" pad="small">
      {files
        .filter((i) => !uploadedFiles.includes(i.name))
        .map((file) => {
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
                color="green"
                onClick={() => onDeleteFile(file)}
                icon={<Close size="small" color="brand-2" />}
              />
              {uploadErrors.includes(file.name) && (
                <ImageErrorIcon src={Warning} />
              )}
              {uploadingFiles.includes(file.name) &&
                !uploadedFiles.includes(file.name) &&
                !uploadErrors.includes(file.name) && (
                  <UploadingProgressBarContainer>
                    <Box
                      width="80%"
                      height="8px"
                      background="white"
                      round="small"
                    >
                      <Box direction="row">
                        <UploadingProgressBar
                          background="brand"
                          height="8px"
                          round="small"
                        />
                      </Box>
                    </Box>
                  </UploadingProgressBarContainer>
                )}
            </UploadedImageContainer>
          );
        })}
    </Box>
  );
};

export default MessageFiles;
