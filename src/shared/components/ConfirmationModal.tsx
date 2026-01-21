import { useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { handleKeyDown } from "../../hooks/useKeyboardShortcuts";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger';
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = 'info'
}: ConfirmationModalProps) => {
    // Referencias para ambos botones
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        // 1. Foco inicial automático al abrir
        const timer = setTimeout(() => {
            confirmButtonRef.current?.focus();
        }, 100);

        window.addEventListener("keydown", (e) => handleKeyDown(e, onClose, confirmButtonRef, cancelButtonRef));
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", (e) => handleKeyDown(e, onClose, confirmButtonRef, cancelButtonRef));
        };
    }, [isOpen, onClose]);

    const accentColors = {
        info: "text-blue-500 bg-blue-50",
        warning: "text-amber-500 bg-amber-50",
        danger: "text-red-500 bg-red-50"
    };

    const confirmButtonStyles = {
        info: "bg-slate-900 hover:bg-black focus:ring-slate-400",
        warning: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-300",
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-300"
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={(
                <div className="flex w-full gap-2">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all rounded-none border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-3 text-[10px] font-black text-white uppercase tracking-widest transition-all rounded-none shadow-sm active:scale-95 flex items-center justify-center gap-2 focus:ring-4 outline-none ${confirmButtonStyles[type]}`}
                    >
                        {confirmText} <FiChevronRight className="text-xs" />
                    </button>
                </div>
            )}
        >
            <div className="flex flex-col gap-6 py-2 px-2">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-none border border-current opacity-80 ${accentColors[type]}`}>
                        <FiAlertCircle size={20} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-slate-900 font-bold text-sm tracking-tight leading-tight uppercase">Confirmación de Acción</h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium">{message}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-3 border-l-2 border-slate-300">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nota del sistema:</p>
                    <p className="text-[10px] text-slate-500 leading-normal">
                        Esta operación es definitiva dentro del flujo actual de facturación de Nexus ERP.
                    </p>
                </div>
            </div>
        </Modal>
    );
};