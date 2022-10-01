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
  TextArea,
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

  const formFieldContentProps = {
    round: 'small',
    border: { color: 'brand-alt' },
  };
  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '720px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large">Create Channel</Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand-alt" />
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
          <Box height="262px" flex={false} overflow="auto">
            <Box height={{ min: 'min-content' }}>
              <FormField
                required
                name="name"
                contentProps={formFieldContentProps}
              >
                <TextInput
                  placeholder="Channel Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                />
              </FormField>
              <FormField
                required
                name="topic"
                contentProps={formFieldContentProps}
              >
                <TextInput
                  placeholder="Topics"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  name="topic"
                />
              </FormField>
              <FormField
                required
                name="description"
                contentProps={formFieldContentProps}
              >
                <TextArea
                  resize={false}
                  placeholder="Channel Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                />
              </FormField>
              <FormField
                required
                name="zoneId"
                contentProps={formFieldContentProps}
              >
                <Select
                  name="zoneId"
                  options={
                    userZones
                      ?.filter((z) => !!z.id)
                      .map((z) => ({
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
                  placeholder="Zone"
                  onChange={({ option }) => {
                    setUserZone(option.id);
                    setCategory(undefined);
                    dispatch(getZoneCategoriesAction(option.zoneId));
                  }}
                />
              </FormField>
              <Box direction="row" justify="between" align="start" gap="small">
                <FormField
                  name="categoryId"
                  width="100%"
                  contentProps={formFieldContentProps}
                >
                  <Select
                    options={categories || []}
                    disabled={!userZone}
                    name="categoryId"
                    placeholder="Category"
                    labelKey="name"
                    valueKey={{ key: 'id', reduce: true }}
                    value={category}
                    onChange={({ value }) => setCategory(value)}
                  />
                </FormField>
                <FormField
                  name="public"
                  width="100%"
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
                      toggle
                      name="public"
                      checked={publicChannel}
                      onChange={(e) => {
                        setPublicChannel(e.target.checked);
                      }}
                    />
                  </Box>
                </FormField>
              </Box>
            </Box>
          </Box>

          <Button
            type="submit"
            disabled={notValid}
            primary
            label="Create"
            style={{ borderRadius: '10px' }}
            size="large"
            fill="horizontal"
            margin={{ top: 'medium' }}
          />
        </Form>
      </Box>
    </Layer>
  );
};

export default CreateChannel;
