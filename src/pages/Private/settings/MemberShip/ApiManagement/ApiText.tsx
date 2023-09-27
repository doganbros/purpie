import { Box, Text } from 'grommet';
import { Copy } from 'grommet-icons';
import React from 'react';

interface ApiTextProps {
  text: string;
  title: string;
}
const ApiText: React.FC<ApiTextProps> = ({ text, title }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box>
      <Text size="small">{title}</Text>
      <Box
        border={{ color: 'brand', size: 'xsmall' }}
        round="small"
        direction="row"
        gap="small"
        pad="small"
        justify="between"
        align="center"
      >
        <Text wordBreak="break-all" size="small">
          {text}
        </Text>
        <Box style={{ cursor: 'pointer' }}>
          <Copy onClick={handleCopy} />
        </Box>
      </Box>
    </Box>
  );
};

export default ApiText;