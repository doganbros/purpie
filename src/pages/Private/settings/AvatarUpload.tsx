import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  FileInput,
  Form,
  FormField,
  Image,
  Layer,
  Text,
  ThemeContext,
} from 'grommet';
import { useTranslation } from 'react-i18next';
import { Close } from 'grommet-icons';
import { apiURL } from '../../../config/http';
import { theme } from '../../../config/app-config';
import InitialsAvatar from '../../../components/utils/Avatars/InitialsAvatar';

interface AvatarUploadProps {
  onSubmit: any | ((arg0: File) => void);
  onDismiss: () => void;
  src?: string;
  type?: string;
  id?: string;
  name?: string;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  onSubmit,
  onDismiss,
  src,
  type,
  id,
  name,
}) => {
  const [imgSrc, setImgSrc] = useState<string>();
  const { t } = useTranslation();

  const renderAvatar = () => {
    if (src) {
      return (
        <Image fit="cover" src={`${apiURL}/${type}/display-photo/${src}`} />
      );
    }
    return (
      <Box flex="grow" justify="center" align="center">
        <InitialsAvatar
          size="276px"
          id={id || '1'}
          value={name || 'Channel'}
          textProps={{ size: '120px' }}
          roundSize={type === 'zone' ? 'medium' : 'full'}
        />
      </Box>
    );
  };

  return (
    <ThemeContext.Extend
      value={{
        ...theme,
        formField: {
          border: {
            color: 'status-disabled',
          },
          round: true,
        },

        fileInput: {
          border: {
            size: '1px',
            style: 'solid',
          },
          message: {
            size: 'small',
          },
        },
        anchor: {
          extend: {
            fontSize: '14px',
          },
        },
      }}
    >
      <Layer responsive={false}>
        <Box elevation="peach" round="20px">
          <Box pad="small" justify="between" direction="row">
            <Text size="small">{t('settings.chooseProfilePicture')}</Text>
            <Close color="brand" size="18px" onClick={onDismiss} />
          </Box>

          <Box
            margin={{ horizontal: 'small', bottom: 'small' }}
            width={{ min: '276px', max: '276px' }}
          >
            <Form
              onSubmit={({ value }: any) => {
                onSubmit({ photoFile: value.photoFile[0] });
              }}
            >
              <Box
                width={{ min: '276px', max: '276px' }}
                height={{ min: '276px', max: '276px' }}
                alignSelf="center"
                margin={{ bottom: 'small' }}
                round={type === 'zone' ? '20px' : 'full'}
                overflow="hidden"
              >
                {imgSrc ? <Image fit="cover" src={imgSrc} /> : renderAvatar()}
              </Box>

              <FormField name="photoFile" htmlFor="file-input">
                <FileInput
                  messages={{ browse: t('settings.browse') }}
                  name="photoFile"
                  id="photoFile"
                  multiple={false}
                  type="file"
                  accept="image/jpg,
                        image/jpeg,
                        image/png,
                        image/bmp,
                        image/svg+xml"
                  onChange={(file) => {
                    if (file.target.files && file.target.files.length > 0) {
                      const reader = new FileReader();
                      reader.addEventListener('load', () =>
                        setImgSrc(reader?.result?.toString() || '')
                      );
                      reader.readAsDataURL(file.target.files[0]);
                    }
                  }}
                />
              </FormField>

              <Box justify="center" direction="row" gap="small">
                <Button
                  label={<Text size="small">{t('settings.submit')}</Text>}
                  type="submit"
                  primary
                  size="large"
                  fill="horizontal"
                  disabled={!imgSrc}
                />
              </Box>
            </Form>
          </Box>
        </Box>
      </Layer>
    </ThemeContext.Extend>
  );
};

export default AvatarUpload;
