import { Box, Button, Image } from 'grommet';
import styled from 'styled-components';
import { theme } from '../../../config/app-config';

export const UploadedImageContainer = styled(Box)`
  position: relative;
`;

export const UploadedImage = styled(Image)`
  box-shadow: '0px 2px 20px 0px #FFE7E380';
  border-radius: 12px;
`;

export const ImageDeleteButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${theme.global?.colors?.white};
  padding: 6px;
  border-radius: 100%;
`;
