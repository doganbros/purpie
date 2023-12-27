import React, { FC } from 'react';
import { RedocStandalone } from 'redoc';
import { Box } from 'grommet';

const ApiDocs: FC = () => {
  return (
    <Box className="api-docs">
      <RedocStandalone
        specUrl="./openapi.yaml"
        options={{
          hideFab: true,
          nativeScrollbars: true,
          hideDownloadButton: true,
          theme: {
            logo: {
              maxHeight: '160px',
              maxWidth: '160px',
              gutter: '16px',
            },
            typography: { fontFamily: 'Poppins' },
            colors: { primary: { main: '#9060EB' } },
          },
        }}
      />
    </Box>
  );
};
export default ApiDocs;
