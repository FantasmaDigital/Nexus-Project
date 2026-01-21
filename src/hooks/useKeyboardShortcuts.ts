import { useEffect } from 'react';

export type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean; // For Mac Command key
    shiftKey?: boolean;
    altKey?: boolean;
};

interface ShortcutConfig {
    combo: KeyCombo;
    handler: (e: KeyboardEvent) => void;
    description?: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach(({ combo, handler }) => {
                const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase();
                const ctrlMatch = !!combo.ctrlKey === (event.ctrlKey || event.metaKey);
                const shiftMatch = !!combo.shiftKey === event.shiftKey;
                const altMatch = !!combo.altKey === event.altKey;

                if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                    event.preventDefault();
                    handler(event);
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

// 2. Manejador de teclado (Flechas y Escape)
export const handleKeyDown = (e: KeyboardEvent, onClose: () => void, confirmButtonRef: any, cancelButtonRef: any) => {
    if (e.key === "Escape") {
        onClose();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // Alternar foco entre botones con las flechas
        if (document.activeElement === confirmButtonRef.current) {
            cancelButtonRef.current?.focus();
        } else {
            confirmButtonRef.current?.focus();
        }
    }
};