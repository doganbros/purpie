import { Box, Button, Layer, Text } from 'grommet';
import React, { FC } from 'react';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onDismiss: () => void;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  onConfirm,
  onDismiss,
  message = 'Are you sure?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => (
  <Layer responsive={false} onClickOutside={onDismiss}>
    <Box pad="large" gap="medium" width="350px">
      <Text weight="bold">{message}</Text>
      <Box fill="horizontal" direction="row" justify="between">
        <Button
          primary
          color="status-error"
          onClick={() => {
            onConfirm();
            onDismiss();
          }}
          label={confirmButtonText}
        />
        <Button
          primary
          color="brand"
          onClick={onDismiss}
          label={cancelButtonText}
        />
      </Box>
    </Box>
  </Layer>
);

export default ConfirmDialog;
