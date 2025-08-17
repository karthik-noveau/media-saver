import React from 'react';
import styles from './CategoryList.module.css';

function CategoryList({ categories, onEdit, onDelete, onSelect, selectedCategory }) {
  return (
    <div className={styles.categoryList}>
      <h4>Categories</h4>
      <div className={styles.list}>
        {categories.map(category => (
          <div 
            key={category} 
            className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => onSelect(category)}
          >
            <span>{category}</span>
            <div className={styles.actions}>
              <button onClick={(e) => {e.stopPropagation(); onEdit(category);}}>Edit</button>
              <button onClick={(e) => {e.stopPropagation(); onDelete(category);}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
