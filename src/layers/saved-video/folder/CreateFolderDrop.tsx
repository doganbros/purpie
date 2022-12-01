import { Box, DropButton, Heading } from 'grommet';
import React, { FC, useState } from 'react';
import { CreateFolder } from './CreateFolder';
import ExtendedBox from '../../../components/utils/ExtendedBox';

interface Props {
  dropLabel: React.ReactNode;
}

export const CreateFolderDrop: FC<Props> = ({ dropLabel }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropButton
      plain
      label={dropLabel}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
      dropProps={{ round: 'small', margin: { top: 'small' } }}
      dropAlign={{ top: 'bottom', right: 'right' }}
      dropContent={
        <ExtendedBox
          pad="small"
          background={{ color: 'white' }}
          boxShadow="0px 0px 30px rgba(61, 19, 141, 0.25)"
          minWidth="320px"
          gap="small"
          onClick={(e) => e.stopPropagation()}
        >
          <Box direction="row" justify="between" align="center">
            <Heading color="dark" level={6} margin="none">
              Create New Folder
            </Heading>
          </Box>
          <CreateFolder />
        </ExtendedBox>
      }
    />
  );
};
