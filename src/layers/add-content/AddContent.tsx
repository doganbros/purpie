import React, { FC, useContext } from 'react';
import { Box, Button, Grid, Layer, ResponsiveContext, Text } from 'grommet';
import { Close, Robot, ServicePlay, ShareOption } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AddContentButton from './AddContentButton';
import { openCreateVideoLayerAction } from '../../store/actions/post.action';

interface AddContentProps {
  onDismiss: () => void;
}

const AddContent: FC<AddContentProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);

  const iconProps = {
    size: 'large',
    color: 'white',
  };
  const buttonProps = [
    {
      id: 0,
      icon: <ShareOption {...iconProps} />,
      title: t('AddContent.buttons.upload.title'),
      description: t('AddContent.buttons.upload.description'),
      onClick: () => {
        dispatch(openCreateVideoLayerAction());
        onDismiss();
      },
    },
    {
      id: 1,
      icon: <ServicePlay {...iconProps} />,
      title: t('AddContent.buttons.distribute.title'),
      description: t('AddContent.buttons.distribute.description'),
      soonBanner: true,
      onClick: () => {},
    },
    {
      id: 2,
      icon: <Robot {...iconProps} />,
      title: t('AddContent.buttons.ai.title'),
      description: t('AddContent.buttons.ai.description'),
      soonBanner: true,
      onClick: () => {},
    },
  ];

  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '700px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
      >
        <Box
          direction="row"
          justify="between"
          align="start"
          pad={{ horizontal: 'medium', top: 'medium' }}
        >
          <Box pad="xsmall">
            <Text size="large" weight="bold">
              {t('AddContent.title')}
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <Grid
          height="100%"
          pad="medium"
          columns={size === 'small' ? 'full' : '1/3'}
          gap={{ column: 'medium', row: 'medium' }}
          style={{ overflow: 'auto' }}
        >
          {buttonProps.map(
            ({ id, icon, title, description, soonBanner, onClick }) => (
              <AddContentButton
                key={id}
                icon={icon}
                title={title}
                soonBanner={soonBanner}
                description={description}
                onClick={onClick}
              />
            )
          )}
        </Grid>
      </Box>
    </Layer>
  );
};

export default AddContent;
