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

interface AvatarUploadProps {
  // onSubmit: (arg0: File) => void;
  onSubmit: any | ((arg0: File) => void);
  onDismiss: () => void;
}

const AvatarUpload: FC<AvatarUploadProps> = ({ onSubmit, onDismiss }) => {
  const [imgSrc, setImgSrc] = useState<string>();
  const { t } = useTranslation();

  return (
    <Layer>
      <Box
        width="medium"
        height="medium"
        pad="large"
        margin="small"
        justify="between"
        align="center"
        gap="small"
      >
        <Form
          onSubmit={({ value }: any) => {
            onSubmit({ photoFile: value.photoFile[0] });
          }}
        >
          <Box
            width="medium"
            height="small"
            alignSelf="center"
            justify="center"
          >
            {imgSrc && <Image fit="contain" src={imgSrc} />}
          </Box>
          <FormField name="photoFile" htmlFor="file-input">
            <FileInput
              name="photoFile"
              id="photoFile"
              multiple={false}
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
              label={t('settings.cancel')}
              style={{ borderRadius: '10px' }}
              size="large"
              fill="horizontal"
              margin={{ top: 'medium' }}
              onClick={onDismiss}
            />
            <Button
              label={t('settings.submit')}
              type="submit"
              primary
              style={{ borderRadius: '10px' }}
              size="large"
              fill="horizontal"
              margin={{ top: 'medium' }}
            />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default AvatarUpload;
