import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { PostProvider } from './contexts/PostContext'
import { ConfigProvider, theme as antdTheme } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design CSS
import React, { useContext } from 'react'

const lightTheme = {
  token: {
    colorPrimary: '#4A90E2', // A more refined blue
    colorInfo: '#4A90E2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4d',
    colorTextBase: '#333333', // Darker text for better contrast
    colorBgContainer: '#FFFFFF', // Pure white for cards, modals etc.
    colorBgLayout: '#F8F9FA', // Very light gray for overall layout background
    colorBorder: '#E0E0E0', // Lighter border
    borderRadius: 8, // Standardized border radius
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // Default shadow for elevated elements
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.05)', // Lighter shadow for subtle elevation
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#FFFFFF',
      bodyBg: '#F8F9FA',
    },
    Card: {
      boxShadow: 'var(--ant-box-shadow)', // Use token shadow
      borderRadius: 8,
    },
    Button: {
      borderRadius: 6,
      controlHeight: 36, // Standard button height
    },
    Input: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Modal: {
      borderRadius: 12, // Slightly more rounded for modals
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // More pronounced shadow for modals
    },
  },
};

const darkTheme = {
  token: {
    colorPrimary: '#4A90E2',
    colorInfo: '#4A90E2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4d',
    colorTextBase: '#E0E0E0', // Lighter text for dark mode
    colorBgContainer: '#2C3E50', // Dark background for cards, modals etc.
    colorBgLayout: '#212B36', // Even darker overall layout background
    colorBorder: '#4A4A4A', // Darker border
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  components: {
    Layout: {
      headerBg: '#2C3E50',
      siderBg: '#2C3E50',
      bodyBg: '#212B36',
    },
    Card: {
      boxShadow: 'var(--ant-box-shadow)',
      borderRadius: 8,
    },
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Modal: {
      borderRadius: 12,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    },
  },
};

const AppWithTheme = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? { ...darkTheme, algorithm: antdTheme.darkAlgorithm } : { ...lightTheme, algorithm: antdTheme.defaultAlgorithm };

  return (
    <ConfigProvider theme={currentTheme}>
      <App />
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PostProvider>
        <AppWithTheme />
      </PostProvider>
    </ThemeProvider>
  </StrictMode>,
)
