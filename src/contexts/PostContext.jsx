import React, { createContext, useReducer, useEffect } from 'react';

const PostContext = createContext();

const initialState = {
  posts: [],
  categories: ['LinkedIn', 'Instagram', 'Facebook', 'Others'], // Default categories
  uiState: {
    isSidebarOpen: true,
    theme: 'light', // 'light' or 'dark'
  },
};

const postReducer = (state, action) => {
  console.log('Reducer: Action received', action.type, action.payload);
  console.log('Reducer: Current state', state);
  switch (action.type) {
    case 'ADD_POST':
      const newPosts = [...state.posts, action.payload];
      console.log('Reducer: New posts after ADD_POST', newPosts);
      return { ...state, posts: newPosts };
    case 'EDIT_POST':
      const editedPosts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
      console.log('Reducer: New posts after EDIT_POST', editedPosts);
      return {
        ...state,
        posts: editedPosts,
      };
    case 'DELETE_POST':
      const filteredPosts = state.posts.filter((post) => post.id !== action.payload);
      console.log('Reducer: New posts after DELETE_POST', filteredPosts);
      return {
        ...state,
        posts: filteredPosts,
      };
    case 'TOGGLE_FAVORITE':
      const toggledPosts = state.posts.map((post) =>
        post.id === action.payload ? { ...post, isFavorite: !post.isFavorite } : post
      );
      console.log('Reducer: New posts after TOGGLE_FAVORITE', toggledPosts);
      return {
        ...state,
        posts: toggledPosts,
      };
    case 'ADD_CATEGORY':
      const newCategories = [...state.categories, action.payload];
      console.log('Reducer: New categories after ADD_CATEGORY', newCategories);
      return { ...state, categories: newCategories };
    case 'EDIT_CATEGORY':
      const editedCategories = state.categories.map((category) =>
        category === action.payload.oldCategory ? action.payload.newCategory : category
      );
      console.log('Reducer: New categories after EDIT_CATEGORY', editedCategories);
      return {
        ...state,
        categories: editedCategories,
      };
    case 'DELETE_CATEGORY':
      const filteredCategories = state.categories.filter((category) => category !== action.payload);
      const postsAfterCategoryDelete = state.posts.map((post) =>
        post.category === action.payload ? { ...post, category: 'Others' } : post
      );
      console.log('Reducer: New categories after DELETE_CATEGORY', filteredCategories);
      console.log('Reducer: Posts after category delete', postsAfterCategoryDelete);
      return {
        ...state,
        categories: filteredCategories,
        posts: postsAfterCategoryDelete,
      };
    case 'SET_UI_STATE':
      console.log('Reducer: New UI state', { ...state.uiState, ...action.payload });
      return { ...state, uiState: { ...state.uiState, ...action.payload } };
    case 'LOAD_STATE':
      console.log('Reducer: Loading state from localStorage', action.payload);
      return action.payload;
    default:
      return state;
  }
};

const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  // Load state from localStorage on initial mount
  useEffect(() => {
    const storedState = localStorage.getItem('mediaSaverState');
    if (storedState) {
      console.log('PostProvider: Loading state from localStorage', JSON.parse(storedState));
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(storedState) });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    console.log('PostProvider: Saving state to localStorage', state);
    localStorage.setItem('mediaSaverState', JSON.stringify(state));
  }, [state]);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
