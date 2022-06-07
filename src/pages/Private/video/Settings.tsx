import React, { FC, useState } from 'react';
import {
  FormField,
  Anchor,
  CheckBox,
  TextInput,
  TextArea,
  RadioButtonGroup,
  Button,
  Text,
  Box,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { validators } from '../../../helpers/validators';
import { updatePostAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';

interface Props {
  setSettings: any;
  setDeleteConfirmation: any;
}

const Settings: FC<Props> = ({ setSettings, setDeleteConfirmation }) => {
  const dispatch = useDispatch();
  const {
    post: {
      postDetail: { data },
    },
  } = useSelector((state: AppState) => state);

  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [exclusive, setExclusive] = useState(data?.userContactExclusive);
  const [publicVisibility, setPublicVisibility] = useState(data?.public);
  const [value, setValue] = useState('Lorem Ipsum');

  const clickHandle = () => {
    if (data && title && description) {
      dispatch(updatePostAction(data.id, title, description));
      setSettings(false);
    }
  };

  const notValid = !title || !description;

  return (
    <Box pad="medium" style={{ height: '100vh' }}>
      <FormField
        className="form-field"
        name="title"
        flex={{ shrink: 0 }}
        htmlFor="videoName"
        label="Video Name"
        validate={[validators.required()]}
      >
        <TextInput
          id="videoName"
          defaultValue={title}
          name="title"
          autoFocus
          plain="full"
          type="text"
          placeholder="Write a video name"
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormField>
      <FormField
        className="form-field"
        name="description"
        htmlFor="videoDescription"
        flex={{ shrink: 0 }}
        label="Video Description"
        validate={[validators.required()]}
      >
        <TextArea
          id="videoDescription"
          placeholder="Write a video description"
          defaultValue={description}
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>
      <Box className="form-box">
        <Box as="label" flex={{ shrink: 0 }} direction="row" justify="between">
          <Text>Exclusive to contacts</Text>
          <CheckBox
            toggle
            checked={exclusive}
            onChange={(event) => setExclusive(event.target.checked)}
          />
        </Box>
        <Box as="label" flex={{ shrink: 0 }} direction="row" justify="between">
          <Text>Public</Text>
          <CheckBox
            toggle
            checked={publicVisibility}
            onChange={(event) => setPublicVisibility(event.target.checked)}
          />
        </Box>
        <Box className="divider" />
        <RadioButtonGroup
          name="doc"
          options={['Lorem Ipsum', 'Lorem Ipsum 2']}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Box>
      <Box margin={{ vertical: 'auto' }} />
      <Box gap="xsmall" margin={{ top: '20px' }}>
        <Button
          type="submit"
          disabled={notValid}
          onClick={clickHandle}
          primary
          label="SAVE"
        />
        <Button
          type="button"
          label="CLOSE"
          onClick={() => setSettings(false)}
        />
        <Box align="center" flex={{ shrink: 0 }} margin={{ top: 'medium' }}>
          <Anchor
            onClick={() => setDeleteConfirmation(true)}
            label="Delete the Video"
            size="16px"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
