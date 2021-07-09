import { Box, Heading } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { verifyUserEmailAction } from '../../store/actions/auth.action';

interface Params {
  token: string;
}

const VerifyUserEmail: FC = () => {
  const dispatch = useDispatch();
  const { token } = useParams<Params>();

  useEffect(() => {
    dispatch(verifyUserEmailAction({ token }));
  }, []);

  return (
    <Box
      height="100vh"
      align="center"
      justify="center"
      className="background-gradient"
    >
      <Heading color="white">Your email is been verified...</Heading>
    </Box>
  );
};

export default VerifyUserEmail;
