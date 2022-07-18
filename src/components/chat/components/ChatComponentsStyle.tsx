import { Box, Button, Image, Spinner, TextArea } from 'grommet';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../config/app-config';

export const UploadedImageContainer = styled(Box)`
  position: relative;
  white-space: nowrap;
  min-width: 45%;
  display: block;
`;

export const UploadedImage = styled(Image)`
  box-shadow: 0px 2px 20px #ffe7e380;
  border-radius: 12px;
  display: block;
  object-fit: scale-down;
  display: inline-block;
  z-index: 131231231233;
`;

export const ImageDeleteButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${theme.global?.colors?.white};
  padding: 6px;
  border-radius: 100%;
  &:hover {
    opacity: 0.5;
  }
`;

export const ImageErrorIcon = styled(Image)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
`;

export const UploadingProgressBarContainer = styled(Box)`
  position: absolute;
  top: calc(50% - 4px);
  left: 0;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const progressWidthAnimation = keyframes`
  0% {
    width: 0;
    margin-right: auto;
  }
  50% {
    width: 100%;
    margin-left: 0;
  }
  100% {
    margin-left: 100%;
    width: 0;
    margin-right: auto;
  }
`;

export const UploadingProgressBar = styled(Box)`
  animation: ${progressWidthAnimation} 1.7s linear infinite;
`;

export const SendButtonContainer = styled(Box)`
  position: absolute;
  right: 0;
  bottom: 0%;
`;

export const SendButton = styled(Button)`
  border-radius: 8px;
`;

export const AttachmentButton = styled(Button)`
  padding: 4px;
`;

export const MessageTextAreaComponent = styled(TextArea)`
  font-family: Poppins;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #555c68;

  ::placeholder,
  ::-webkit-input-placeholder {
    font-family: Poppins;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #555c68;
  }
  :-ms-input-placeholder {
    font-family: Poppins;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #555c68;
  }
`;

export const MessageBoxHorizontalScroll = styled(Box)`
  &::-webkit-scrollbar {
    border: none;
    width: 0;
    height: 0;
  }
`;

export const ImageLoading = styled(Spinner)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
`;
