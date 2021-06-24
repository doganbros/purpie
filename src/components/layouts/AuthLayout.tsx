import React from 'react';
import { Box, Card, CardBody, Text, Button, Image, Heading } from 'grommet';
import PublicPageLayout from './PublicPageLayout/PublicPageLayout';
import { useResponsive } from '../../hooks/useResponsive';
import Logo from '../../assets/octopus-logo/logo-color.png';
import OctopusText from '../../assets/octopus-logo/octopus-text.png';

interface Props {
  title: string;
  callToAction?: {
    onClick: () => void;
    title: string;
    body: string;
  };
  background?: JSX.Element;
  formTitle: string;
  formSubTitle: string;
}

const AuthLayout: React.FC<Props> = ({
  title,
  children,
  callToAction,
  formSubTitle,
  formTitle,
  background,
}) => {
  const size = useResponsive();

  const formWidth = {
    small: '100%',
    medium: '50%',
    large: '40%',
  };

  return (
    <PublicPageLayout title={title}>
      <Box
        direction="row"
        justify="between"
        round="large"
        height={{ min: '100vh' }}
        background={{ color: '#FFE7E3' }}
      >
        {size !== 'small' ? (
          <Box
            basis={size === 'medium' ? '50%' : '60%'}
            height="100%"
            alignSelf="center"
            margin="0"
          >
            <Box basis="70%">{background}</Box>
            <Box basis="25%" align="center">
              {callToAction && (
                <>
                  <Text margin={{ bottom: '20px', top: '20px' }}>
                    {callToAction.title}
                  </Text>
                  <Button
                    style={{
                      paddingRight: size === 'large' ? '130px' : '50px',
                      paddingLeft: size === 'large' ? '130px' : '50px',
                      maxWidth: '600px',
                    }}
                    fill={false}
                    size={size}
                    onClick={callToAction.onClick}
                    primary
                    label={callToAction.body}
                  />
                </>
              )}
            </Box>
          </Box>
        ) : null}
        <Box basis={formWidth[size]} margin="0" style={{ zIndex: 2 }}>
          <Card
            elevation="xlarge"
            background="light-1"
            round="large"
            width="100%"
            height="100%"
            align="center"
            overflow="auto"
          >
            <CardBody width="80%" justify="center" pad={{ vertical: '10px' }}>
              <Box
                margin={{ bottom: 'xsmall' }}
                direction="row"
                align="center"
                fill="horizontal"
              >
                <Image
                  margin={{ right: 'xsmall' }}
                  width="50px"
                  height="50px"
                  src={Logo}
                />
                <Image src={OctopusText} height="20px" />
              </Box>
              <Heading
                level={size === 'large' ? 1 : 2}
                margin={{ bottom: 'xxsmall' }}
              >
                {formTitle}
              </Heading>
              <Text size="small" margin={{ left: 'xsmall', bottom: size }}>
                {formSubTitle}
              </Text>
              {children}
              {size === 'small' && callToAction && (
                <Box align="center">
                  <Text margin={{ bottom: '20px', top: '20px' }}>
                    {callToAction.title}
                  </Text>
                  <Button
                    fill="horizontal"
                    size={size}
                    onClick={callToAction.onClick}
                    primary
                    label={callToAction.body}
                  />
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
      </Box>
    </PublicPageLayout>
  );
};

export default AuthLayout;
