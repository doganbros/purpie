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

    if (code) {
      dispatch(authenticateWithThirdPartyCodeAction(name, code));
    }
  }, []);

  return (
    <Box fill align="center" justify="center" className="background-gradient">
      <Heading color="white">Please Wait...</Heading>
    </Box>
  );
};

export default ThirdPartyAuth;
