import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { Box } from 'grommet';
import { EmojiData } from 'emoji-mart';
import ExtendedBox from '../../utils/ExtendedBox';
import { CustomEmojiPicker } from './EmojiPicker.styled';

interface Props {
  visibility: boolean;
  bottom: string;
  width: string;
  onSelect: (emoji: EmojiData) => void;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}

const EmojiPicker: FC<Props> = ({
  visibility,
  onSelect,
  bottom,
  width,
  setVisibility,
}) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current?.contains(event.target)
      ) {
        setVisibility(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiPickerRef]);

  if (!visibility) return null;
  return (
    <ExtendedBox
      position="absolute"
      round="small"
      elevation="indigo"
      bottom={bottom}
      width={width}
    >
      <Box id="emoji_picker" ref={emojiPickerRef}>
        <CustomEmojiPicker
          native
          useButton
          autoFocus
          onSelect={onSelect}
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
