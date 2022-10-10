import { Box, Button, Text, Image } from 'grommet';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import EmptyTimeLineImage from '../../../assets/timeline/empty-timeline.svg';

const EmptyTitle = styled(Text)`
  font-family: Poppins;
  font-weight: 600;
  line-height: 30px;
  font-size: 20px;
`;

const EmptyText = styled(Text)`
  font-family: Poppins;
  font-weight: 400;
  line-height: 21px;
  font-size: 14px;
`;

const ButtonText = styled(Text)`
  font-weight: 700;
  font-size: 14px;
  text-align: center;
`;

interface Props {
  onAddContent: () => void;
}

const EmptyFeedContent: FC<Props> = ({ onAddContent }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box margin={{ top: 'xlarge' }} alignSelf="center">
        <Image src={EmptyTimeLineImage} />
      </Box>
      <Box margin={{ top: 'large' }}>
        <EmptyTitle textAlign="center" margin="xxsmall" color="#202631">
          {t('EmptyFeedContent.noContent')}
        </EmptyTitle>
        <EmptyText textAlign="center">
          {t('EmptyFeedContent.noContentDescription')}
        </EmptyText>
      </Box>
      <Box margin="medium" width="fit-content" alignSelf="center">
        <Button
          primary
          size="small"
          margin={{ right: 'small', bottom: 'small' }}
          onClick={onAddContent}
        >
          <Box pad="small">
            <ButtonText textAlign="center">
              {t('EmptyFeedContent.addContent')}
            </ButtonText>
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyFeedContent;
