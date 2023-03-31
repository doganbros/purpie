import React, { FC } from 'react';
import { CheckBox, ThemeContext } from 'grommet';
import { theme } from '../../../config/app-config';

interface PermissionCheckBoxProps {
  checked: boolean;
  handleChange: (checked: boolean) => void;
}

const PermissionCheckBox: FC<PermissionCheckBoxProps> = ({
  checked,
  handleChange,
}) => {
  return (
    <ThemeContext.Extend
      value={{
        checkBox: {
          ...theme.checkBox,
          size: '16px',
        },
      }}
    >
      <CheckBox
        checked={checked}
        onChange={({ target }) => handleChange(target.checked)}
      />
    </ThemeContext.Extend>
  );
};

export default PermissionCheckBox;
