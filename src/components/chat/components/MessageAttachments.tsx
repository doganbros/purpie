import { Box } from 'grommet';
import React, { FC } from 'react';
import { Attachment, Emoji } from 'grommet-icons';
import ExtendedBox from '../../utils/ExtendedBox';

import { At as AtIcon } from '../../utils/CustomIcons';
import { AttachmentButton } from './ChatComponentsStyle';

interface Props {
  onFilesSelected?: ((files: Array<File>) => void) | null;
  toggleEmojiPicker: () => void;
  toggleMentionPicker: () => void;
  sendButton: JSX.Element;
}

const MessageAttachments: FC<Props> = ({
  onFilesSelected,
  toggleEmojiPicker,
  toggleMentionPicker,
  sendButton,
}) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length && onFilesSelected) {
      onFilesSelected(Array.from(files));
    }
  };

  return (
    <>
      <input
        multiple
        type="file"
        accept="image/*"
        ref={inputFileRef}
        onChangeCapture={onFileChangeCapture}
        style={{ display: 'none' }}
      />
      <ExtendedBox
        gap="small"
        round={{ corner: 'bottom', size: 'small' }}
        animation="slideUp"
        transition="all 0.5s"
        height="fit-content"
        opacity="1"
        justify="between"
        direction="row"
      >
        <Box
          direction="row"
          margin={{ left: 'xsmall', bottom: 'xsmall', top: 'small' }}
        >
          <AttachmentButton
            size="large"
            margin="0px"
            onClick={() => {
              inputFileRef?.current?.click();
            }}
            icon={<Attachment size="15px" />}
          />
          <AttachmentButton
            size="small"
            margin="0px"
            onClick={toggleMentionPicker}
            icon={
              <Box alignContent="center" justify="center">
                <AtIcon size="20px" />
              </Box>
            }
          />
          <AttachmentButton
            size="small"
            margin="0px"
            onClick={toggleEmojiPicker}
            icon={<Emoji size="15px" />}
          />
          {sendButton}
        </Box>
      </ExtendedBox>
    </>
  );
};

export default MessageAttachments;
