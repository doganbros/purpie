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
import { useDispatch } from 'react-redux';
import { validators } from '../../../helpers/validators';
import { CreateFormTheme } from './custom-theme';
import { createFolderAction } from '../../../store/actions/folder.action';
import { CreateFolderPayload } from '../../../store/types/folder.types';

interface CreateFolderProps {
  closeDrop: () => void;
}

export const CreateFolder: FC<CreateFolderProps> = ({ closeDrop }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <ThemeContext.Extend value={CreateFormTheme}>
      <Form
        onSubmit={({
          value: { title },
        }: FormExtendedEvent<CreateFolderPayload>) => {
          dispatch(createFolderAction({ title }));
          closeDrop();
        }}
      >
        <FormField
          name="title"
          validate={[validators.required('Name'), validators.maxLength(32)]}
        >
          <TextInput placeholder="Name*" size="xsmall" name="title" />
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
