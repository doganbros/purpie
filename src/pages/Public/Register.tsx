import React, { FC } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Form,
  FormField,
  TextInput,
  Card,
  CardBody,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { RegisterPayload } from '../../store/types/auth.types';
import { registerAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { validators } from '../../helpers/validators';

const Register: FC = () => {
  const dispatch = useDispatch();

  const {
    register: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<RegisterPayload> = ({ value }) => {
    dispatch(registerAction(value));
  };

  return (
    <AuthLayout title="Register">
      <Card
        elevation="xsmall"
        background="light-1"
        overflow="auto"
        width={{ min: '30%' }}
        margin={{ horizontal: '10px' }}
      >
        <CardBody margin="small">
          <Heading margin={{ bottom: 'medium' }} level="3">
            Create Account
          </Heading>

          <Form onSubmit={handleSubmit}>
            <FormField
              label="First Name"
              name="firstName"
              htmlFor="firstNameInput"
              validate={validators.required()}
            >
              <TextInput id="firstNameInput" name="firstName" />
            </FormField>
            <FormField
              label="Last Name"
              name="lastName"
              htmlFor="lastNameInput"
              validate={validators.required()}
            >
              <TextInput id="lastNameInput" name="lastName" />
            </FormField>

            <FormField
              name="email"
              htmlFor="emailInput"
              label="Email"
              validate={[validators.required(), validators.email()]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>

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
                fill="horizontal"
                disabled={loading}
                type="submit"
                label="Go!"
              />
            </Box>
            <Box direction="row" alignSelf="center" gap="xsmall">
              <Text>Already have an account?</Text>
              <AnchorLink to="/login" label="Sign in" />
            </Box>
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};

export default Register;
