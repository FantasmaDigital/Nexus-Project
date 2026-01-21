import { FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
    id: string;
    label: string;
    desc?: string;
    icon: any;
}

interface CustomSelectProps {
    label: string;
    value: string;
    options: SelectOption[];
    onSelect: (id: string) => void;
    icon?: any;
    className?: string; // Container styles
    selectClassName?: string; // Trigger button styles
    error?: string;
    direction?: 'up' | 'down';
}

export const CustomSelect = ({
    label,
    value,
    options,
    onSelect,
    icon: HeaderIcon,
    className = "",
    selectClassName = "",
    error,
    direction = 'down'
}: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const selectedOption = options.find(o => o.id === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        // Update position on scroll/resize
        const updatePosition = () => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setDropdownStyle({
                    position: 'fixed',
                    top: direction === 'down' ? rect.bottom + 4 : 'auto',
                    bottom: direction === 'up' ? window.innerHeight - rect.top + 4 : 'auto',
                    left: rect.left,
                    width: rect.width,
                    zIndex: 9999,
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, direction]);

    return (
        <div className={`flex flex-col gap-1 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    {HeaderIcon && <HeaderIcon className="text-slate-400" />}
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-white border px-3 flex items-center justify-between transition-all group rounded-none
                        ${error ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.1)]' : 'border-slate-300 hover:border-brand-quaternary'}
                        ${isOpen ? 'ring-2 ring-brand-quaternary/20 border-brand-quaternary z-20' : 'z-10'}
                        ${selectClassName.includes('h-') ? '' : 'py-2.5'}
                        ${selectClassName}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-1 border transition-colors ${isOpen ? 'bg-brand-quaternary border-brand-quaternary text-white' : 'bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-brand-quaternary group-hover:border-brand-quaternary group-hover:text-white'}`}>
                            <selectedOption.icon className="text-xs" />
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate leading-tight">{selectedOption.label}</span>
                            {selectedOption.desc && (
                                <span className="text-[8px] text-slate-400 font-medium leading-[1.3] uppercase tracking-tighter truncate mt-0.5">{selectedOption.desc}</span>
                            )}
                        </div>
                    </div>
                    <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && createPortal(
                    <div
                        className="bg-white border border-slate-200 shadow-2xl max-h-64 overflow-y-auto rounded-none animate-in fade-in zoom-in-95 duration-200"
                        style={dropdownStyle}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                    onSelect(opt.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${value === opt.id ? 'bg-slate-50' : ''}`}
                            >
                                <div className={`p-1.5 border ${value === opt.id ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                    <opt.icon className="text-xs" />
                                </div>
                                <div className="flex flex-col items-start overflow-hidden text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-tight truncate w-full ${value === opt.id ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</span>
                                    {opt.desc && (
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-[1.3] mt-1 truncate w-full">{opt.desc}</span>
                                    )}
                                </div>
                                {value === opt.id && <div className="ml-auto w-1.5 h-1.5 bg-brand-quaternary rounded-full flex-shrink-0"></div>}
                            </button>
                        ))}
                    </div>
                    , document.body)}
            </div>
            {error && <span className="text-[9px] font-bold text-red-500 uppercase">{error}</span>}
        </div>
    );
};
