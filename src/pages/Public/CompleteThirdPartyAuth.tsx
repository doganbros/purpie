import { Form, FormField, Image, Text, TextInput } from 'grommet';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { completeProfileAction } from '../../store/actions/auth.action';
import Figure from '../../assets/verify-email-bg/figure-2.svg';
import Banner from '../../assets/verify-email-bg/banner.png';
import { userNameExistsCheck } from '../../store/services/auth.service';
import { useDebouncer } from '../../hooks/useDebouncer';
import { theme } from '../../config/app-config';
import { USER_NAME_CONSTRAINT } from '../../helpers/constants';
import { ExistenceResult } from '../../store/types/auth.types';
import AuthFormButton from '../../components/auth/AuthFormButton';

interface Params {
  token: string;
}

const CompleteThirdPartyAuth: FC = () => {
  const dispatch = useDispatch();

  const debouncer = useDebouncer();

  const { token } = useParams<Params>();
  const { t } = useTranslation();

  const [
    existenceResult,
    setExistenceResult,
  ] = useState<ExistenceResult | null>(null);

  const handleSubmit: FormSubmitEvent<{ userName: string }> = ({
    value: { userName },
  }) => {
    dispatch(completeProfileAction({ token, userName }));
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

  return (
    <AuthLayout
      title={t('CompleteThirdPartyAuth.title')}
      formTitle={t('CompleteThirdPartyAuth.title')}
      formSubTitle={t('CompleteThirdPartyAuth.formSubTitle')}
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
            label={t('common.userName')}
            error={
              existenceResult &&
              existenceResult.exists &&
              t('CompleteThirdPartyAuth.userNameNotAvailable', {
                userName: existenceResult.userName,
              })
            }
            info={
              existenceResult &&
              !existenceResult.exists && (
                <Text color="status-ok" size="small">
                  {t('CompleteThirdPartyAuth.userNameAvailable', {
                    userName: existenceResult.userName,
                  })}
                </Text>
              )
            }
            validate={[
              validators.required(t('common.userName')),
              validators.minLength(t('common.userName'), 4),
              validators.maxLength(16),
              validators.matches(
                USER_NAME_CONSTRAINT,
                t('common.invalidUserName')
              ),
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
          <AuthFormButton
            primary
            margin={{ top: '55%' }}
            type="submit"
            label={t('common.continue')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default CompleteThirdPartyAuth;
