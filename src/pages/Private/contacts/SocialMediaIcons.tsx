import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

interface SocialMediaIconsProps {
  shareUrl: string;
  title: string;
  iconSize?: number;
}

const SocialMediaIcons: FC<SocialMediaIconsProps> = ({
  iconSize = 45,
  shareUrl,
  title,
}) => {
  return (
    <Box direction="row" justify="between" pad="small" gap="small">
      <Box align="center">
        <WhatsappShareButton title={title} url={shareUrl}>
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>

        <Text color="black" size="12px">
          Whatsapp
        </Text>
      </Box>

      <Box align="center">
        <FacebookShareButton title={title} url={shareUrl}>
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>

        <Text color="black" size="12px">
          Facebook
        </Text>
      </Box>

      <Box align="center">
        <TwitterShareButton title={title} url={shareUrl}>
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>

        <Text color="black" size="12px">
          Twitter
        </Text>
      </Box>
    </Box>
  );
};

export default SocialMediaIcons;
