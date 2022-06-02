import React, { FC } from 'react';
import { Box, Button } from 'grommet';
import { EmojiData } from 'emoji-mart';
import ExtendedBox from '../../utils/ExtendedBox';

interface Props {
  visibility: boolean;
  bottom: string;
  width: string;
  suggestions: EmojiData[];
  onSelect: (emoji: EmojiData) => void;
}

const SuggestionPicker: FC<Props> = ({
  visibility,
  suggestions,
  onSelect,
  bottom,
  width,
}) => {
  if (!visibility) return null;
  return (
    <ExtendedBox
      position="absolute"
      round="small"
      elevation="indigo"
      bottom={bottom}
      width={width}
    >
      <Box
        flex
        pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
        id="suggestion_picker"
        background="white"
        round="large"
        direction="row"
        gap="small"
        overflow="scroll"
      >
        {suggestions?.map((suggestion) => {
          return (
            <Button
              plain
              key={suggestion.id}
              label={
                'native' in suggestion ? suggestion.native : suggestion.name
              }
              onClick={() => onSelect(suggestion)}
            />
          );
        })}
      </Box>
    </ExtendedBox>
  );
};

export default SuggestionPicker;
