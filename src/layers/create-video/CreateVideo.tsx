import React, { FC, useContext, useState } from 'react';
import {
  Box,
  Button,
  FileInput,
  Form,
  FormExtendedEvent,
  FormField,
  Layer,
  ResponsiveContext,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../store/reducers/root.reducer';
import { CreateVideoPayload } from '../../store/types/post.types';
import { createVideoAction } from '../../store/actions/post.action';
import Switch from '../../components/utils/Switch';
import PurpieLogoAnimated from '../../assets/purpie-logo/purpie-logo-animated';

interface CreateVideoProps {
  onDismiss: () => void;
}

const CreateVideo: FC<CreateVideoProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    channel: { userChannels },
    post: {
      createVideo: { uploading, error },
    },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);
  const [channelId, setChannelId] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>();
  const [publicVideo, setPublicVideo] = useState(true);
  const [userContactExclusive, setUserContactExclusive] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadProgress = (
    progressEvent: ProgressEvent<XMLHttpRequestUpload>
  ) => {
    if (progressEvent.loaded && progressEvent.total) {
      setUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      );
    }
  };

  const notValid = !title || !videoFile;
  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '720px' : undefined}
        height={size !== 'small' ? '505px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large" weight="bold">
              {t('CreateVideo.title')}
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <Form
          onSubmit={({
            value,
          }: FormExtendedEvent<
            CreateVideoPayload & { videoFile: FileList }
          >) => {
            if (!uploading && !error && uploadStarted) onDismiss();
            else {
              dispatch(
                createVideoAction(
                  { ...value, videoFile: value.videoFile[0] },
                  handleUploadProgress
                )
              );
              setUploadStarted(true);
            }
          }}
        >
          <Box height="320px" flex={false} overflow="auto">
            <Box height={{ min: 'min-content' }}>
              <FormField
                required
                name="title"
                label={t('CreateVideo.videoTitle')}
              >
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                />
              </FormField>
              <FormField name="description" label={t('common.description')}>
                <TextInput
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                />
              </FormField>
              <FormField name="channelId" label={t('common.channel')}>
                <Select
                  name="channelId"
                  options={userChannels.data.map(
                    ({ channel: { id, name } }) => ({
                      id,
                      name,
                    })
                  )}
                  labelKey="name"
                  valueKey={{ key: 'id', reduce: true }}
                  value={channelId}
                  placeholder={t('CreateVideo.selectChannel')}
                  onChange={({ option }) => {
                    setChannelId(option.id);
                    setUserContactExclusive(false);
                  }}
                />
              </FormField>
              <FormField name="userContactExclusive">
                <Switch
                  width="fit-content"
                  direction="row-reverse"
                  label={t('common.exclusiveContacts')}
                  name="userContactExclusive"
                  value={userContactExclusive}
                  onChange={(checked) => {
                    if (checked) {
                      setPublicVideo(false);
                      setChannelId(undefined);
                      setUserContactExclusive(checked);
                    }
                  }}
                />
              </FormField>
              <FormField name="public">
                <Switch
                  width="fit-content"
                  direction="row-reverse"
                  label={t('common.public')}
                  name="public"
                  value={publicVideo}
                  onChange={(checked) => {
                    setPublicVideo(checked);
                    setUserContactExclusive(false);
                  }}
                />
              </FormField>
              <FormField required name="videoFile">
                <FileInput
                  name="videoFile"
                  onChange={(e) =>
                    setVideoFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormField>
            </Box>
          </Box>
          <Box
            direction="row"
            gap="medium"
            justify="center"
            margin={{ top: 'medium' }}
          >
            <Button
              type="submit"
              disabled={notValid || uploading}
              primary
              icon={
                uploading ? (
                  <PurpieLogoAnimated
                    width={100}
                    height={100}
                    color="#956aea"
                  />
                ) : undefined
              }
              label={(() => {
                if (uploading) {
                  return t('CreateVideo.uploading', {
                    progress: uploadProgress,
                  });
                }
                if (!uploading && !error && uploadStarted) {
                  return t('CreateVideo.uploadCompleted');
                }
                return t('common.share');
              })()}
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default CreateVideo;
