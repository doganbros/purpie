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
  TextArea,
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

  const formFieldContentProps = {
    round: 'small',
    border: { color: 'brand-alt' },
  };
  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '710px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large">Create Zone</Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand-alt" />
          </Button>
        </Box>
        <Box height="100%">
          <Form
            onSubmit={({ value }: FormExtendedEvent<CreateZonePayload>) => {
              dispatch(createZoneAction({ ...value, subdomain }));
              dispatch(closeCreateZoneLayerAction());
            }}
          >
            <Box height="262px" flex={false} overflow="auto">
              <Box height={{ min: 'min-content' }}>
                <FormField
                  required
                  name="name"
                  contentProps={formFieldContentProps}
                >
                  <TextInput
                    placeholder="Zone Name"
                    value={name}
                    onChange={({ target: { value } }) => {
                      setName(value);
                      setSubdomain(nameToSubdomain(value));
                    }}
                    name="name"
                  />
                </FormField>
                <FormField
                  required
                  name="subdomain"
                  contentProps={formFieldContentProps}
                >
                  <TextInput
                    placeholder="Zone Address"
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
                <FormField
                  required
                  name="description"
                  contentProps={formFieldContentProps}
                >
                  <TextArea
                    resize={false}
                    placeholder="Zone Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    name="description"
                  />
                </FormField>
                <Box
                  direction="row"
                  justify="between"
                  align="start"
                  gap="small"
                >
                  <FormField
                    width="100%"
                    required
                    name="categoryId"
                    contentProps={formFieldContentProps}
                  >
                    <Select
                      placeholder="Category"
                      name="categoryId"
                      options={categories || []}
                      labelKey="name"
                      valueKey={{ key: 'id', reduce: true }}
                      value={category}
                      onChange={({ option }) => {
                        setCategory(option.id);
                      }}
                    />
                  </FormField>
                  <FormField
                    width="100%"
                    name="public"
                    contentProps={formFieldContentProps}
                  >
                    <Box
                      pad="11px"
                      as="label"
                      flex={{ shrink: 0 }}
                      direction="row"
                      justify="between"
                    >
                      <Text size="small">Public</Text>
                      <CheckBox
                        name="public"
                        toggle
                        checked={publicZone}
                        onChange={(e) => {
                          setPublicZone(e.target.checked);
                        }}
                      />
                    </Box>
                  </FormField>
                </Box>
              </Box>
            </Box>
            <Button
              style={{ borderRadius: '10px' }}
              size="large"
              fill="horizontal"
              margin={{ top: 'medium' }}
              type="submit"
              disabled={notValid}
              primary
              label="Create"
            />
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default CreateZone;
