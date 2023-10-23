import React, { FC } from 'react';
import { CheckBox, ThemeContext } from 'grommet';
import { theme } from '../../../config/app-config';

interface PermissionCheckBoxProps {
  disabled: boolean;
  checked: boolean;
  handleChange: (checked: boolean) => void;
}

const PermissionCheckBox: FC<PermissionCheckBoxProps> = ({
  checked,
  handleChange,
  disabled,
}) => {
  return (
    <ThemeContext.Extend
      value={{
        checkBox: {
          ...theme.checkBox,
          size: '24px',
        },
      }}
    >
      <CheckBox
        disabled={disabled}
        checked={checked}
        onChange={({ target }) => handleChange(target.checked)}
      />
    </ThemeContext.Extend>
  );
};

export default PermissionCheckBox;
