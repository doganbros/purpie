import 'emoji-mart/css/emoji-mart.css';
import { Box } from 'grommet';
import React, {
  Dispatch,
  FC,
  KeyboardEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { EmojiData, emojiIndex } from 'emoji-mart';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import EmojiPicker from './EmojiPicker';
import SuggestionPicker from './SuggestionPicker';
import MentionPicker from './MentionPicker';
import { UserBasic } from '../../../store/types/auth.types';
import { searchProfileAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { MessageTextAreaComponent } from './ChatComponentsStyle';

interface Props {
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  text: string;
  name?: string;
  onSuggesting?: (value: boolean) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  setText: Dispatch<SetStateAction<string>>;
  emojiPickerVisibility: boolean;
  setEmojiPickerVisibility: Dispatch<SetStateAction<boolean>>;
  componentRef: RefObject<HTMLDivElement>;
  suggestionPickerVisibility: boolean;
  setSuggestionPickerVisibility: Dispatch<SetStateAction<boolean>>;
  mentionPickerVisibility: boolean;
  setMentionPickerVisibility: Dispatch<SetStateAction<boolean>>;
}

const MessageBox: FC<Props> = ({
  textAreaRef,
  text,
  name,
  onKeyDown,
  setText,
  onSuggesting,
  emojiPickerVisibility,
  setEmojiPickerVisibility,
  componentRef,
  suggestionPickerVisibility,
  setSuggestionPickerVisibility,
  mentionPickerVisibility,
  setMentionPickerVisibility,
}) => {
  const dispatch = useDispatch();
  const debouncer = useDebouncer();
  const { t } = useTranslation();

  const [editingEmoji, setEditingEmoji] = useState<string>('');
  const [suggestions, setSuggestions] = useState<EmojiData[]>([]);
  const [search, setSearch] = useState<string>('');

  const {
    user: {
      search: { results },
    },
  } = useSelector((state: AppState) => state);

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

  const getMentionUserList = (searchText: string) =>
    dispatch(searchProfileAction({ name: searchText, userContacts: false }));

  useEffect(() => {
    debouncer(() => getMentionUserList(search), 300);
  }, [search, mentionPickerVisibility]);

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
          const emojiReplace =
            'native' in currentSuggestions[0]
              ? currentSuggestions[0].native
              : currentSuggestions[0].name;
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
    return resultText;
  };

  const getMentionInSentence = async (
    textMessage: string,
    selectionIndex: number
  ) => {
    const resultText = textMessage;
    let mentionStartIndex = -1;

    for (let i = selectionIndex; i >= 0; i--) {
      if (resultText[i] === '@') {
        if (i === 0 || resultText[i - 1] === ' ') mentionStartIndex = i;
        break;
      } else if (resultText[i] === ' ') {
        break;
      }
    }
    if (mentionStartIndex > -1) {
      const searchText = resultText.substring(
        mentionStartIndex,
        selectionIndex
      );
      await setSearch(searchText);
      setMentionPickerVisibility(true);
    } else if (mentionPickerVisibility) {
      setMentionPickerVisibility(false);
    }

    return resultText;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    const { value, selectionStart } = e.target;
    let currentText = getEmojiTextInSentence(value, selectionStart);
    currentText = await getMentionInSentence(currentText, selectionStart);
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
          getMentionInSentence(value, Math.max(selectionStart - 1, 0));
          break;
        case 'Right':
        case 'ArrowRight':
          e.persist();
          getEmojiTextInSentence(value, selectionStart, true);
          getMentionInSentence(
            value,
            Math.min(selectionStart + 1, e.target.value.length)
          );
          break;
        case 'Up':
        case 'ArrowUp':
          e.persist();
          getEmojiTextInSentence(value, selectionStart);
          getMentionInSentence(value, selectionStart);
          break;
        case 'Down':
        case 'ArrowDown':
          e.persist();
          getEmojiTextInSentence(value, selectionStart);
          getMentionInSentence(value, selectionStart);
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
      const native = 'native' in emoji ? emoji.native : emoji.name;
      const after = text.slice(element.selectionStart);
      const newText = `${before}${native}${after}`;
      setText(newText);
      setEditingEmoji('');
      setSuggestions([]);
      handleTextAreaCursor(before.length + native.length);
      setEmojiPickerVisibility(false);
    }
  };

  const onSelectMention = (user: UserBasic) => {
    const element = textAreaRef.current;
    const { userName } = user;
    if (element && userName) {
      let before;
      const after = text.slice(element.selectionStart);

      const atIndex = _.findLastIndex(
        text.slice(0, element.selectionStart),
        (i) => i === '@'
      );
      if (atIndex > -1) before = text.slice(0, atIndex);
      if (typeof before !== 'undefined') {
        const newText = `${before}@${user.userName}${
          after?.charAt(0) === ' ' ? after : ` ${after}`
        }`;
        setText(newText);
        handleTextAreaCursor(before.length + userName.length + 2);
      }
    }
    setMentionPickerVisibility(false);
  };

  const pickerBottom = `${(componentRef?.current?.clientHeight || 0) + 15}px`;
  const pickerWidth = textAreaRef?.current?.clientWidth
    ? `${textAreaRef?.current?.clientWidth}px`
    : '100%';

  return (
    <Box>
      <EmojiPicker
        visibility={emojiPickerVisibility}
        setVisibility={setEmojiPickerVisibility}
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
      <MentionPicker
        visibility={mentionPickerVisibility}
        bottom={pickerBottom}
        width={pickerWidth}
        userList={results.data}
        onSelect={onSelectMention}
      />
      <Box round="small" fill gap="small" width="100%" ref={componentRef}>
        <MessageTextAreaComponent
          plain
          value={text}
          ref={textAreaRef}
          resize={false}
          focusIndicator={false}
          placeholder={
            name
              ? t('MessageTextArea.writeTo', { name })
              : t('MessageTextArea.writeComment')
          }
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyUp}
          onChange={handleChange}
          rows={1}
        />
      </Box>
    </Box>
  );
};

export default MessageBox;
