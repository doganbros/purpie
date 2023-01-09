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
} from 'grommet';
import { useTranslation } from 'react-i18next';
import { Close } from 'grommet-icons';
import { apiURL } from '../../../config/http';

interface AvatarUploadProps {
  onSubmit: any | ((arg0: File) => void);
  onDismiss: () => void;
  src?: string;
  type?: string;
}

const AvatarUpload: FC<AvatarUploadProps> = ({
  onSubmit,
  onDismiss,
  src,
  type,
}) => {
  const [imgSrc, setImgSrc] = useState<string>();
  const { t } = useTranslation();

  return (
    <Layer responsive={false}>
      <Box elevation="peach" round="20px">
        <Box pad="small" justify="between" direction="row">
          <Text size="small">{t('settings.chooseProfilePicture')}</Text>
          <Close color="brand" size="18px" onClick={onDismiss} />
        </Box>

        <Box margin={{ horizontal: 'small', bottom: 'small' }}>
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
              round="20px"
              overflow="hidden"
            >
              {imgSrc ? (
                <Image fit="cover" src={imgSrc} />
              ) : (
                src !== null && (
                  <Image
                    fit="cover"
                    src={`${apiURL}/${type}/display-photo/${src}`}
                  />
                )
              )}
            </Box>

            <FormField name="photoFile" htmlFor="file-input">
              <FileInput
                name="photoFile"
                id="photoFile"
                multiple={false}
                type="file"
                accept="image/jpg,
                        image/jpeg,
                        image/png,
                        image/bmp,
                        image/svg+xml"
                renderFile={(file) => {
                  <Box width="small" height="small">
                    <Text>{file.name}</Text>
                  </Box>;
                }}
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
                label={t('settings.submit')}
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
  );
};

export default AvatarUpload;
