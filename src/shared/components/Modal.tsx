import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay: Fondo desenfocado */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-800/40 backdrop-blur-sm"
                    />

                    {/* Contenedor del Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`relative w-full ${sizeClasses[size]} bg-white border border-slate-200 shadow-2xl rounded-md overflow-hidden flex flex-col`}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                            <h3 className="text-sm font-black text-[#1e293b] uppercase tracking-widest leading-none">
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-8 overflow-y-auto max-h-[70vh] text-slate-600">
                            {children}
                        </div>

                        {/* Footer (Opcional) */}
                        {footer && (
                            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};