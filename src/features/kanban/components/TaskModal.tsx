import { useState, useEffect } from "react";
import { FiX, FiSave, FiTrash2, FiActivity, FiClock, FiLink } from "react-icons/fi";
import type { NexusTask, TaskCategory, TaskPriority, TaskStatus } from "../../../types/kanban";
import { useKanbanStore } from "../../../store/kanban.store";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<NexusTask, 'id' | 'createdAt' | 'updatedAt' | 'lastMovedAt' | 'history'>) => void;
    onUpdate?: (id: string, updates: Partial<NexusTask>) => void;
    onDelete?: (id: string) => void;
    initialTask?: NexusTask | null;
    defaultStatus?: TaskStatus;
}

const CATEGORIES: { value: TaskCategory, label: string }[] = [
    { value: 'PURCHASE_ORDER', label: 'Orden de Compra (OC)' },
    { value: 'CONTAINER_LOGISTICS', label: 'Logística de Contenedores' },
    { value: 'ACCOUNTING_AUDIT', label: 'Auditoría Contable' },
    { value: 'IT_SUPPORT', label: 'Soporte IT / Sistemas' },
    { value: 'SALES_FOLLOWUP', label: 'Seguimiento de Ventas' },
    { value: 'GENERAL_REMINDER', label: 'Recordatorio General' },
];

const PRIORITIES: { value: TaskPriority, label: string }[] = [
    { value: 'low', label: 'Prioridad Baja' },
    { value: 'medium', label: 'Prioridad Media' },
    { value: 'high', label: 'Prioridad Alta' },
    { value: 'urgent', label: 'URGENTE / CRÍTICA' },
];

const STATUSES: { value: TaskStatus, label: string }[] = [
    { value: 'TO_DO', label: 'En Cola (TO-DO)' },
    { value: 'IN_PROGRESS', label: 'En Ejecución' },
    { value: 'DONE', label: 'Finalizada' },
];

