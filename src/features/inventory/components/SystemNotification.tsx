import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { useEffect } from "react";

type NotificationType = 'error' | 'success' | 'info' | 'warning';

interface SystemNotificationProps {
    message: string | null;
    type?: NotificationType;
    onClose: () => void;
    duration?: number;
}

const styles = {
    error: {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        icon: <FiAlertCircle className="text-red-500" size={18} />,
        accent: "bg-red-500",
        label: "Error del Sistema"
    },
    success: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: <FiCheckCircle className="text-emerald-500" size={18} />,
        accent: "bg-emerald-500",
        label: "Operación Exitosa"
    },
    info: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: <FiInfo className="text-blue-500" size={18} />,
        accent: "bg-blue-500",
        label: "Información"
    },
    warning: {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: <FiAlertCircle className="text-amber-500" size={18} />,
        accent: "bg-amber-500",
        label: "Advertencia"
    }
};

export const SystemNotification = ({ message, type = 'error', onClose, duration = 4000 }: SystemNotificationProps) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    const currentStyle = styles[type];

    return (
        <AnimatePresence>
            {message && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto relative overflow-hidden backdrop-blur-xl ${currentStyle.bg} border ${currentStyle.border} p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-lg flex items-start gap-4`}
                    >
                        {/* Accent line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStyle.accent}`} />

                        {/* Icon */}
                        <div className="shrink-0 mt-0.5">
                            {currentStyle.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                {currentStyle.label}
                            </h4>
                            <p className="text-sm font-medium text-slate-800 leading-tight">
                                {message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="shrink-0 p-1 hover:bg-black/5 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <FiX size={16} />
                        </button>

                        {/* Progress bar animation */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={`absolute bottom-0 left-0 h-0.5 ${currentStyle.accent} opacity-30`}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
