import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Layer,
  ResponsiveContext,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/reducers/root.reducer';
import { Category } from '../../models/utils';
import { getCategoriesAction } from '../../store/actions/zone.action';

interface CreateZoneProps {
  onDismiss: () => void;
}

const CreateZone: FC<CreateZoneProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const {
    zone: {
      getCategories: { categories },
    },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);
  const [category, setCategory] = useState<Category | undefined>();
  useEffect(() => {
    dispatch(getCategoriesAction());
  }, []);
  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '720px' : undefined}
        height={size !== 'small' ? '505px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large" weight="bold">
              Create Zone
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <Box height="100%">
          <Form
            onSubmit={({ value }) => {
              console.log(value);
            }}
          >
            <Box>
              <Box direction="row" justify="between">
                <FormField name="name" label="Name">
                  <TextInput name="name" />
                </FormField>
                <FormField name="subdomain" label="Subdomain">
                  <TextInput name="subdomain" />
                </FormField>
              </Box>
              <FormField name="description" label="Description">
                <TextInput name="description" />
              </FormField>
              <FormField name="category" label="Category">
                <Select
                  name="category"
                  options={categories || []}
                  labelKey="name"
                  valueKey={{ key: 'id', reduce: true }}
                  valueLabel={
                    <Box pad="small">
                      <Text>{category?.name}</Text>
                    </Box>
                  }
                  onChange={({ option }) => setCategory(option)}
                />
              </FormField>
            </Box>
            <Box
              direction="row"
              gap="medium"
              justify="center"
              margin={{ top: 'medium' }}
            >
              <Button type="submit" primary label="Create" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default CreateZone;
