import React, { useContext } from 'react';
import { Switch } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<BulbOutlined />}
    />
  );
};

export default ThemeToggle;
