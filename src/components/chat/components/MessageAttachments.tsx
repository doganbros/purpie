import { Box, Button } from 'grommet';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { Attachment, Emoji } from 'grommet-icons';
import ExtendedBox from '../../utils/ExtendedBox';

import { At as AtIcon } from '../../utils/CustomIcons';

interface Props {
  attachmentToolVisibility: boolean;
  onFilesSelected?: ((files: Array<File>) => void) | null;
  toggleEmojiPicker: () => void;
  toggleMentionPicker: () => void;
  sendButton: JSX.Element;
  setAttachmentToolFocused: Dispatch<SetStateAction<boolean>>;
}

const MessageAttachments: FC<Props> = ({
  attachmentToolVisibility,
  onFilesSelected,
  toggleEmojiPicker,
  toggleMentionPicker,
  sendButton,
  setAttachmentToolFocused,
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
      {onFilesSelected && (
        <input
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChangeCapture={onFileChangeCapture}
          style={{ display: 'none' }}
          onFocusCapture={() => setAttachmentToolFocused(true)}
          onBlurCapture={() => setAttachmentToolFocused(false)}
        />
      )}
      <ExtendedBox
        gap="small"
        round={{ corner: 'bottom', size: 'small' }}
        animation="slideUp"
        transition="all 0.5s"
        height={attachmentToolVisibility ? 'fit-content' : '0'}
        opacity={attachmentToolVisibility ? '1' : '0'}
        justify="between"
        direction="row"
      >
        <Box
          direction="row"
          margin={{ left: 'small', bottom: 'small', top: 'small' }}
        >
          {onFilesSelected ? (
            <Button
              size="small"
              margin="0px"
              onClick={() => {
                setAttachmentToolFocused(true);
                inputFileRef?.current?.click();
              }}
              icon={<Attachment size="12px" />}
            />
          ) : null}
          <Button
            size="small"
            margin="0px"
            onClick={toggleMentionPicker}
            icon={
              <Box alignContent="center" justify="center">
                <AtIcon size="18px" />
              </Box>
            }
          />
          <Button
            size="small"
            margin="0px"
            onClick={toggleEmojiPicker}
            icon={<Emoji size="12px" />}
          />
          {sendButton}
        </Box>
      </ExtendedBox>
    </>
  );
};

export default MessageAttachments;
