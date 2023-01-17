import React from 'react';
import { Box, Text } from 'grommet';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const PrivacyPolicy: () => Menu | null = () => {
  return {
    id: 0,
    key: 'privacy-policy',
    label: 'Privacy Policy',
    labelNotVisible: true,
    url: 'privacy-policy',
    items: [
      {
        key: 'privacy-policy-content',
        title: 'Privacy Policy',
        component: (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
          >
            <Text color="dark" size="medium" weight="normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci
              ac auctor augue mauris augue. Nec dui nunc mattis enim ut tellus.
              Scelerisque purus semper eget duis at tellus at urna condimentum.
              Mauris pharetra et ultrices neque ornare aenean euismod. In
              egestas erat imperdiet sed euismod. Pellentesque sit amet
              porttitor eget. Egestas quis ipsum suspendisse ultrices gravida
              dictum. Eget gravida cum sociis natoque penatibus et magnis dis.
              Ac felis donec et odio pellentesque. Ac ut consequat semper
              viverra nam libero justo laoreet.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Luctus accumsan tortor posuere ac ut consequat semper. Porttitor
              leo a diam sollicitudin tempor. Hac habitasse platea dictumst
              vestibulum rhoncus. Aliquet risus feugiat in ante metus. Vitae
              auctor eu augue ut lectus. In dictum non consectetur a erat nam.
              Sed blandit libero volutpat sed cras. Tempor orci eu lobortis
              elementum nibh tellus molestie nunc. Quam vulputate dignissim
              suspendisse in est ante. Massa id neque aliquam vestibulum morbi.
              Pellentesque habitant morbi tristique senectus. Neque sodales ut
              etiam sit amet. Eget aliquet nibh praesent tristique magna sit
              amet purus gravida. Nisi vitae suscipit tellus mauris a diam
              maecenas sed. Dictum varius duis at consectetur lorem donec massa
              sapien. Feugiat sed lectus vestibulum mattis ullamcorper velit sed
              ullamcorper. Integer enim neque volutpat ac tincidunt vitae
              semper. Montes nascetur ridiculus mus mauris vitae ultricies leo
              integer malesuada.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Urna et pharetra pharetra massa massa ultricies mi. Sit amet
              facilisis magna etiam. Hac habitasse platea dictumst quisque.
              Venenatis cras sed felis eget velit aliquet sagittis id. Urna nec
              tincidunt praesent semper. Quam id leo in vitae. Nisl tincidunt
              eget nullam non nisi est sit. Vulputate eu scelerisque felis
              imperdiet proin. Leo in vitae turpis massa sed elementum tempus.
              Sed ullamcorper morbi tincidunt ornare massa eget. Aliquet
              sagittis id consectetur purus.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Urna et pharetra pharetra massa massa ultricies mi. Sit amet
              facilisis magna etiam. Hac habitasse platea dictumst quisque.
              Venenatis cras sed felis eget velit aliquet sagittis id. Urna nec
              tincidunt praesent semper. Quam id leo in vitae. Nisl tincidunt
              eget nullam non nisi est sit. Vulputate eu scelerisque felis
              imperdiet proin. Leo in vitae turpis massa sed elementum tempus.
              Sed ullamcorper morbi tincidunt ornare massa eget. Aliquet
              sagittis id consectetur purus.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Urna et pharetra pharetra massa massa ultricies mi. Sit amet
              facilisis magna etiam. Hac habitasse platea dictumst quisque.
              Venenatis cras sed felis eget velit aliquet sagittis id. Urna nec
              tincidunt praesent semper. Quam id leo in vitae. Nisl tincidunt
              eget nullam non nisi est sit. Vulputate eu scelerisque felis
              imperdiet proin. Leo in vitae turpis massa sed elementum tempus.
              Sed ullamcorper morbi tincidunt ornare massa eget. Aliquet
              sagittis id consectetur purus.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Urna et pharetra pharetra massa massa ultricies mi. Sit amet
              facilisis magna etiam. Hac habitasse platea dictumst quisque.
              Venenatis cras sed felis eget velit aliquet sagittis id. Urna nec
              tincidunt praesent semper. Quam id leo in vitae. Nisl tincidunt
              eget nullam non nisi est sit. Vulputate eu scelerisque felis
              imperdiet proin. Leo in vitae turpis massa sed elementum tempus.
              Sed ullamcorper morbi tincidunt ornare massa eget. Aliquet
              sagittis id consectetur purus.
            </Text>
            <br />
            <Text color="dark" size="medium" weight="normal">
              Urna et pharetra pharetra massa massa ultricies mi. Sit amet
              facilisis magna etiam. Hac habitasse platea dictumst quisque.
              Venenatis cras sed felis eget velit aliquet sagittis id. Urna nec
              tincidunt praesent semper. Quam id leo in vitae. Nisl tincidunt
              eget nullam non nisi est sit. Vulputate eu scelerisque felis
              imperdiet proin. Leo in vitae turpis massa sed elementum tempus.
              Sed ullamcorper morbi tincidunt ornare massa eget. Aliquet
              sagittis id consectetur purus.
            </Text>
          </Box>
        ),
      },
    ],
  };
};

export default PrivacyPolicy;
