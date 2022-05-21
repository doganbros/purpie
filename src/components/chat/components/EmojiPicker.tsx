import React, { FC } from 'react';
import { Box } from 'grommet';
import { EmojiData, Picker } from 'emoji-mart';
import ExtendedBox from '../../utils/ExtendedBox';

interface Props {
  visibility: boolean;
  bottom: string;
  width: string;
  onSelect: (emoji: EmojiData) => void;
}

const EmojiPicker: FC<Props> = ({ visibility, onSelect, bottom, width }) => {
  if (!visibility) return <></>;
  return (
    <ExtendedBox
      position="absolute"
      round="small"
      elevation="indigo"
      bottom={bottom}
      width={width}
    >
      <Box id="emoji_picker">
        <Picker
          native
          useButton
          autoFocus
          onSelect={onSelect}
          title=""
          emojiSize={16}
          showPreview={false}
          showSkinTones={false}
          emojiTooltip={false}
          style={{
            width: 'inherit',
            background: 'white',
            zIndex: 2,
          }}
        />
      </Box>
    </ExtendedBox>
  );
};

export default EmojiPicker;
