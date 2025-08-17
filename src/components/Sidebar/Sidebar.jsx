import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onSelectCategory,
  selectedCategory,
  isSidebarOpen,
  onToggleSidebar
}) {
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const handleAddCategoryClick = () => {
    if (newCategoryInput.trim() !== '') {
      onAddCategory(newCategoryInput.trim());
      setNewCategoryInput('');
    }
  };

  const menuItems = [
    {
      key: null,
      label: 'All Posts',
      onClick: () => onSelectCategory(null),
    },
    {
      key: 'favorites',
      label: 'Favorites',
      onClick: () => onSelectCategory('favorites'),
    },
    {
      type: 'group',
      label: 'Categories',
      children: categories.map((category) => ({
        key: category,
        label: (
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>{category}</span>
            <Space size="small">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category);
                }}
              />
            </Space>
          </Space>
        ),
        onClick: () => onSelectCategory(category),
      })),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={!isSidebarOpen}
      onCollapse={onToggleSidebar}
      width={280}
      style={{
        background: 'var(--color-background-alt)',
        borderRight: '1px solid var(--color-border)',
        height: 'calc(100vh - 64px)', // Adjust based on AntD Navbar height
        overflow: 'auto',
      }}
    >
      <div style={{ padding: '16px' }}>
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 40px)' }}
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            placeholder="New Category"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategoryClick} />
        </Input.Group>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedCategory]}
        items={menuItems}
        style={{ background: 'var(--color-background-alt)' }}
      />
    </Sider>
  );
}

export default Sidebar;
