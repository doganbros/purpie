import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/reducers/root.reducer';

const InitializeUser: FC = () => {
  const { isInitialUserSetup } = useSelector((state: AppState) => state.auth);
  const history = useHistory();

  useEffect(() => {
    if (!isInitialUserSetup) history.push('/login');
    else document.title = 'Initialize User';
  }, []);
  // NOTE: Dont forget to set isInitialUserSetup to false after successful setup.
  return <h1>Initialize User Here</h1>;
};

export default InitializeUser;
