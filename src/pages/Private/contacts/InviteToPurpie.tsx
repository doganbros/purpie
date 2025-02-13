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
import { validators } from '../../../helpers/validators';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import SocialMediaIcons from './SocialMediaIcons';

interface InvitationPurpieProps {
  isVisibleDrop: boolean;
  setVisibleDrop: (visible: boolean) => void;
}

const InviteToPurpie: FC<InvitationPurpieProps> = ({
  isVisibleDrop,
  setVisibleDrop,
}) => {
  const [mailList, setMailList] = useState(['']);
  const [show, setShow] = useState(false);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    const { email } = value;
    setMailList([...mailList, email]);
  };
  return (
    <Box gap="small">
      <Text color="brand" weight="bold" size="small">
        {' '}
        Invite People to Pavilion
      </Text>
      <Box
        round="small"
        border={{ color: 'brand', size: 'small' }}
        justify="center"
        pad="small"
      >
        <DropButton
          label={<Text size="small">Type Email</Text>}
          open={isVisibleDrop}
          onClick={() => setVisibleDrop(true)}
          onOpen={() => {
            setVisibleDrop(true);
          }}
          onClose={() => {
            setVisibleDrop(false);
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
                <FormPrevious onClick={() => setVisibleDrop(false)} />
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
          <SocialMediaIcons
            shareUrl="https://app.pavilion.network/invite"
            title="I am inviting you to join Purple."
          />
          <Box
            direction="row"
            justify="between"
            pad="small"
            align="center"
            gap="small"
          >
            <Text size="small">https://app.pavilion.network/invite</Text>

            <Button
              label="COPY"
              plain
              color="brand"
              onClick={() =>
                navigator.clipboard.writeText(
                  'https://app.pavilion.network/invite'
                )
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
