import { Grommet } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './config/i18n/i18n-config';
import AppToast from './components/utils/AppToast';
import Loader from './components/utils/Loader';
import PrivateRoute from './components/utils/PrivateRoute';
import PublicRoute from './components/utils/PublicRoute';
import { theme } from './config/app-config';
import appHistory from './helpers/history';
import NotFound from './pages/Private/NotFound';
import { privateRoutes, publicRoutes } from './routes';
import { retrieveUserAction } from './store/actions/auth.action';
import { getUserZonesAction } from './store/actions/zone.action';
import { AppState } from './store/reducers/root.reducer';
import InitializeUser from './pages/Public/InitializeUser';
import { initializeSocket } from './helpers/socket';
import { getUserChannelsAction } from './store/actions/channel.action';
import { DELAY_TIME } from './helpers/constants';
import useDelayTime from './hooks/useDelayTime';
import { listFolderAction } from './store/actions/folder.action';
import StaticPage from './pages/Public/static/StaticPage';
import ZoneNotFound from './pages/Private/ZoneNotFound';

const App: FC = () => {
  const dispatch = useDispatch();

  const { delay } = useDelayTime(DELAY_TIME);

  const {
    auth: {
      isAuthenticated,
      retrieveUser: { loading },
    },
    zone: { userZoneInitialized },
    util: { toast },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(retrieveUserAction());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
      dispatch(getUserChannelsAction());
      dispatch(getUserZonesAction());
      dispatch(listFolderAction());
    }
  }, [isAuthenticated]);

  return (
    <Grommet theme={theme}>
      <I18nextProvider i18n={i18n}>
        <AppToast
          visible={toast.visible}
          status={toast.status}
          message={toast.message}
          id={toast.toastId}
        />
        {delay || loading || (isAuthenticated && !userZoneInitialized) ? (
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
              <Route
                path={['/support/:page', '/support']}
                component={StaticPage}
              />
              <Route exact path="/initialize-user" component={InitializeUser} />
              <Route exact path="/zone-not-found" component={ZoneNotFound} />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        )}
      </I18nextProvider>
    </Grommet>
  );
};

export default App;
