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
          label="Video Name"
          validate={[validators.required('Video name')]}
        >
          <TextInput
            id="videoName"
            defaultValue={title}
            name="title"
            autoFocus
            plain="full"
            type="text"
            placeholder="Write a video name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>
        <FormField
          name="description"
          htmlFor="videoDescription"
          flex={{ shrink: 0 }}
          label="Video Description"
          validate={[validators.required('Video description')]}
        >
          <TextArea
            id="videoDescription"
            placeholder="Write a video description"
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
              label="Exclusive to contacts"
              value={exclusive}
              onChange={(checked) => setExclusive(checked)}
            />
            <Switch
              label="Public"
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
            label="SAVE"
          />
          <Button
            type="button"
            label="CLOSE"
            onClick={() => setShowSettings(false)}
          />
          <Box align="center" flex={{ shrink: 0 }} margin={{ top: 'medium' }}>
            <Anchor
              onClick={() => setShowDeleteConfirmation(true)}
              label="Delete the Video"
              size="16px"
            />
          </Box>
        </Box>
      </VideoSettingsTheme>
    </Box>
  );
};

export default VideoSettings;
