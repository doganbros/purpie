import {
  Box,
  Button,
  DropButton,
  Form,
  FormField,
  Layer,
  Text,
  TextInput,
} from 'grommet';
import { AddCircle, FormPrevious, ShareOption } from 'grommet-icons';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';
import Divider from '../../../components/utils/Divider';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { validators } from '../../../helpers/validators';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import SocialArray from './SocialArray';

const InviteToPurpie: FC = () => {
  const [mailList, setMailList] = useState(['']);
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    const { email } = value;
    setMailList([...mailList, email]);
  };
  return (
    <Box gap="small">
      <Text color="brand" weight="bold" size="small">
        {' '}
        Invite People to Purpie
      </Text>
      <Box
        round="small"
        border={{ color: 'brand', size: 'small' }}
        justify="center"
        pad="small"
      >
        <DropButton
          label={<Text size="small">Type Email</Text>}
          open={open}
          onClick={() => setOpen(true)}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          plain
          color="status-disabled"
          dropContent={
            <Box
              round="small"
              border={{ color: 'brand', size: 'small' }}
              justify="center"
              pad={{ top: 'small', horizontal: 'small' }}
            >
              <Box direction="row" pad={{ bottom: 'small' }} align="center">
                <FormPrevious onClick={() => setOpen(false)} />
                <Text size="small">Invite People</Text>
              </Box>

              <Form onSubmit={handleSubmit} color="transparent">
                <FormField
                  name="email"
                  htmlFor="emailInput"
                  validate={[validators.email()]}
                >
                  <TextInput
                    id="emailInput"
                    name="email"
                    type="email"
                    focusIndicator={false}
                    placeholder="Type email"
                  />
                </FormField>
              </Form>
              <Box
                direction="row"
                pad={{ bottom: 'small' }}
                gap="small"
                align="center"
              >
                <AddCircle size="34px" color="brand" />
                <Box direction="row" gap="xxsmall">
                  <Text color="brand" textAlign="justify" size="small">
                    Write the email{' '}
                  </Text>
                  <Text size="small">you want to invite</Text>
                </Box>
              </Box>
              {mailList.length > 1 && (
                <Box pad={{ bottom: 'small' }}>
                  <Divider dashed color="light-4" />
                  {mailList.map((mail, id) => {
                    if (id === 0) {
                      return false;
                    }
                    return (
                      <Box
                        key={nanoid()}
                        direction="row"
                        justify="between"
                        pad={{ top: 'small' }}
                      >
                        <Text size="small">{mail}</Text>
                        <Text color="blue" size="small">
                          Invited
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          }
        />
      </Box>
      <Box direction="row" gap="small">
        <ShareOption color="brand" onClick={() => setShow(true)} size="21px" />
        <Box direction="row" gap="xxsmall">
          <Text color="brand" onClick={() => setShow(true)} size="small">
            Share the Link{' '}
          </Text>{' '}
          <Text size="small"> to invite people</Text>
        </Box>
      </Box>
      {show && (
        <Layer
          full={false}
          modal
          position="right"
          margin={{ right: 'small' }}
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <ExtendedBox direction="row" justify="between" pad="medium">
            <SocialArray />
          </ExtendedBox>
          <Box
            direction="row"
            justify="between"
            pad="small"
            align="center"
            gap="small"
          >
            <Text size="small">https://www.purpie.io/invite</Text>

            <Button
              label="COPY"
              plain
              color="brand"
              onClick={() =>
                navigator.clipboard.writeText('https://www.purpie.io/invite')
              }
            >
              <Text size="small"> COPY</Text>
            </Button>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default InviteToPurpie;
