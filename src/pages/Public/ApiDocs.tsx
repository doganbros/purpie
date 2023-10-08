import React, { FC } from 'react';
import { RedocStandalone } from 'redoc';

const ApiDocs: FC = () => {
  return (
    <RedocStandalone
      specUrl="./openapi.yaml"
      options={{
        nativeScrollbars: true,
        hideDownloadButton: true,
        theme: { colors: { primary: { main: '#9060EB' } } },
      }}
    />
  );
};
export default ApiDocs;
