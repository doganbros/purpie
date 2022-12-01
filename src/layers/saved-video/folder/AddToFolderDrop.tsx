import { DropButton } from 'grommet';
import { Bookmark } from 'grommet-icons';
import React, { FC, useState } from 'react';
import { AddToFolderDropContent } from './AddToFolderDropContent';

export const AddToFolderDrop: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropButton
      plain
      label={<Bookmark color="white" />}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      dropProps={{ round: 'small' }}
      dropAlign={{ top: 'bottom' }}
      dropContent={<AddToFolderDropContent />}
    />
  );
};
