import React, { FC, useContext, useState } from 'react';
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
import { AppState } from '../../store/reducers/root.reducer';
import { CreateChannelPayload } from '../../store/types/channel.types';
import {
  closeCreateChannelLayerAction,
  createChannelAction,
} from '../../store/actions/channel.action';
import { getZoneCategoriesAction } from '../../store/actions/zone.action';

interface CreateChannelProps {
  onDismiss: () => void;
}

const CreateChannel: FC<CreateChannelProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const {
    zone: {
      getZoneCategories: { categories },
      getUserZones: { userZones },
      selectedUserZone,
    },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);
  const [userZone, setUserZone] = useState<any>(selectedUserZone?.id);
  const [category, setCategory] = useState();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [publicChannel, setPublicChannel] = useState(true);

  const notValid = !name || !description || !topic || !userZone;

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
              Create Channel
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <Form
          onSubmit={({
            value,
          }: FormExtendedEvent<CreateChannelPayload & { zoneId: number }>) => {
            const { zoneId, ...payload } = value;
            dispatch(createChannelAction(zoneId, payload));
            dispatch(closeCreateChannelLayerAction());
          }}
        >
          <Box height="320px" flex={false} overflow="auto">
            <Box height={{ min: 'min-content' }}>
              <FormField required name="name" label="Name">
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                />
              </FormField>
              <FormField required name="topic" label="Topic">
                <TextInput
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  name="topic"
                />
              </FormField>
              <FormField required name="description" label="Description">
                <TextInput
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                />
              </FormField>
              <FormField required name="zoneId" label="Zone">
                <Select
                  name="zoneId"
                  options={
                    userZones?.map((z) => ({
                      name: z.zone.name,
                      cannotCreateChannel: !z.zoneRole.canCreateChannel,
                      id: z.id,
                      zoneId: z.zone.id,
                    })) || []
                  }
                  disabledKey="cannotCreateChannel"
                  labelKey="name"
                  valueKey={{ key: 'id', reduce: true }}
                  value={userZone}
                  placeholder="Select zone"
                  onChange={({ option }) => {
                    setUserZone(option.id);
                    setCategory(undefined);
                    dispatch(getZoneCategoriesAction(option.zoneId));
                  }}
                />
              </FormField>
              <FormField name="categoryId" label="Category">
                <Select
                  options={categories || []}
                  disabled={!userZone}
                  name="categoryId"
                  placeholder="Select category"
                  labelKey="name"
                  valueKey={{ key: 'id', reduce: true }}
                  value={category}
                  onChange={({ value }) => setCategory(value)}
                />
              </FormField>
              <FormField name="public">
                <CheckBox
                  toggle
                  label="Public"
                  name="public"
                  checked={publicChannel}
                  onChange={(e) => {
                    setPublicChannel(e.target.checked);
                  }}
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
            <Button type="submit" disabled={notValid} primary label="Create" />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
};

export default CreateChannel;
