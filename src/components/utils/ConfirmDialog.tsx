import { Box, Image, Layer, Text, TextProps } from 'grommet';
import React, { FC } from 'react';
import ConfirmIcon from '../../assets/confirm-icon.svg';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onDismiss: () => void;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  textProps?: TextProps;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  onConfirm,
  onDismiss,
  message = 'Are you sure?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  textProps,
}) => (
  <Layer responsive={false} onClickOutside={onDismiss}>
    <Box pad="medium" gap="medium" width="350px" align="center">
      <Image src={ConfirmIcon} />
      <Text weight="bold" textAlign="center" {...textProps}>
        {message}
      </Text>
      <Box fill="horizontal" direction="row" justify="between" gap="medium">
        <Box
          justify="center"
          align="center"
          flex="grow"
          onClick={() => {
            onConfirm();
            onDismiss();
          }}
          round="small"
          pad="xsmall"
          background="brand"
        >
          <Text color="white">{confirmButtonText}</Text>
        </Box>
        <Box
          justify="center"
          align="center"
          flex="grow"
          onClick={onDismiss}
          round="small"
          pad="xsmall"
          border={{ color: 'brand', size: 'small' }}
        >
          {cancelButtonText}
        </Box>
      </Box>
    </Box>
  </Layer>
);

export default ConfirmDialog;
