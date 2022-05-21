import 'emoji-mart/css/emoji-mart.css';
import { Box, TextArea } from 'grommet';
import React, {
  Dispatch,
  FC,
  KeyboardEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { EmojiData, emojiIndex } from 'emoji-mart';
import EmojiPicker from './EmojiPicker';
import SuggestionPicker from './SuggestionPicker';

interface Props {
  text: string;
  name?: string;
  onSuggesting?: (value: boolean) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  setFocused: Dispatch<SetStateAction<boolean>>;
  setText: Dispatch<SetStateAction<string>>;
  emojiPickerVisibility: boolean;
  setEmojiPickerVisibility: Dispatch<SetStateAction<boolean>>;
  componentRef: RefObject<HTMLDivElement>;
  suggestionPickerVisibility: boolean;
  setSuggestionPickerVisibility: Dispatch<SetStateAction<boolean>>;
}

const MessageBox: FC<Props> = ({
  text,
  name,
  onKeyDown,
  setFocused,
  setText,
  onSuggesting,
  emojiPickerVisibility,
  setEmojiPickerVisibility,
  componentRef,
  suggestionPickerVisibility,
  setSuggestionPickerVisibility,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editingEmoji, setEditingEmoji] = useState<string>('');
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<EmojiData[]>([]);

  useEffect(() => {
    const element = textAreaRef.current;
    if (element && !emojiPickerVisibility) {
      element.focus();
    }
  }, [emojiPickerVisibility]);

  useEffect(() => {
    setSuggestionPickerVisibility(
      !emojiPickerVisibility && suggestions.length > 0
    );
  }, [suggestions, emojiPickerVisibility]);

  const handleTextAreaCursor = (cursor: number) => {
    const element = textAreaRef.current;
    if (element) {
      setTimeout(() => {
        element.focus();
        element.selectionStart = cursor;
        element.selectionEnd = cursor;
      });
    }
  };

  const enterEmoji = (emojiData: EmojiData) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const emoji = 'native' in emojiData ? emojiData.native : emojiData.name;
    const cursor = text.indexOf(editingEmoji) + emoji.length + 1;
    setText(text.replace(editingEmoji, `${emoji}`));
    setEditingEmoji('');
    setSuggestions([]);
    if (onSuggesting) onSuggesting(false);
    handleTextAreaCursor(cursor);
  };

  const getEmojiTextInSentence = (
    textMessage: string,
    selectionIndex: number,
    isRight = false
  ) => {
    let resultText: string = textMessage;
    let selectionStart: number = isRight
      ? selectionIndex + 1
      : selectionIndex - 1;
    let emojiSentenceIndex = -1;
    if (resultText[selectionStart] === ':') selectionStart -= 1;
    for (let i = selectionStart; i >= 0; i--) {
      if (resultText[i] === ':') {
        emojiSentenceIndex = i;
        break;
      } else if (/\s+/.test(resultText[i])) {
        break;
      }
    }

    let emojiEndIndex = selectionStart;
    if (text === textMessage) {
      if (!isRight) emojiEndIndex -= -1;
    } else {
      emojiEndIndex += 1;
    }

    const emojiText = resultText.substr(emojiSentenceIndex, emojiEndIndex + 1);
    const matches = /^:[a-z0-9!@#$%^&*)(+=._-]+:?/.exec(emojiText);
    const currentEmoji = emojiSentenceIndex > -1 && matches ? matches[0] : null;
    let sugs: EmojiData[] = [];

    if (currentEmoji) {
      let emoji = currentEmoji.substr(1);
      if (emoji.slice(-1) === ':') {
        emoji = emoji.slice(0, -1);
        const currentSuggestions = emojiIndex.search(emoji);
        if (currentSuggestions != null && currentSuggestions.length > 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const emojiReplace = currentSuggestions[0].native;
          resultText = resultText.replace(currentEmoji, emojiReplace);
          handleTextAreaCursor(emojiSentenceIndex + emojiReplace.length);
        }
      } else {
        sugs = emojiIndex.search(emoji) || [];
      }
    } else if (emojiPickerVisibility) {
      setEmojiPickerVisibility(false);
    }

    setSuggestions(sugs);
    setEditingEmoji(currentEmoji || '');
    setSelectedEmojiIndex(0);
    return resultText;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    const { value, selectionStart } = e.target;
    const currentText = getEmojiTextInSentence(value, selectionStart);
    setText(currentText);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement> & {
      target: HTMLTextAreaElement;
    }
  ) => {
    const { value, selectionStart } = e.target;
    if (!e.ctrlKey && !e.shiftKey) {
      switch (e.key) {
        case 'Left':
        case 'ArrowLeft':
          e.persist();
          getEmojiTextInSentence(value, selectionStart);
          break;
        case 'Right':
        case 'ArrowRight':
          e.persist();
          getEmojiTextInSentence(value, selectionStart, true);
          break;
        case 'Up':
        case 'ArrowUp':
          e.persist();
          getEmojiTextInSentence(value, selectionStart);
          break;
        case 'Down':
        case 'ArrowDown':
          e.persist();
          getEmojiTextInSentence(value, selectionStart);
          break;
        default:
          e.persist();
          break;
      }
    }
    onKeyDown(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        if (suggestions.length > 0) {
          enterEmoji(suggestions[selectedEmojiIndex]);
          e.preventDefault();
        }
        break;
      case 'Tab':
      case ' ':
        setEditingEmoji('');
        setSuggestions([]);
        break;
      default:
        break;
    }
  };

  const onSelectEmoji = (emoji: EmojiData) => {
    const element = textAreaRef.current;
    if (element) {
      const before = text.slice(0, element.selectionStart);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { native } = emoji;
      const after = text.slice(element.selectionStart);
      const newText = `${before}${native}${after}`;
      setText(newText);
      setEditingEmoji('');
      setSuggestions([]);
      setSelectedEmojiIndex(0);
      handleTextAreaCursor(before.length + native.length);
    }
  };

  // const onOverEmojiIndex = (index: number) => setSelectedEmojiIndex(index);

  // const highlight = editingEmoji.substr(1);

  const pickerWidth = useMemo(
    () =>
      textAreaRef?.current?.clientWidth
        ? `${textAreaRef?.current?.clientWidth}px`
        : '100%',
    [textAreaRef?.current?.clientWidth]
  );

  const pickerBottom = useMemo(
    () => `${(componentRef?.current?.clientHeight || 0) + 15}px`,
    [componentRef?.current?.clientHeight]
  );

  return (
    <>
      <EmojiPicker
        visibility={emojiPickerVisibility}
        onSelect={onSelectEmoji}
        bottom={pickerBottom}
        width={pickerWidth}
      />
      <SuggestionPicker
        visibility={suggestionPickerVisibility}
        suggestions={suggestions}
        onSelect={enterEmoji}
        bottom={pickerBottom}
        width={pickerWidth}
      />
      <Box round="small" fill gap="small" width="100%" ref={componentRef}>
        <TextArea
          plain
          value={text}
          ref={textAreaRef}
          resize={false}
          focusIndicator={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Write ${name ? `to ${name}` : 'your message...'} `}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyUp}
          onChange={handleChange}
          style={{ overflow: 'none' }}
          rows={1}
        />
      </Box>
    </>
  );
};

export default MessageBox;
