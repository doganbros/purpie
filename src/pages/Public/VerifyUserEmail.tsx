import { Button, Form, FormField, TextInput, Image, Text } from 'grommet';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { verifyUserEmailAction } from '../../store/actions/auth.action';
import Figure from '../../assets/verify-email-bg/figure-2.svg';
import Banner from '../../assets/verify-email-bg/banner.png';
import { useResponsive } from '../../hooks/useResponsive';
import { userNameExistsCheck } from '../../store/services/auth.service';
import { useDebouncer } from '../../hooks/useDebouncer';
import { theme } from '../../config/app-config';
import { USER_NAME_CONSTRAINT } from '../../helpers/constants';
import { ExistenceResult } from '../../store/types/auth.types';

interface Params {
  token: string;
}

const VerifyUserEmail: FC = () => {
  const dispatch = useDispatch();

  const debouncer = useDebouncer();

  const { token } = useParams<Params>();

  const [
    existenceResult,
    setExistenceResult,
  ] = useState<ExistenceResult | null>(null);

  const handleSubmit: FormSubmitEvent<{ userName: string }> = ({
    value: { userName },
  }) => {
    dispatch(verifyUserEmailAction({ token, userName }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (USER_NAME_CONSTRAINT.test(value)) {
      debouncer(async () => {
        const result = await userNameExistsCheck(value);

        setExistenceResult(result);
      }, 300);
    } else {
      setExistenceResult(null);
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
            error={
              existenceResult &&
              existenceResult.exists &&
              `User Name ${existenceResult.userName} already exists!`
            }
            info={
              existenceResult &&
              !existenceResult.exists && (
                <Text color="status-ok" size="small">
                  User Name {existenceResult.userName} can be used!
                </Text>
              )
            }
            validate={[
              validators.required('User name'),
              validators.matches(USER_NAME_CONSTRAINT, 'User Name is invalid'),
            ]}
            contentProps={
              existenceResult && !existenceResult.exists
                ? {
                    background: {
                      color: `${theme.global?.colors?.[
                        'status-ok'
                      ]?.toString()}1A`,
                    },
                    border: { color: 'status-ok' },
                  }
                : undefined
            }
          >
            <TextInput
              onChange={handleChange}
              id="userNameInput"
              name="userName"
            />
          </FormField>
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
