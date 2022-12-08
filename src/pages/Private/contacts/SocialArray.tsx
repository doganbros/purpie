import { Box, Text } from 'grommet';
import { nanoid } from 'nanoid';
import React, { FC, ReactElement } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

const SocialArray: FC = () => {
  // interface SocialBoxProps {
  //   color?: string | any;
  //   children?: ReactElement | any;
  // }

  interface SocialArrayProps {
    WhatsApp: ReactElement;
    Facebook: ReactElement;
    Twitter?: ReactElement;
    // Snapchat: ReactElement;
    // Instagram: ReactElement;
  }

  // const SocialBox: FC<SocialBoxProps> = ({ color, children }) => {
  //   return (
  //     <Box
  //       background={color}
  //       round
  //       width="xxsmall"
  //       height="xxsmall"
  //       justify="center"
  //       align="center"
  //       margin={{ bottom: 'xsmall' }}
  //     >
  //       {children}
  //     </Box>
  //   );
  // };

  const socialArray = [
    'WhatsApp',
    'Facebook',
    'Twitter',
    // 'Snapchat',
    // 'Instagram',
  ];

  const socialComponents: SocialArrayProps = {
    WhatsApp: (
      <WhatsappShareButton
        title="I am inviting you to join Purple."
        url="https://www.purpie.io/invite"
      >
        <WhatsappIcon size={45} round />
      </WhatsappShareButton>
    ),
    Facebook: (
      <FacebookShareButton
        title="I am inviting you to join Purple."
        url="https://www.purpie.io/invite"
      >
        <FacebookIcon size={45} round />
      </FacebookShareButton>
    ),
    Twitter: (
      <TwitterShareButton
        title="I am inviting you to join Purple."
        url="https://www.purpie.io/invite"
      >
        <TwitterIcon size={45} round />
      </TwitterShareButton>
    ),

    // removed for just now, we will decide later

    // Snapchat: (
    //   <SocialBox color="#FFFC00">
    //     <Snapchat color="white" />
    //   </SocialBox>
    // ),
    // Instagram: (
    //   <SocialBox color="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)">
    //     <Instagram color="white" />
    //   </SocialBox>
    // ),
  };
  return (
    <>
      {socialArray.map((social) => (
        <Box key={nanoid()} gap="small" justify="center" align="center">
          {socialComponents[social as keyof SocialArrayProps]}

          <Text size="12px">{social}</Text>
        </Box>
      ))}
    </>
  );
};

export default SocialArray;
