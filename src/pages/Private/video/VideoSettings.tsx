import React, { FC, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  FormField,
  RadioButtonGroup,
  TextArea,
  TextInput,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { validators } from '../../../helpers/validators';
import { updatePostAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import Divider from '../../../components/utils/Divider';
import VideoSettingsTheme from './video-settings-theme';
import Switch from '../../../components/utils/Switch';

interface VideoSettingsProps {
  setShowSettings: (settings: boolean) => void;
  setShowDeleteConfirmation: (confirmation: boolean) => void;
}

const VideoSettings: FC<VideoSettingsProps> = ({
  setShowSettings,
  setShowDeleteConfirmation,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    post: {
      postDetail: { data },
    },
  } = useSelector((state: AppState) => state);

  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [exclusive, setExclusive] = useState(data?.userContactExclusive);
  const [publicVisibility, setPublicVisibility] = useState(data?.public);
  const [value, setValue] = useState('Lorem Ipsum');

  const onSubmit = () => {
    if (data && title && description) {
      dispatch(updatePostAction(data.id, title, description));
      setShowSettings(false);
    }
  };

  const notValid = !title || !description;

  return (
    <Box pad="medium" height={{ min: '100vh' }}>
      <VideoSettingsTheme>
        <FormField
          name="title"
          htmlFor="videoName"
          label={t('VideoSettings.videoName')}
          validate={[validators.required(t('VideoSettings.videoName'))]}
        >
          <TextInput
            id="videoName"
            defaultValue={title}
            name="title"
            autoFocus
            plain="full"
            type="text"
            placeholder={t('VideoSettings.videoNamePlaceholder')}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>
        <FormField
          name="description"
          htmlFor="videoDescription"
          flex={{ shrink: 0 }}
          label={t('VideoSettings.videoDescription')}
          validate={[validators.required(t('VideoSettings.videoDescription'))]}
        >
          <TextArea
            id="videoDescription"
            placeholder={t('VideoSettings.videoDescriptionPlaceholder')}
            defaultValue={description}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>
        <Box
          border={{ color: 'status-disabled-light' }}
          round="medium"
          pad="medium"
          gap="medium"
        >
          <Box gap="small">
            <Switch
              label={t('common.exclusiveContacts')}
              value={exclusive}
              onChange={(checked) => setExclusive(checked)}
            />
            <Switch
              label={t('common.public')}
              value={publicVisibility}
              onChange={(checked) => setPublicVisibility(checked)}
            />
          </Box>
          <Divider size="1px" />
          <RadioButtonGroup
            name="doc"
            options={['Lorem Ipsum', 'Lorem Ipsum 2']}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Box>
        <Box margin={{ vertical: 'auto' }} />
        <Box gap="xsmall" margin={{ top: '20px' }}>
          <Button
            type="submit"
            disabled={notValid}
            onClick={onSubmit}
            primary
            label={t('common.save')}
          />
          <Button
            type="button"
            label={t('common.close')}
            onClick={() => setShowSettings(false)}
          />
          <Box align="center" flex={{ shrink: 0 }} margin={{ top: 'medium' }}>
            <Anchor
              onClick={() => setShowDeleteConfirmation(true)}
              label={t('VideoSettings.deleteVideo')}
              size="16px"
            />
          </Box>
        </Box>
      </VideoSettingsTheme>
    </Box>
  );
};

export default VideoSettings;
