import React, { FC, useState } from 'react';
import { FormField, Anchor, TextInput, TextArea, Button, Box } from 'grommet';
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
      <Box gap="xsmall" style={{ marginTop: 'auto' }}>
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
        <Box align="center" margin={{ top: 'medium' }}>
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
