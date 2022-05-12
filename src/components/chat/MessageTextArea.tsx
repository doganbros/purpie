import { Box, Button, Image, TextArea } from 'grommet';
import React, { FC, useLayoutEffect, useState } from 'react';
import { ChatMessage } from '../../store/types/chat.types';
import { useThrottle } from '../../hooks/useThrottle';
import InitialsAvatar from '../utils/InitialsAvatar';
import { User } from '../../store/types/auth.types';
import ExtendedBox from '../utils/ExtendedBox';
import AttachmentIcon from '../../assets/icons/attachment.svg';
import AtIcon from '../../assets/icons/at.svg';
import EmojiIcon from '../../assets/icons/emoji.svg';

interface Props {
  name?: string;
  handleTypingEvent?: boolean;
  onTyping: () => void;
  user: User;
  onSubmit: (message: Partial<ChatMessage>) => void;
}

const TYPING_THROTTLE_INTERVAL = 700;

const MessageTextArea: FC<Props> = ({
  name,
  onSubmit,
  handleTypingEvent,
  onTyping,
  user,
}) => {
  const throttle = useThrottle();
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [
    attachmentToolVisibility,
    setAttachmentToolVisibility,
  ] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useLayoutEffect(() => {
    const newValue = focused || text.length > 0;
    if (newValue !== attachmentToolVisibility) {
      if (newValue) {
        setAttachmentToolVisibility(true);
      } else if (!mouseOver) {
        setAttachmentToolVisibility(false);
      }
    }
  }, [mouseOver, text, focused]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
      e.preventDefault();
      onSubmit({ message: e.currentTarget.value });
      e.currentTarget.value = '';
      return null;
    }
    if (handleTypingEvent) {
      return throttle(() => {
        onTyping();
      }, TYPING_THROTTLE_INTERVAL);
    }
    return null;
  };

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
    <Box
      direction="row"
      align="center"
      margin={{ right: 'small', left: 'small' }}
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <input
        type="file"
        ref={inputFileRef}
        onChangeCapture={onFileChangeCapture}
        style={{ display: 'none' }}
      />
      {user && (
        <Box flex={{ shrink: 0 }}>
          <InitialsAvatar
            size="medium"
            id={user.id}
            value={`${user?.firstName} ${user?.lastName}`}
          />
        </Box>
      )}
      <ExtendedBox
        elevation="indigo"
        margin={{ right: 'small', left: 'small' }}
        gap="small"
        round="small"
        direction="column"
        width="100%"
        height="fit-content"
        position="relative"
      >
        <Box
          pad={{ right: 'small', left: 'small' }}
          round="small"
          fill
          gap="small"
          width="100%"
        >
          <TextArea
            plain
            resize={false}
            focusIndicator={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Write ${name ? `to ${name}` : 'your message...'} `}
            onKeyDown={(e) => onKeyDown(e)}
            onChange={(e) => setText(e.target.value)}
            style={{ overflow: 'none' }}
            rows={1}
          />
        </Box>
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
          <Box direction="row" margin={{ left: 'small' }}>
            <Button
              size="small"
              margin="0px"
              onClick={() => {
                inputFileRef?.current?.click();
              }}
              style={{
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '6px',
                paddingRight: '6px',
              }}
              icon={<Image src={AttachmentIcon} width="14px" height="15px" />}
            />
            <Button
              size="small"
              margin="0px"
              style={{
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '6px',
                paddingRight: '6px',
              }}
              icon={<Image src={AtIcon} width="14px" height="15px" />}
            />
            <Button
              size="small"
              margin="0px"
              style={{
                paddingTop: '0',
                paddingBottom: '0',
                paddingLeft: '6px',
                paddingRight: '6px',
              }}
              icon={<Image src={EmojiIcon} width="14px" height="15px" />}
            />
          </Box>
          <Box>
            <Button primary label="Send" disabled={text.length === 0} />
          </Box>
        </ExtendedBox>
      </ExtendedBox>
    </Box>
  );
};

export default MessageTextArea;
