'use client';

import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white"
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop: semi-transparent so background page stays visible */}
      <div 
        className="fixed inset-0 z-[1000] bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg 
                  className="h-6 w-6 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <div className="ml-4 text-center sm:text-left w-full">
                <h3 id="confirm-modal-title" className="text-lg font-medium text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-colors ${confirmButtonClass}`}
              >
                {confirmText}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
