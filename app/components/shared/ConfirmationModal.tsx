import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    heading: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    heading,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
                <div className="p-10 min-h-[200px]">
                    <h3 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                        {heading}
                    </h3>
                    <p className="text-lg text-center text-gray-600">
                        {description}
                    </p>
                </div>

                <div className="px-8 py-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-lg font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;