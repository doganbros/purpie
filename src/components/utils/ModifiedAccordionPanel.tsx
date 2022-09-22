import { AccordionPanel, AccordionPanelExtendedProps, Grommet } from 'grommet';
import { CaretDownFill, CaretRightFill } from 'grommet-icons';
import React, { FC } from 'react';
import { theme } from '../../config/app-config';

interface Props extends AccordionPanelExtendedProps {
  label: string;
  transparent: boolean;
  innerRef?: React.LegacyRef<HTMLDivElement>;
}

const ModifiedAccordionPanel: FC<Props> = ({
  innerRef,
  transparent,
  ...props
}) => {
  return (
    <Grommet
      theme={{
        ...theme,
        accordion: {
          icons: {
            collapse: () => <CaretDownFill color="brand" />,
            expand: () => <CaretRightFill color="brand" />,
          },
          border: {
            color: transparent ? 'transparent' : '#E4E9F2',
          },
        },
      }}
    >
      <AccordionPanel ref={innerRef} {...props} />
    </Grommet>
  );
};

export default ModifiedAccordionPanel;
