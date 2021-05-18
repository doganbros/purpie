import {
  Button,
  Heading,
  Form,
  FormField,
  TextInput,
  CardBody,
  Card,
  Box,
} from 'grommet';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { forgetPasswordAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';

const ForgotPassword: FC = () => {
  const dispatch = useDispatch();

  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    dispatch(forgetPasswordAction(value.email));
  };

  return (
    <AuthLayout title="Forgot Password">
      <Card
        elevation="xsmall"
        background="light-1"
        overflow="auto"
        width={{ min: '30%' }}
        margin={{ horizontal: '10px' }}
      >
        <CardBody margin="small">
          <Heading margin={{ bottom: 'medium' }} level="3">
            Forget Password
          </Heading>
          <Form onSubmit={handleSubmit}>
            <FormField
              name="email"
              htmlFor="emailInput"
              label="Email"
              validate={[validators.required(), validators.email()]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button
                hoverIndicator="background"
                primary
                fill="horizontal"
                disabled={loading}
                type="submit"
                label="Go!"
              />
            </Box>
            <AnchorLink label="Login" to="/login" />
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;
