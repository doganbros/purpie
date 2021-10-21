import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormExtendedEvent,
  FormField,
  Layer,
  ResponsiveContext,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeCreateZoneLayerAction,
  createZoneAction,
  getCategoriesAction,
} from '../../store/actions/zone.action';
import { AppState } from '../../store/reducers/root.reducer';
import { CreateZonePayload } from '../../store/types/zone.types';
import { nameToSubdomain } from '../../helpers/utils';
import { hostname } from '../../helpers/app-subdomain';

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

  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainInputFocus, setSubdomainInputFocus] = useState(false);
  const [description, setDescription] = useState('');
  const [publicZone, setPublicZone] = useState(true);
  const [category, setCategory] = useState();

  const notValid = !name || !description || !subdomain || !category;

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
            onSubmit={({ value }: FormExtendedEvent<CreateZonePayload>) => {
              dispatch(createZoneAction({ ...value, subdomain }));
              dispatch(closeCreateZoneLayerAction());
            }}
          >
            <Box height="320px" flex={false} overflow="auto">
              <Box height={{ min: 'min-content' }}>
                <FormField required name="name" label="Name">
                  <TextInput
                    value={name}
                    onChange={({ target: { value } }) => {
                      setName(value);
                      setSubdomain(nameToSubdomain(value));
                    }}
                    name="name"
                  />
                </FormField>
                <FormField required name="subdomain" label="Zone Address">
                  <TextInput
                    value={
                      subdomainInputFocus || !subdomain
                        ? subdomain
                        : `${subdomain}.${hostname}`
                    }
                    onChange={(e) => {
                      setSubdomain(e.target.value);
                    }}
                    onFocus={() => setSubdomainInputFocus(true)}
                    onBlur={() => setSubdomainInputFocus(false)}
                    name="subdomain"
                  />
                </FormField>
                <FormField required name="description" label="Description">
                  <TextInput
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    name="description"
                  />
                </FormField>
                <FormField required name="categoryId" label="Category">
                  <Select
                    name="categoryId"
                    options={categories || []}
                    labelKey="name"
                    placeholder="Select category"
                    valueKey={{ key: 'id', reduce: true }}
                    value={category}
                    onChange={({ option }) => {
                      setCategory(option.id);
                    }}
                  />
                </FormField>
                <FormField name="public">
                  <CheckBox
                    toggle
                    checked={publicZone}
                    onChange={(e) => {
                      setPublicZone(e.target.checked);
                    }}
                    label="Public"
                    name="public"
                  />
                </FormField>
              </Box>
            </Box>
            <Box
              direction="row"
              gap="medium"
              justify="center"
              margin={{ top: 'medium' }}
            >
              <Button
                type="submit"
                disabled={notValid}
                primary
                label="Create"
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default CreateZone;
