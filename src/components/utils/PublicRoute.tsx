import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/reducers/root.reducer';

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PublicRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isInitialUserSetup } = useSelector(
    (state: AppState) => state.auth
  );

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isInitialUserSetup) return <Redirect to="/initialize-user" />;
        if (!isAuthenticated) return <Component {...props} />;
        const state = props.history?.location?.state as any;
        if (state?.referrer) return <Redirect to={state?.referrer} />;
        return <Redirect to="/" />;
      }}
    />
  );
};

export default PublicRoute;
