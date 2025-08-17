import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Layout, Grid, Empty, Typography, FloatButton } from 'antd';
import { PlusOutlined, HomeOutlined, StarOutlined, FolderOutlined } from '@ant-design/icons';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import PostCard from './components/PostCard/PostCard';
import CustomModal from './components/Modal/Modal'; // Renamed to avoid conflict with AntD Modal
import AddPostForm from './components/Modal/AddPostForm';
import EditCategoryForm from './components/Modal/EditCategoryForm';
import { PostContext } from './contexts/PostContext';
import BottomNavigationBar from './components/BottomNavigationBar/BottomNavigationBar';

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const LINKEDIN_POST_REGEX = /https?:\/\/www\.linkedin\.com\/feed\/update\/urn:li:activity:[0-9]+(\/)?/;
const INSTAGRAM_POST_REGEX = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)(\/)?/;
const FACEBOOK_POST_REGEX = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9\.]+)\/posts\/([0-9]+)(\/)?/;

function App() {
  const { state, dispatch } = useContext(PostContext);
  const { posts, categories, uiState } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  const importInputRef = useRef(null);
  const screens = useBreakpoint();

  // Initialize sidebar state based on window width
  useEffect(() => {
    dispatch({ type: 'SET_UI_STATE', payload: { isSidebarOpen: screens.lg || false } });
  }, [screens.lg, dispatch]);

  const handleAddCategory = (newCategoryName) => {
    if (newCategoryName.trim() !== '') {
      dispatch({ type: 'ADD_CATEGORY', payload: newCategoryName.trim() });
    }
  };

  const handleUpdateCategory = (oldCategory, newCategory) => {
    dispatch({ type: 'EDIT_CATEGORY', payload: { oldCategory, newCategory } });
    closeModal();
  };

  const handleDeleteCategory = (categoryToDelete) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: categoryToDelete });
  };

  const handleSavePost = (url, category, title, tags = []) => {
    console.log('App.jsx: handleSavePost called with', { url, category, title, tags });
    const newPost = { id: Date.now(), url, category, title: title || url, timestamp: new Date().toISOString(), isFavorite: false, tags };
    console.log('App.jsx: Dispatching ADD_POST with payload', newPost);
    dispatch({ type: 'ADD_POST', payload: newPost });
    closeModal();
  };

  const handleUpdatePost = (id, url, category, title, tags = []) => {
    console.log('App.jsx: handleUpdatePost called with', { id, url, category, title, tags });
    const updatedPost = { id, url, category, title, tags };
    console.log('App.jsx: Dispatching EDIT_POST with payload', updatedPost);
    dispatch({ type: 'EDIT_POST', payload: updatedPost });
    closeModal();
  };

  const handleDeletePost = (id) => {
    dispatch({ type: 'DELETE_POST', payload: id });
  };

  const handleToggleFavorite = (id) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  const openModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  const processClipboardText = useCallback(async (text) => {
    console.log('Processing clipboard text:', text);
    const isLinkedIn = LINKEDIN_POST_REGEX.test(text);
    const isInstagram = INSTAGRAM_POST_REGEX.test(text);
    const isFacebook = FACEBOOK_POST_REGEX.test(text);
    console.log('Regex results: LinkedIn -', isLinkedIn, ', Instagram -', isInstagram, ', Facebook -', isFacebook);

    if (isLinkedIn || isInstagram || isFacebook) {
      console.log('Social media link detected.');
      if (!posts.find(post => post.url === text)) {
        console.log('Opening add-post modal with URL:', text);
        openModal('add-post', { url: text });
      } else {
        console.log('Post with this URL already exists.');
      }
    } else {
      console.log('Not a recognized social media link.');
    }
  }, [posts, openModal]);

  useEffect(() => {
    console.log('Setting up clipboard event listeners.');
    const handleFocus = () => {
      console.log('Window focused, attempting to read clipboard.');
      navigator.clipboard.readText().then(processClipboardText).catch(err => console.error('Failed to read clipboard on focus:', err));
    };
    const handlePaste = (event) => {
      console.log('Paste event detected.');
      const text = event.clipboardData.getData('text');
      console.log('Pasted text:', text);
      processClipboardText(text);
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('paste', handlePaste);
    return () => {
      console.log('Cleaning up clipboard event listeners.');
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('paste', handlePaste);
    };
  }, [processClipboardText]);

  const handleExport = useCallback(() => {
    const stateToSave = { posts, categories, uiState };
    const blob = new Blob([JSON.stringify(stateToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linksaver_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [posts, categories, uiState]);

  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result);
          if (importedState.posts && importedState.categories) {
            dispatch({ type: 'LOAD_STATE', payload: importedState });
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (posts.length > 0) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
        return ''; // Required for other browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [posts]);

  const filteredPosts = posts
    .filter(post => {
      if (selectedCategory === 'favorites') {
        return post.isFavorite;
      }
      return selectedCategory ? post.category === selectedCategory : true;
    })
    .filter(post => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesUrl = post.url && post.url.toLowerCase().includes(searchTermLower);
      const matchesTitle = post.title && post.title.toLowerCase().includes(searchTermLower);
      const matchesCategory = post.category && post.category.toLowerCase().includes(searchTermLower);
      const matchesTags = post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTermLower));

      return matchesUrl || matchesTitle || matchesCategory || matchesTags;
    });

  const renderModalContent = () => {
    switch (modal.type) {
      case 'add-post':
        return <AddPostForm post={modal.data} categories={categories} onSave={handleSavePost} onCancel={closeModal} />;
      case 'edit-post':
        return <AddPostForm post={modal.data} categories={categories} onSave={handleUpdatePost} onCancel={closeModal} />;
      case 'edit-category':
        return <EditCategoryForm category={modal.data} onSave={handleUpdateCategory} onCancel={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExport={handleExport}
        onImportClick={() => importInputRef.current.click()}
        onCreatePost={() => openModal('add-post')}
        toggleSidebar={() => dispatch({ type: 'SET_UI_STATE', payload: { isSidebarOpen: !uiState.isSidebarOpen } })}
      />
      <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} ref={importInputRef} />
      <Layout>
        {screens.lg && (
          <Sidebar
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={(cat) => openModal('edit-category', cat)}
            onDeleteCategory={handleDeleteCategory}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            isSidebarOpen={uiState.isSidebarOpen}
            onToggleSidebar={() => dispatch({ type: 'SET_UI_STATE', payload: { isSidebarOpen: !uiState.isSidebarOpen } })}
          />
        )}
        {!screens.lg && uiState.isSidebarOpen && (
          <Sidebar
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={(cat) => openModal('edit-category', cat)}
            onDeleteCategory={handleDeleteCategory}
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            isSidebarOpen={uiState.isSidebarOpen}
            onToggleSidebar={() => dispatch({ type: 'SET_UI_STATE', payload: { isSidebarOpen: !uiState.isSidebarOpen } })}
          />
        )}
        {!screens.lg && uiState.isSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => dispatch({ type: 'SET_UI_STATE', payload: { isSidebarOpen: false } })}
          ></div>
        )}
        <Content style={{ padding: '24px', background: 'var(--color-background)' }}>
          {posts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={(p) => openModal('edit-post', p)}
                  onDelete={handleDeletePost}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ color: 'var(--color-text-light)' }}>
                  <Title level={3} style={{ color: 'inherit' }}>No posts yet!</Title>
                  <Text style={{ color: 'inherit' }}>Save your first post, or import your data.</Text>
                </div>
              }
              style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            />
          )}
        </Content>
      </Layout>
      {modal.isOpen && (
        <CustomModal
          title={
            modal.type === 'add-post' ? 'Save New Post' :
            modal.type === 'edit-post' ? 'Edit Post' : 'Edit Category'
          }
          onClose={closeModal}
        >
          {renderModalContent()}
        </CustomModal>
      )}
      {!screens.lg && (
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal('add-post')}
          style={{ right: 24, bottom: 80 }} // Adjust position to avoid bottom nav
        />
      )}
      {!screens.lg && (
        <BottomNavigationBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
        />
      )}
    </Layout>
  );
}

export default App;
