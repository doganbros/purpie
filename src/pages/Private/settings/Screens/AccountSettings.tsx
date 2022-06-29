import React, { FC, useEffect, useState } from 'react';
import { Box, Text, TextInput } from 'grommet';
import Divider from '../../../../components/utils/Divider';

type FormItemTextsType = {
  [key: string]: {
    id: number;
    title: string;
    description: string;
  };
};

const formItemTexts: FormItemTextsType = {
  username: {
    id: 0,
    title: 'Username',
    description: 'username description',
  },
  fullname: {
    id: 1,
    title: 'fullname',
    description: 'fullname description',
  },
  lastname: {
    id: 2,
    title: 'lastname',
    description: 'lastname description',
  },
};

type Props = {
  searchText: string;
};

const AccountSettings: FC<Props> = ({ searchText }) => {
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);

  const titleCheck = (name: string) =>
    formItemTexts[name].title
      .replace(/ /g, '')
      .toLowerCase()
      .includes(searchText.replace(/ /g, '').toLowerCase());

  const descriptionCheck = (name: string) =>
    formItemTexts[name].description
      .replace(/ /g, '')
      .toLowerCase()
      .includes(searchText.replace(/ /g, '').toLowerCase());

  useEffect(() => {
    if (searchText.length === 0) {
      setVisibleKeys(Object.keys(formItemTexts));
    } else {
      const result = [];
      const keys = Object.keys(formItemTexts);
      for (let i = 0; i < keys.length; i++) {
        const property = keys[i];
        if (titleCheck(property) || descriptionCheck(property))
          result.push(property);
      }
      setVisibleKeys(result);
    }
  }, [searchText]);

  const checkVisibility = (name: string) => {
    return searchText?.length === 0 ? true : visibleKeys.includes(name);
  };

  if (visibleKeys.length === 0 && searchText.length > 0) return <></>;

  return (
    <Box flex="grow" pad={{ horizontal: 'small' }}>
      {searchText.length === 0 && (
        <Box>
          <Text size="xlarge">Account Settings</Text>
        </Box>
      )}
      <Box flex="grow">
        <Box flex="grow" pad={{ vertical: 'small' }}>
          <Text size="large">Account</Text>
          <Box>
            {checkVisibility('username') && (
              <>
                <Box direction="row" flex="grow" justify="between" pad="small">
                  <Box>
                    <Text size="medium">{formItemTexts.username.title}</Text>
                    <Text size="small">{formItemTexts.username.title}</Text>
                  </Box>
                  <Box>
                    <TextInput />
                  </Box>
                </Box>
                <Divider size="1px" />
              </>
            )}
            {checkVisibility('fullname') && (
              <>
                <Box direction="row" flex="grow" justify="between" pad="small">
                  <Box>
                    <Text size="medium">{formItemTexts.fullname.title}</Text>
                    <Text size="small">{formItemTexts.fullname.title}</Text>
                  </Box>
                  <Box>
                    <TextInput />
                  </Box>
                </Box>
                <Divider size="1px" />
              </>
            )}
            {checkVisibility('lastname') && (
              <>
                <Box direction="row" flex="grow" justify="between" pad="small">
                  <Box>
                    <Text size="medium">{formItemTexts.lastname.title}</Text>
                    <Text size="small">{formItemTexts.lastname.title}</Text>
                  </Box>
                  <Box>
                    <TextInput />
                  </Box>
                </Box>
                <Divider size="1px" />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSettings;
