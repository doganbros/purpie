import {
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  TextInput,
  ThemeContext,
} from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { validators } from '../../../helpers/validators';
import { CreateFormTheme } from './custom-theme';

export const CreateFolder: FC = () => {
  const { t } = useTranslation();

  return (
    <ThemeContext.Extend value={CreateFormTheme}>
      <Form
        onSubmit={({ value }: FormExtendedEvent<any>) => {
          console.log(value);
        }}
      >
        <FormField
          name="name"
          validate={[validators.required('Name'), validators.maxLength(32)]}
        >
          <TextInput placeholder="Name*" size="xsmall" name="name" />
        </FormField>

        <FormField
          name="description"
          validate={[
            validators.required('Description'),
            validators.maxLength(32),
          ]}
        >
          <TextInput placeholder="Description*" size="xsmall" name="name" />
        </FormField>

        <Button
          type="submit"
          primary
          label={t('common.create')}
          size="small"
          fill="horizontal"
        />
      </Form>
    </ThemeContext.Extend>
  );
};
