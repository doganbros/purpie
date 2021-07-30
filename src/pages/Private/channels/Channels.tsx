import React, { FC } from 'react';
import { Box, Card, CardFooter, CardBody, TextInput, Text } from 'grommet';
import { CloudComputer, Info, Search } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';

const Channels: FC = () => (
  <PrivatePageLayout
    title="Zones"
    icon={CloudComputer}
    rightComponent={
      <Box flex={{ grow: 2 }}>
        <Box
          pad={{ horizontal: 'medium' }}
          style={{ position: 'fixed' }}
          height="100%"
          overflow="auto"
        >
          <Box fill="horizontal" margin={{ vertical: 'medium' }} gap="medium">
            <TextInput icon={<Search />} placeholder="Search..." />
          </Box>
          <Card background="brand">
            <CardBody pad="small">
              <Box gap="small" align="center" pad="small">
                <Info size="large" />
                <Box>
                  <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Corporis, quam.
                  </Text>
                </Box>
              </Box>
            </CardBody>
            <CardFooter pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Text size="xsmall">12 components</Text>
            </CardFooter>
          </Card>
        </Box>
      </Box>
    }
  >
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis orci
      nec turpis vulputate pulvinar. Cras tempus nunc nisl, eget dictum velit
      gravida non. Donec nec elit malesuada, suscipit eros ac, ullamcorper leo.
      Vestibulum sollicitudin, erat vel dictum aliquam, erat mi mattis turpis,
      sit amet porttitor felis metus tincidunt lacus. Aliquam sagittis congue
      tempor. Phasellus iaculis ultrices faucibus. Fusce quis facilisis erat.
      Morbi dapibus dui urna, a venenatis ante iaculis at. Quisque egestas metus
      aliquet sodales cursus. Maecenas massa mi, tincidunt sagittis ante sit
      amet, ornare porta nisl. Curabitur at massa vel augue scelerisque
      vestibulum eget a justo. Maecenas ut porta dui.
      <br />
      Suspendisse viverra arcu id risus porta, at ornare mauris imperdiet. Proin
      at porta purus. Vestibulum nunc nibh, tempor in augue ut, vulputate
      imperdiet mauris. Etiam in lectus sit amet magna pretium rhoncus. Integer
      non purus luctus, finibus neque id, molestie neque. Mauris aliquam
      consectetur rutrum. Vestibulum eleifend purus leo. Mauris ut lectus ac
      libero cursus sagittis. Quisque et quam commodo, scelerisque lectus quis,
      accumsan neque. Fusce a tristique ipsum.
      <br />
      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
      cubilia curae; Duis ornare urna laoreet neque maximus, non maximus est
      bibendum. Etiam malesuada elementum turpis, nec imperdiet velit sodales a.
      Sed ut ante leo. Nulla sapien odio, interdum eget odio vel, sagittis
      volutpat quam. Aenean dignissim, justo non tempus ultricies, dolor quam
      scelerisque risus, tempor faucibus risus tortor sed diam. Aliquam id
      viverra eros. Nullam in pharetra magna. Fusce a lacus quam.
      <br />
      Proin in dolor mauris. Nam viverra rutrum fringilla. Proin a elementum
      lectus. Proin ac orci in nisl fermentum lobortis quis facilisis lectus.
      Integer ut nisl massa. Integer dignissim lacus vitae sapien tincidunt
      rutrum sed ut eros. Phasellus auctor lectus lectus, quis malesuada velit
      eleifend et. Nam gravida, eros et lacinia facilisis, purus risus sodales
      nibh, a venenatis tortor tellus ornare nulla. Duis elementum sollicitudin
      neque, sed iaculis urna luctus quis. Nulla purus ipsum, elementum ut
      malesuada non, hendrerit ac felis. Vivamus a leo libero. Integer feugiat
      neque ligula, ut aliquam risus aliquam sed. Aliquam felis odio, mollis at
      maximus eu, pretium sed augue. Nunc ultrices, odio et dapibus dapibus, dui
      sapien cursus erat, id venenatis erat massa vitae libero.
      <br />
      Nunc fringilla consectetur ante eget dignissim. Proin a lacus a arcu
      faucibus varius ac ac odio. Quisque blandit augue dui, non tempus lacus
      molestie et. Nullam mi diam, porttitor at dolor a, pretium luctus tortor.
      Vivamus in vulputate urna. In varius, ante eu interdum eleifend, nibh ex
      ultricies lectus, vitae egestas velit sem id justo. Nullam nulla turpis,
      viverra ut dui quis, lacinia ultricies tortor. Donec sollicitudin vehicula
      diam, quis laoreet mauris imperdiet a. Cras varius egestas metus, quis
      rhoncus dui elementum in. Morbi volutpat libero eget magna blandit, luctus
      faucibus neque consectetur. Quisque pulvinar luctus sem. Suspendisse a
      lectus eget est facilisis lacinia sit amet vitae nisi.
      <br />
    </Text>
  </PrivatePageLayout>
);

export default Channels;
