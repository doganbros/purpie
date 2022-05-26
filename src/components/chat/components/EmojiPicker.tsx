import React, { FC } from 'react';
import { Box } from 'grommet';
import { EmojiData } from 'emoji-mart';
import ExtendedBox from '../../utils/ExtendedBox';
import { CustomEmojiPicker } from './EmojiPicker.styled';

interface Props {
  visibility: boolean;
  bottom: string;
  width: string;
  onSelect: (emoji: EmojiData) => void;
}

const EmojiPicker: FC<Props> = ({ visibility, onSelect, bottom, width }) => {
  if (!visibility) return null;
  return (
    <ExtendedBox
      position="absolute"
      round="small"
      elevation="indigo"
      bottom={bottom}
      width={width}
    >
      <Box id="emoji_picker">
        <CustomEmojiPicker
          native
          useButton
          autoFocus
          onSelect={onSelect}
          title=""
          emojiSize={16}
          showPreview={false}
          showSkinTones={false}
          emojiTooltip={false}
        />
      </Box>
    </ExtendedBox>
  );
};

export default EmojiPicker;
