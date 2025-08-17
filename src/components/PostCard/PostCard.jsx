import React from 'react';
import { Card, Button, Space, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, StarOutlined, StarFilled, LinkOutlined, LinkedinOutlined, InstagramOutlined, FacebookOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LINKEDIN_POST_REGEX = /https?:\/\/www\.linkedin\.com\/feed\/update\/urn:li:activity:[0-9]+(\/)?/;
const INSTAGRAM_POST_REGEX = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)(\/)?/;
const FACEBOOK_POST_REGEX = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9\.]+)\/posts\/([0-9]+)(\/)?/;

const getSocialMediaIcon = (url) => {
  if (LINKEDIN_POST_REGEX.test(url)) {
    return <LinkedinOutlined style={{ color: '#0A66C2', fontSize: '20px' }} />;
  } else if (INSTAGRAM_POST_REGEX.test(url)) {
    return <InstagramOutlined style={{ color: '#E4405F', fontSize: '20px' }} />;
  } else if (FACEBOOK_POST_REGEX.test(url)) {
    return <FacebookOutlined style={{ color: '#1877F2', fontSize: '20px' }} />;
  }
  return <LinkOutlined style={{ fontSize: '20px' }} />;
};

function PostCard({ post, onEdit, onDelete, onToggleFavorite }) {
  return (
    <Card
      hoverable
      style={{ width: '100%', marginBottom: '24px' }}
      actions={[
        <Button type="text" icon={post.isFavorite ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />}
          onClick={() => onToggleFavorite(post.id)} />,
        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(post)} />,
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(post.id)} />,
      ]}
    >
      <Card.Meta
        avatar={getSocialMediaIcon(post.url)}
        title={
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            <Text strong>{post.title || post.url}</Text>
          </a>
        }
        description={
          <Space direction="vertical" size={4}>
            <Tag color="blue">{post.category}</Tag>
            <Text type="secondary">{new Date(post.timestamp).toLocaleString()}</Text>
            {post.tags && post.tags.length > 0 && (
              <Space size={[0, 8]} wrap>
                {post.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Space>
            )}
          </Space>
        }
      />
    </Card>
  );
}

export default PostCard;
