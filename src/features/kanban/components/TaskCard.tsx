import { FiAlertCircle, FiUser, FiShoppingCart, FiTruck, FiFileText, FiTerminal, FiUsers, FiBell, FiAnchor, FiLink } from "react-icons/fi";
import type { NexusTask, TaskCategory, TaskPriority } from "../../../types/kanban";

interface TaskCardProps {
    task: NexusTask;
    onEdit?: (task: NexusTask) => void;
    onDragStart?: (e: React.DragEvent) => void;
}

const CATEGORY_STYLES: Record<TaskCategory, { color: string, label: string, icon: any }> = {
    PURCHASE_ORDER: { color: "#fde047", label: "COMPRAS", icon: FiShoppingCart },
    CONTAINER_LOGISTICS: { color: "#10b981", label: "LOGÍSTICA", icon: FiTruck },
    ACCOUNTING_AUDIT: { color: "#f59e0b", label: "CONTABILIDAD", icon: FiFileText },
    IT_SUPPORT: { color: "#2563eb", label: "SOPORTE IT", icon: FiTerminal },
    SALES_FOLLOWUP: { color: "#6366f1", label: "VENTAS", icon: FiUsers },
    GENERAL_REMINDER: { color: "#64748b", label: "GENERAL", icon: FiBell }
};

const PRIORITY_STYLES: Record<TaskPriority, { color: string, label: string }> = {
    low: { color: "text-blue-500", label: "BAJA" },
    medium: { color: "text-emerald-500", label: "MEDIA" },
    high: { color: "text-amber-500", label: "ALTA" },
    urgent: { color: "text-red-600 font-black animate-pulse", label: "URGENTE" }
};

export const TaskCard = ({ task, onEdit, onDragStart }: TaskCardProps) => {
    const category = CATEGORY_STYLES[task.category];
    const priority = PRIORITY_STYLES[task.priority];

    // Health Flags Logic
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
    const isStuck = (new Date().getTime() - new Date(task.lastMovedAt).getTime()) > 48 * 60 * 60 * 1000;
    const hasDependencies = task.dependencies && task.dependencies.length > 0;

    const handleDragStart = (e: React.DragEvent) => {
        // Ghosting Effect implementation
        const target = e.currentTarget as HTMLElement;
        target.style.opacity = '0.4';
        onDragStart?.(e);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.opacity = '1';
    };

    return (
        <div
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onEdit?.(task)}
            className={`group bg-white border border-slate-200 p-2 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative overflow-hidden rounded-none ${isOverdue ? "border-red-500 bg-red-50/10" : ""}`}
            style={{ borderLeft: `4px solid ${category.color}` }}
        >
            {/* Health Flags Bar */}
            <div className="flex gap-1 mb-1">
                {isStuck && (
                    <div className="bg-amber-100 text-amber-600 px-1 py-0.5 flex items-center gap-1 border border-amber-200">
                        <FiAnchor size={8} />
                        <span className="text-[7px] font-black uppercase tracking-tighter">STUCK</span>
                    </div>
                )}
                {isOverdue && (
                    <div className="bg-red-600 text-white px-1 py-0.5 flex items-center gap-1">
                        <FiAlertCircle size={8} />
                        <span className="text-[7px] font-black uppercase tracking-tighter">OVERDUE</span>
                    </div>
                )}
                {hasDependencies && (
                    <div className="bg-blue-100 text-blue-600 px-1 py-0.5 flex items-center gap-1 border border-blue-200">
                        <FiLink size={8} />
                        <span className="text-[7px] font-black uppercase tracking-tighter">DEP</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start mb-1.5">
                <span className="text-[8px] font-black tracking-[0.1em] text-slate-400 uppercase leading-none">
                    #{task.id.slice(0, 8)}
                </span>
                <div className={`flex items-center gap-1 ${priority.color}`}>
                    <FiAlertCircle size={10} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{priority.label}</span>
                </div>
            </div>

            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-tight mb-1 group-hover:text-brand-quaternary transition-colors">
                {task.title}
            </h4>

            <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 leading-snug font-medium italic">
                {task.description}
            </p>

            <div className="flex flex-wrap gap-2 items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 text-white text-[8px] font-black uppercase tracking-widest rounded-none">
                    <category.icon size={10} />
                    {category.label}
                </div>

                <div className="flex items-center gap-2">
                    {task.assignedTo && (
                        <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded-none">
                            <FiUser size={10} />
                            <span className="text-[8px] font-bold uppercase truncate max-w-[50px]">{task.assignedTo}</span>
                        </div>
                    )}
                </div>
            </div>

            {task.referenceId && (
                <div className="mt-2 pt-1 border-t border-dashed border-slate-100 bg-slate-50 -mx-2 -mb-2 p-1 px-2 border-b-2 border-b-brand-quaternary">
                    <span className="text-[8px] font-black text-brand-quaternary uppercase tracking-widest flex items-center gap-1">
                        <FiLink size={10} /> REF: {task.referenceId}
                    </span>
                </div>
            )}
        </div>
    );
};
