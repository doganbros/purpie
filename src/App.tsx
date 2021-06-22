import { Grommet } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import AppToast from './components/utils/AppToast';
import Loader from './components/utils/Loader';
import PrivateRoute from './components/utils/PrivateRoute';
import PublicRoute from './components/utils/PublicRoute';
import { theme } from './config/app-config';
import appHistory from './helpers/history';
import NotFound from './pages/Private/NotFound';
import { privateRoutes, publicRoutes } from './routes';
import { retieveUserAction } from './store/actions/auth.action';
import { removeToastAction } from './store/actions/util.action';
import { AppState } from './store/reducers/root.reducer';

const App: FC = () => {
  const dispatch = useDispatch();

  const {
    auth: {
      retrieveUser: { loading },
    },
    util: { toast },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(retieveUserAction());
  }, []);

  return (
    <Grommet theme={theme}>
      <AppToast
        visible={toast.visible}
        status={toast.status}
        message={toast.message}
        onClose={() => dispatch(removeToastAction)}
      />
      {loading ? (
        <Loader />
      ) : (
        <Router history={appHistory}>
          <Switch>
            {privateRoutes.map(({ id, path, component, exact = true }) => (
              <PrivateRoute
                key={id}
                exact={exact}
                path={path}
                component={component}
              />
            ))}
            {publicRoutes.map(({ id, path, component, exact = true }) => (
              <PublicRoute
                key={id}
                exact={exact}
                path={path}
                component={component}
              />
            ))}
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      )}
    </Grommet>
  );
};

export default App;
