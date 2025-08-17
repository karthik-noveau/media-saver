import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, StarOutlined, FolderOutlined } from '@ant-design/icons';

const { Footer } = Layout;

function BottomNavigationBar({
  selectedCategory,
  onSelectCategory,
  categories,
}) {
  const menuItems = [
    {
      key: null,
      icon: <HomeOutlined />,
      label: 'All Posts',
      onClick: () => onSelectCategory(null),
    },
    {
      key: 'favorites',
      icon: <StarOutlined />,
      label: 'Favorites',
      onClick: () => onSelectCategory('favorites'),
    },
    {
      key: 'categories',
      icon: <FolderOutlined />,
      label: 'Categories',
      children: categories.map((category) => ({
        key: category,
        label: category,
        onClick: () => onSelectCategory(category),
      })),
    },
  ];

  return (
    <Footer
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        padding: '0 16px',
        background: 'var(--color-background-alt)',
        borderTop: '1px solid var(--color-border)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Menu
        mode="horizontal"
        selectedKeys={[selectedCategory]}
        items={menuItems}
        style={{ flex: 1, justifyContent: 'space-around', borderBottom: 'none', background: 'transparent' }}
      />
    </Footer>
  );
}

export default BottomNavigationBar;
