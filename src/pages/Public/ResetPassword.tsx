import {
  Box,
  Button,
  Heading,
  Form,
  FormField,
  TextInput,
  Card,
  CardBody,
} from 'grommet';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';

interface Params {
  token: string;
}

const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const { token } = useParams<Params>();

  const {
    resetPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit = (payload: Record<string, any>) => {
    dispatch(
      resetPasswordAction({
        password: payload.password,
        token,
      })
    );
  };

  return (
    <AuthLayout title="Reset Password">
      <Card
        elevation="xsmall"
        background="light-1"
        overflow="auto"
        width={{ min: '30%' }}
        margin={{ horizontal: '10px' }}
      >
        <CardBody margin="small">
          <Heading margin={{ bottom: 'medium' }} level="3">
            Change Password
          </Heading>
          <Form onSubmit={handleSubmit}>
            <FormField
              name="password"
              htmlFor="passwordInput"
              label="Password"
              validate={[validators.required(), validators.minLength(6)]}
            >
              <TextInput id="passwordInput" name="password" type="password" />
            </FormField>
            <FormField
              name="password1"
              htmlFor="password1Input"
              label="Confirm Password"
              validate={[
                validators.required(),
                validators.equalsField('password', 'Password'),
              ]}
            >
              <TextInput id="password1Input" name="password1" type="password" />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button
                hoverIndicator="background"
                primary
                disabled={loading}
                type="submit"
                label="Go!"
              />
            </Box>
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};

export default ResetPassword;
