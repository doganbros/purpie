import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
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
import {
  nameToSubdomain,
  sanitizeTurkishCharacters,
} from '../../helpers/utils';
import { hostname } from '../../helpers/app-subdomain';
import { validators } from '../../helpers/validators';
import Switch from '../../components/utils/Switch';

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

  const [subdomain, setSubdomain] = useState('');
  const [subdomainInputFocus, setSubdomainInputFocus] = useState(false);

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
                  name="name"
                  contentProps={formFieldContentProps}
                  validate={[validators.required('Zone name')]}
                >
                  <TextInput
                    placeholder="Zone Name"
                    name="name"
                    onChange={({ target: { value } }) => {
                      setSubdomain(nameToSubdomain(value));
                    }}
                  />
                </FormField>
                <FormField
                  name="subdomain"
                  contentProps={formFieldContentProps}
                  validate={[validators.required('Zone address')]}
                >
                  <TextInput
                    name="subdomain"
                    placeholder="Zone Address"
                    value={
                      subdomainInputFocus || !subdomain
                        ? subdomain
                        : `${subdomain}.${hostname}`
                    }
                    onChange={(e) => {
                      setSubdomain(sanitizeTurkishCharacters(e.target.value));
                    }}
                    onFocus={() => setSubdomainInputFocus(true)}
                    onBlur={() => setSubdomainInputFocus(false)}
                  />
                </FormField>
                <FormField
                  name="description"
                  contentProps={formFieldContentProps}
                >
                  <TextArea
                    resize={false}
                    placeholder="Zone Description"
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
                    name="categoryId"
                    contentProps={formFieldContentProps}
                    validate={[validators.required('Category')]}
                  >
                    <Select
                      placeholder="Category"
                      name="categoryId"
                      options={categories || []}
                      labelKey="name"
                      valueKey={{ key: 'id', reduce: true }}
                    />
                  </FormField>
                  <FormField
                    width="100%"
                    name="public"
                    contentProps={formFieldContentProps}
                  >
                    <Switch label="Public" name="public" />
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
