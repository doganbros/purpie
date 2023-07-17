import { Anchor, Box } from 'grommet';
import React from 'react';

const Payment: React.FC = () => {
  return (
    <Box>
      <Anchor href="https://buy.stripe.com/test_7sI9DKcmR2H0fRK5kk">
        Test Payment
      </Anchor>
    </Box>
  );
};

export default Payment;
