import { Box, Button, Image, TextArea } from 'grommet';
import React, { FC, useState } from 'react';
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
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const attachmentToolVisibility = focused || text.length > 0;
  console.log(focused, text, text.length > 0);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(e);
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
      e.preventDefault();
      onSubmit({ message: e.currentTarget.value });
      e.currentTarget.value = '';
      return null;
    }
    if (handleTypingEvent) {
      setText(e.currentTarget.value);
      return throttle(() => {
        onTyping();
      }, TYPING_THROTTLE_INTERVAL);
    }
    return null;
  };

  return (
    <Box
      direction="row"
      align="center"
      margin={{ right: 'small', left: 'small' }}
    >
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
          <Box direction="row" margin={{left: "small"}}>
            <Button
              size="small"
              margin="0px"
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
            <Button primary label="Send" disabled={text.length > 0} />
          </Box>
        </ExtendedBox>
      </ExtendedBox>
    </Box>
  );
};

export default MessageTextArea;
