import { Box, Button, FormField, Text } from 'grommet';
import React, { useState } from 'react';
import { useResponsive } from '../../../../../hooks/useResponsive';

interface ApiTextProps {
  text: string;
  title: string;
  copyActive: boolean;
}
const ApiText: React.FC<ApiTextProps> = ({ text, title, copyActive }) => {
  const size = useResponsive();

  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <Box gap="small" fill="horizontal">
      <Text size="medium" weight={500}>
        {title}
      </Text>
      <Box fill="horizontal" direction="column" align="start" gap="xxsmall">
        <FormField>
          <Box
            direction="row"
            gap="small"
            pad="small"
            justify="between"
            align="center"
            fill="horizontal"
          >
            <Text
              wordBreak="break-all"
              size="small"
              color="gray"
              style={{ verticalAlign: 'sub' }}
            >
              {text}
            </Text>
            {size !== 'small' && copyActive && (
              <Box width="xsmall" justify="center" align="center">
                <Button
                  onClick={handleCopy}
                  label={isCopied ? 'Copied' : 'Copy'}
                  size="small"
                  primary
                />
              </Box>
            )}
          </Box>
        </FormField>
        {size === 'small' && copyActive && (
          <Button
            onClick={handleCopy}
            label={isCopied ? 'Copied' : 'Copy'}
            size="small"
            primary
          />
        )}
      </Box>
    </Box>
  );
};

export default ApiText;
