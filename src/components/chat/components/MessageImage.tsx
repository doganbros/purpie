import React, { FC } from 'react';
import { ChatAttachment } from '../../../store/types/chat.types';
import { UploadedImageContainer, UploadedImage } from './ChatComponentsStyle';

interface Props {
  attachment: ChatAttachment;
}

const MessageImage: FC<Props> = ({ attachment }) => {
  const url = `${process.env.REACT_APP_SERVER_HOST}/v1/chat/attachment/${attachment.name}`;

  return (
    <UploadedImageContainer
      key={attachment.name}
      direction="row"
      justify="between"
      align="center"
      margin="xxsmall"
      pad={{ bottom: 'small' }}
      hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
      round="small"
      width="100%"
      height="xsmall"
      background="red"
    >
      {false && <UploadedImage width="100%" height="100%" src={url} />}
    </UploadedImageContainer>
  );
};

export default MessageImage;
