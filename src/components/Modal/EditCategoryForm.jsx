import React, { useEffect } from 'react';
import { Form, Input, Button, Space } from 'antd';

function EditCategoryForm({ category, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ name: category });
  }, [category, form]);

  const onFinish = (values) => {
    onSave(category, values.name);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Category Name"
        name="name"
        rules={[{ required: true, message: 'Please input the category name!' }]}
      >
        <Input />
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

export default EditCategoryForm;
