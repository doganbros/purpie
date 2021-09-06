import { Button, Form, FormField, TextInput, Image, Text } from 'grommet';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { verifyUserEmailAction } from '../../store/actions/auth.action';
import Figure from '../../assets/forgotten-password-bg/figure-1.png';
import Banner from '../../assets/forgotten-password-bg/banner.png';
import { useResponsive } from '../../hooks/useResponsive';
import { userNameExistsCheck } from '../../store/services/auth.service';
import { useDebouncer } from '../../hooks/useDebouncer';

interface Params {
  token: string;
}

const VerifyUserEmail: FC = () => {
  const dispatch = useDispatch();

  const debouncer = useDebouncer();

  const { token } = useParams<Params>();

  const [existenceResult, setExistenceResult] = useState<{
    userName: string;
    exists: boolean;
  }>();

  const handleSubmit: FormSubmitEvent<{ userName: string }> = ({
    value: { userName },
  }) => {
    dispatch(verifyUserEmailAction({ token, userName }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[a-z0-9_]{1,25}$/.test(value)) {
      debouncer(async () => {
        const result = await userNameExistsCheck(value);

        setExistenceResult(result);
      }, 300);
    }
  };

  const size = useResponsive();

  return (
    <AuthLayout
      title="Email Verification"
      formTitle="Email Verification"
      formSubTitle="Please create a user name to continue email verification process."
      background={
        <>
          <Image
            width="60%"
            src={Banner}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: 0,
              left: 0,
              height: '100vh',
            }}
          />
          <Image
            height="90%"
            alignSelf="center"
            style={{ zIndex: 2 }}
            src={Figure}
          />
        </>
      }
    >
      <>
        <Form onSubmit={handleSubmit} validate="change">
          <FormField
            name="userName"
            htmlFor="userNameInput"
            label="User Name"
            validate={[
              validators.required(),
              validators.matches(/^[a-z0-9_]{1,25}$/, 'User Name is invalid'),
            ]}
          >
            <TextInput
              onChange={handleChange}
              id="userNameInput"
              name="userName"
            />
          </FormField>
          {existenceResult && (
            <Text color={existenceResult.exists ? 'red' : 'green'}>
              {existenceResult.exists
                ? `User Name ${existenceResult.userName} already exists!`
                : `User Name ${existenceResult.userName} can be used!`}
            </Text>
          )}
          <Button
            fill="horizontal"
            primary
            size={size}
            margin={{ top: '55%' }}
            type="submit"
            label="SEND"
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default VerifyUserEmail;
