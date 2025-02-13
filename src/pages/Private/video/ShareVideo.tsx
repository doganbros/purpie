import React, { FC } from 'react';
import { ShareOption } from 'grommet-icons';
import { Box, DropButton, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import SocialMediaIcons from '../contacts/SocialMediaIcons';

const ShareVideo: FC = () => {
  const { t } = useTranslation();

  const dropButtonLabel = (
    <Box direction="row" gap="xsmall" align="center">
      <ShareOption color="status-disabled" size="19px" />
      <Text color="status-disabled">{t('common.share')}</Text>
    </Box>
  );

  return (
    <DropButton
      plain
      dropAlign={{ top: 'bottom' }}
      dropProps={{ margin: { top: 'xsmall' }, round: 'small' }}
      label={dropButtonLabel}
      dropContent={
        <ExtendedBox
          background={{ color: 'white' }}
          width="240px"
          boxShadow="0px 0px 30px rgba(61, 19, 141, 0.25);"
          gap="small"
          onClick={(e) => e.stopPropagation()}
        >
          <SocialMediaIcons
            iconSize={32}
            title="I am inviting you to watch this video on Pavilion."
            shareUrl={window.location.href}
          />
        </ExtendedBox>
      }
    />
  );
};

export default ShareVideo;
