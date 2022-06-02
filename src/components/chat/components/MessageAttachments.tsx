import { Box, Button } from 'grommet';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { Attachment, Emoji } from 'grommet-icons';
import ExtendedBox from '../../utils/ExtendedBox';

import { At as AtIcon } from '../../utils/CustomIcons';

interface Props {
  attachmentToolVisibility: boolean;
  text: string;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  toggleEmojiPicker: () => void;
  toggleMentionPicker: () => void;
}

const MessageAttachments: FC<Props> = ({
  attachmentToolVisibility,
  text,
  selectedFile,
  setSelectedFile,
  toggleEmojiPicker,
  toggleMentionPicker,
}) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputFileRef}
        onChangeCapture={onFileChangeCapture}
        style={{ display: 'none' }}
      />
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
          <Button
            size="small"
            margin="0px"
            disabled={Boolean(selectedFile)}
            onClick={() => {
              inputFileRef?.current?.click();
            }}
            icon={<Attachment size="12px" />}
          />
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
        </Box>
        <Box>
          {(text.length || selectedFile) && (
            <Button
              size="small"
              primary
              label="Send"
              margin={{ right: 'small', bottom: 'small' }}
            />
          )}
        </Box>
      </ExtendedBox>
    </>
  );
};

export default MessageAttachments;
