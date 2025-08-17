import React, { useRef, useEffect } from 'react';
import { Modal as AntdModal } from 'antd';
import { gsap } from 'gsap';

function CustomModal({ title, children, onClose }) {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      gsap.fromTo(
        modalContentRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  const handleCancel = () => {
    gsap.to(
      modalContentRef.current,
      { opacity: 0, y: -50, duration: 0.3, ease: 'power3.in', onComplete: onClose }
    );
  };

  return (
    <AntdModal
      title={title}
      open={true} // Ant Design Modal uses 'open' prop for visibility
      onCancel={handleCancel}
      footer={null} // Remove default footer buttons
      destroyOnClose // Unmount content when closed
      maskClosable={false} // Prevent closing by clicking mask during animation
    >
      <div ref={modalContentRef}>
        {children}
      </div>
    </AntdModal>
  );
}

export default CustomModal;
