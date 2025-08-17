import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';

const { Option } = Select;

function AddPostForm({ post, categories, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        url: post.url,
        title: post.title,
        category: post.category,
        tags: post.tags ? post.tags.join(', ') : '',
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ category: categories[0] }); // Set default category for new post
    }
  }, [post, form, categories]);

  const onFinish = (values) => {
    const parsedTags = values.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    console.log('AddPostForm: Submitting with', { ...values, parsedTags });
    if (post) {
      onSave(post.id, values.url, values.category, values.title, parsedTags);
    } else {
      onSave(values.url, values.category, values.title, parsedTags);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Post URL"
        name="url"
        rules={[{ required: true, message: 'Please input the post URL!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Title"
        name="title"
      >
        <Input placeholder="Optional" />
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select placeholder="Select a category">
          {categories.map(cat => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Tags (comma-separated)"
        name="tags"
      >
        <Input placeholder="e.g., react, javascript, webdev" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AddPostForm;
