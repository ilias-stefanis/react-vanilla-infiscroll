import React from "react";
import { createPortal } from "react-dom";

const InviteModal = ({
    isOpen,
    onClose,
    personName,
}: {
    isOpen: boolean;
    onClose: () => void;
    personName: string;
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4">
                <h2 className="text-xl font-bold mb-4">Confirm Invitation</h2>
                <p className="mb-6">
                    Are you sure you want to invite **{personName}** to your
                    project?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            alert(`Invitation sent to ${personName}!`);
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body // Portal to the body element
    );
};

export default InviteModal;