export const TaskModal = ({
    isOpen,
    onClose,
    onSave,
    onUpdate,
    onDelete,
    initialTask,
    defaultStatus = 'TO_DO'
}: TaskModalProps) => {
    const allTasks = useKanbanStore(state => state.tasks);
    const [activeTab, setActiveTab] = useState<'DETAILS' | 'AUDIT' | 'DEP'>('DETAILS');
    const [formData, setFormData] = useState<Omit<NexusTask, 'id' | 'createdAt' | 'updatedAt' | 'lastMovedAt' | 'history'>>({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        category: 'GENERAL_REMINDER',
        dueDate: '',
        assignedTo: '',
        referenceId: '',
        dependencies: [],
    });

    useEffect(() => {
        if (initialTask) {
            setFormData({
                title: initialTask.title,
                description: initialTask.description,
                status: initialTask.status,
                priority: initialTask.priority,
                category: initialTask.category,
                dueDate: initialTask.dueDate || '',
                assignedTo: initialTask.assignedTo || '',
                referenceId: initialTask.referenceId || '',
                dependencies: initialTask.dependencies || [],
            });
            setActiveTab('DETAILS');
        } else {
            setFormData(prev => ({ ...prev, status: defaultStatus }));
            setActiveTab('DETAILS');
        }
    }, [initialTask, defaultStatus]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialTask && onUpdate) {
            onUpdate(initialTask.id, formData);
        } else {
            onSave(formData);
        }
        onClose();
    };

    const toggleDependency = (id: string) => {
        const deps = formData.dependencies || [];
        setFormData({
            ...formData,
            dependencies: deps.includes(id) ? deps.filter(d => d !== id) : [...deps, id]
        });
    };

    const inputStyles = "w-full bg-white border border-slate-300 p-2 text-[11px] font-bold text-slate-800 uppercase outline-none focus:border-brand-quaternary transition-all rounded-none placeholder:font-normal placeholder:text-slate-400";
    const labelStyles = "text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl border border-slate-700 shadow-2xl rounded-none overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header Enterprise */}
                <div className="bg-[#1f2937] p-2 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-quaternary p-1.5 text-white">
                            <FiActivity size={14} />
                        </div>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-[0.25em]">
                            {initialTask ? `Control de Tarea: #${initialTask.id.slice(0, 8)}` : 'Nueva Operación Crítica'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-1">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-slate-100 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('DETAILS')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DETAILS' ? "bg-white border-b-2 border-brand-quaternary text-brand-quaternary" : "text-slate-500"}`}
                    >
                        Detalles
                    </button>
                    {initialTask && (
                        <button
                            onClick={() => setActiveTab('AUDIT')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'AUDIT' ? "bg-white border-b-2 border-brand-quaternary text-brand-quaternary" : "text-slate-500"}`}
                        >
                            Auditoría Inmutable
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('DEP')}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DEP' ? "bg-white border-b-2 border-brand-quaternary text-brand-quaternary" : "text-slate-500"}`}
                    >
                        Dependencias ({formData.dependencies?.length || 0})
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar bg-slate-50/30">
                    {activeTab === 'DETAILS' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    <label className={labelStyles}>Título Operativo</label>
                                    <input
                                        required
                                        type="text"
                                        className={inputStyles}
                                        placeholder="EJ: CONCILIACIÓN BANCARIA ENERO - BBVA"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className={labelStyles}>Prioridad Nexus</label>
                                    <select
                                        className={inputStyles}
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                                    >
                                        {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelStyles}>Descripción de Procedimiento</label>
                                <textarea
                                    rows={4}
                                    className={`${inputStyles} resize-none font-medium normal-case placeholder:italic h-32`}
                                    placeholder="DETALLE LOS PASOS O REQUERIMIENTOS..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelStyles}>Departamento/Categoría</label>
                                    <select
                                        className={inputStyles}
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                                    >
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyles}>Estado de Flujo</label>
                                    <select
                                        className={inputStyles}
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                    >
                                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyles}>SLA / Fecha Límite</label>
                                    <input
                                        type="date"
                                        className={inputStyles}
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyles}>Asignación Directa</label>
                                    <input
                                        type="text"
                                        className={inputStyles}
                                        placeholder="NOMBRE DE USUARIO O ROL"
                                        value={formData.assignedTo}
                                        onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelStyles}>ReferenceID (Maestro)</label>
                                    <input
                                        type="text"
                                        className={inputStyles}
                                        placeholder="SKU / FOLIO / DTE"
                                        value={formData.referenceId}
                                        onChange={e => setFormData({ ...formData, referenceId: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'AUDIT' && initialTask && (
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-slate-800 uppercase mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                                <FiClock /> Registro de Auditoría
                            </h3>
                            <div className="space-y-1">
                                {initialTask.history.slice().reverse().map((log, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 p-2 flex flex-col gap-1 rounded-none">
                                        <div className="flex justify-between items-center text-[8px] font-black">
                                            <span className="bg-brand-quaternary text-white px-1 py-0.5 rounded-none">{log.action}</span>
                                            <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] text-slate-600 font-bold uppercase">{log.details}</span>
                                            <span className="text-[8px] text-slate-400 uppercase italic">User: {log.userId}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'DEP' && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-800 uppercase border-b border-slate-200 pb-2 flex items-center gap-2">
                                <FiLink /> Vinculación de Dependencias
                            </h3>
                            <div className="grid grid-cols-1 gap-1">
                                {Object.values(allTasks)
                                    .filter(t => t.id !== initialTask?.id)
                                    .map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => toggleDependency(t.id)}
                                            className={`p-2 text-left text-[10px] font-bold uppercase border transition-all ${formData.dependencies?.includes(t.id)
                                                ? "bg-brand-quaternary text-white border-blue-600"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex justify-between">
                                                <span>{t.title}</span>
                                                <span className="opacity-50">#{t.id.slice(0, 8)}</span>
                                            </div>
                                        </button>
                                    ))}
                                {Object.keys(allTasks).length <= 1 && (
                                    <p className="text-[10px] text-slate-400 italic text-center py-8 bg-slate-100 uppercase font-black">
                                        No hay otras tareas disponibles para vincular.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-200 mt-4">
                        {initialTask && onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('¿Seguro que deseas eliminar permanentemente esta operación de la auditoría?')) {
                                        onDelete(initialTask.id);
                                        onClose();
                                    }
                                }}
                                className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 rounded-none"
                            >
                                <FiTrash2 size={12} /> Purge Task
                            </button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all rounded-none"
                            >
                                ABORT
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-quaternary transition-all shadow-xl flex items-center gap-2 rounded-none border border-slate-700"
                            >
                                <FiSave size={14} /> Commit Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
