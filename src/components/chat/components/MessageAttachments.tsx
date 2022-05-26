import { Box, Button, Image } from 'grommet';
import React, { Dispatch, FC, SetStateAction } from 'react';
import ExtendedBox from '../../utils/ExtendedBox';
import AttachmentIcon from '../../../assets/icons/attachment.svg';
import AtIcon from '../../../assets/icons/at.svg';
import EmojiIcon from '../../../assets/icons/emoji.svg';

interface Props {
  attachmentToolVisibility: boolean;
  text: string;
  selectedFiles: File[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  toggleEmojiPicker: () => void;
  toggleMentionPicker: () => void;
}

const MessageAttachments: FC<Props> = ({
  attachmentToolVisibility,
  text,
  selectedFiles,
  setSelectedFiles,
  toggleEmojiPicker,
  toggleMentionPicker,
}) => {
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const fileList = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i]);
      }
    }
    const concatList = fileList.concat(selectedFiles);
    setSelectedFiles(concatList);
  };

  return (
    <>
      <input
        multiple
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
            onClick={() => {
              inputFileRef?.current?.click();
            }}
            icon={<Image src={AttachmentIcon} width="14px" height="15px" />}
          />
          <Button
            size="small"
            margin="0px"
            onClick={toggleMentionPicker}
            icon={<Image src={AtIcon} width="14px" height="15px" />}
          />
          <Button
            size="small"
            margin="0px"
            onClick={toggleEmojiPicker}
            icon={<Image src={EmojiIcon} width="14px" height="15px" />}
          />
        </Box>
        <Box>
          {(text.length !== 0 || selectedFiles.length > 0) && (
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
