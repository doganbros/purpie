import { Box, Heading } from 'grommet';
import { Add, Close } from 'grommet-icons';
import React, { FC, useState } from 'react';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { CreateFolder } from './CreateFolder';
import { FolderList } from './FolderList';

export const AddToFolderDropContent: FC = () => {
  const [createMode, setCreateMode] = useState(false);

  return (
    <ExtendedBox
      pad="small"
      background={{ color: 'white' }}
      boxShadow="0px 0px 30px rgba(61, 19, 141, 0.25)"
      minWidth="220px"
      gap="small"
      onClick={(e) => e.stopPropagation()}
    >
      <Box direction="row" justify="between" align="center">
        <Heading color="dark" level={6} margin="none">
          {createMode ? 'Create New Folder' : 'Save to This Folder'}
        </Heading>
        <Box onClick={() => setCreateMode((mode) => !mode)}>
          {createMode ? <Close size="18px" /> : <Add size="18px" />}
        </Box>
      </Box>
      {createMode ? (
        <CreateFolder closeDrop={() => setCreateMode(false)} />
      ) : (
        <FolderList />
      )}
    </ExtendedBox>
  );
};
