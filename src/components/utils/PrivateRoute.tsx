/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { AppState } from '../../store/reducers/root.reducer';

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<Props> = ({ component: Page, ...rest }) => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Page {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/join',
              state: { referrer: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
