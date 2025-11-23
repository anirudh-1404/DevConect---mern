import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Delete Post", message = "Are you sure you want to delete this post? This action cannot be undone." }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-midnight-gray text-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-red-500/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all hover:shadow-lg hover:shadow-red-500/40"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeleteConfirmDialog;
