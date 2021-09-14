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

  const [valid, setValid] = useState(false);

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
            validate="change"
            onValidate={(validationResults) => {
              setValid(validationResults.valid);
            }}
            onSubmit={({ value }: FormExtendedEvent<CreateZonePayload>) => {
              dispatch(createZoneAction(value));
              dispatch(closeCreateZoneLayerAction());
            }}
          >
            <Box height="320px" flex={false} overflow="auto">
              <Box height={{ min: 'min-content' }}>
                <FormField required name="name" label="Name">
                  <TextInput name="name" />
                </FormField>
                <FormField required name="subdomain" label="Subdomain">
                  <TextInput name="subdomain" />
                </FormField>
                <FormField required name="description" label="Description">
                  <TextInput name="description" />
                </FormField>
                <FormField name="public">
                  <CheckBox
                    toggle
                    label="Public"
                    name="public"
                    defaultChecked
                  />
                </FormField>
                <FormField required name="categoryId" label="Category">
                  <Select
                    name="categoryId"
                    options={categories || []}
                    labelKey="name"
                    placeholder="Select category"
                    valueKey={{ key: 'id', reduce: true }}
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
              <Button type="submit" disabled={!valid} primary label="Create" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default CreateZone;
