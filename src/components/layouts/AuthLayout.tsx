import React from 'react';
import { Box, Card, CardBody, Text, Button } from 'grommet';
import PublicPageLayout from './PublicPageLayout/PublicPageLayout';

interface Props {
  title: string;
  callToAction?: {
    onClick: () => void;
    title: string;
    body: string;
  };
  background?: JSX.Element;
}

const AuthLayout: React.FC<Props> = ({
  title,
  children,
  callToAction,
  background,
}) => {
  return (
    <PublicPageLayout title={title}>
      <Box
        direction="row"
        justify="between"
        round="large"
        fill
        background={{ color: '#FFE7E3' }}
      >
        <Box
          basis="60%"
          justify="center"
          align="center"
          height="100%"
          style={{ position: 'relative' }}
        >
          {background}
          {callToAction && (
            <>
              <Text margin={{ bottom: '20px', top: '20px' }}>
                {callToAction.title}
              </Text>
              <Button
                style={{
                  paddingRight: '130px',
                  paddingLeft: '130px',
                  maxWidth: '600px',
                }}
                fill={false}
                size="large"
                onClick={callToAction.onClick}
                primary
                label={callToAction.body}
              />
            </>
          )}
        </Box>
        <Box fill basis="40%" margin="0" style={{ zIndex: 2 }}>
          <Card
            elevation="xlarge"
            background="light-1"
            height="100%"
            round="large"
            width="100%"
            align="center"
            overflow="auto"
          >
            <CardBody width="75%" justify="center">
              {children}
            </CardBody>
          </Card>
        </Box>
      </Box>
    </PublicPageLayout>
  );
};

export default AuthLayout;
