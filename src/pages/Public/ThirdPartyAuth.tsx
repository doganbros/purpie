import { Box, Heading } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { authenticateWithThirdPartyCodeAction } from '../../store/actions/auth.action';

interface Params {
  name: string;
}

const ThirdPartyAuth: FC = () => {
  const dispatch = useDispatch();
  const { name } = useParams<Params>();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const email = new URLSearchParams(window.location.search).get('email');
    if (code || email) {
      dispatch(authenticateWithThirdPartyCodeAction(name, code, email));
    }
  }, []);

  return (
    <Box
      height="100vh"
      align="center"
      justify="center"
      className="background-gradient"
    >
      <Heading color="white">Please Wait...</Heading>
    </Box>
  );
};

export default ThirdPartyAuth;
