// src/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({ children }) => (
  <div className="modal-header">
    {children}
  </div>
);

export const ModalContent = ({ children }) => (
  <div className="modal-content">
    {children}
  </div>
);

export const ModalFooter = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);

export default Modal;