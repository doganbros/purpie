import React, { useContext } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Image,
  Text,
  ThemeContext,
} from 'grommet';
import { useHistory } from 'react-router-dom';
import PublicPageLayout from './PublicPageLayout/PublicPageLayout';
import { useResponsive } from '../../hooks/useResponsive';
import Logo from '../../assets/octopus-logo/logo-color.png';
import LogoWhite from '../../assets/octopus-logo/logo-white.png';
import OctopusText from '../../assets/octopus-logo/octopus-text.png';
import ExtendedButton from '../auth/ExtendedButton';

interface Props {
  title: string;
  callToAction?: {
    onClick: () => void;
    title: string;
    body: string;
    disabled?: boolean;
  };
  background?: JSX.Element;
  formTitle: string;
  formSubTitle: string | JSX.Element;
}

const AuthLayout: React.FC<Props> = ({
  title,
  children,
  callToAction,
  formSubTitle,
  formTitle,
  background,
}) => {
  const history = useHistory();
  const size = useResponsive();

  const theme = useContext<Record<string, any>>(ThemeContext);

  const formWidth = {
    small: '100%',
    medium: '45%',
    large: '40%',
  };

  const headingSize = {
    small: '30px',
    medium: '38px',
    large: '45px',
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
            basis={size === 'medium' ? '55%' : '60%'}
            height="100%"
            alignSelf="center"
            margin="0"
          >
            <Box basis="70%">{background}</Box>
            <Box basis="25%" align="center">
              {callToAction && (
                <>
                  <Text size="16px" margin={{ bottom: '14px', top: '20px' }}>
                    {callToAction.title}
                  </Text>
                  <ExtendedButton
                    fontSize="16px"
                    disabled={callToAction.disabled || false}
                    minWidth={size === 'large' ? '430px' : '320px'}
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
            elevation="indigo"
            background={theme.dark ? 'dark-2' : 'white'}
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
                style={{ cursor: 'pointer' }}
                onClick={() => history.push('/login')}
                align="center"
                fill="horizontal"
              >
                <Image
                  margin={{ right: '14px' }}
                  width="40px"
                  src={theme.dark ? LogoWhite : Logo}
                />
                {theme.dark ? (
                  <Text>octopus</Text>
                ) : (
                  <Image src={OctopusText} height="24px" />
                )}
              </Box>
              <Heading size={headingSize[size]} margin={{ bottom: 'xxsmall' }}>
                {formTitle}
              </Heading>
              <Text size="14px" margin={{ left: 'xsmall', bottom: size }}>
                {formSubTitle}
              </Text>
              {children}
              {size === 'small' && callToAction && (
                <Box>
                  <Text
                    textAlign="center"
                    margin={{ bottom: '20px', top: '20px' }}
                  >
                    {callToAction.title}
                  </Text>
                  <ExtendedButton
                    fontSize="16px"
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
