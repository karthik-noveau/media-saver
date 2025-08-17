import React from 'react';
import { Layout, Button, Input, Space, Typography } from 'antd';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const { Header } = Layout;
const { Title } = Typography;

function Navbar({ searchTerm, setSearchTerm, onExport, onImportClick, onCreatePost, toggleSidebar }) {
  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--color-background-alt)',
        borderBottom: '1px solid var(--color-border)',
        height: 64, // Ant Design default header height
      }}
    >
      <Button type="text" onClick={toggleSidebar} style={{ fontSize: '20px', color: 'var(--color-text)' }}>
        ☰
      </Button>
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Title level={3} style={{ margin: 0, color: 'var(--color-text)' }}>
          LinkSaver
        </Title>
        <Input.Search
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>
      <Space size="middle">
        <Button type="primary" onClick={onCreatePost}>Create Post</Button>
        <Button onClick={onImportClick}>Import</Button>
        <Button onClick={onExport}>Export</Button>
        <ThemeToggle />
      </Space>
    </Header>
  );
}

export default Navbar;
