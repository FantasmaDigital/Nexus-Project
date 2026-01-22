import { useState } from "react";
import { FiPlus, FiMoreVertical, FiShield, FiAlertTriangle } from "react-icons/fi";
import type { NexusTask, TaskStatus } from "../../../types/kanban";
import { TaskCard } from "./TaskCard";
import { useKanbanStore } from "../../../store/kanban.store";

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: NexusTask[];
    onAddTask?: (status: TaskStatus) => void;
    onEditTask?: (task: NexusTask) => void;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
    TO_DO: "bg-slate-500",
    IN_PROGRESS: "bg-brand-quaternary",
    DONE: "bg-emerald-600"
};

export const KanbanColumn = ({
    title,
    status,
    tasks,
    onAddTask,
    onEditTask,
    onDragStart,
    onDrop,
    onDragOver
}: KanbanColumnProps) => {
    const [isOver, setIsOver] = useState(false);
    const wipLimits = useKanbanStore(state => state.wipLimits);
    const limit = wipLimits[status];
    const isSaturated = tasks.length >= limit;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(true);
        onDragOver(e);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        setIsOver(false);
        onDrop(e);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col w-80 shrink-0 transition-all duration-300 border rounded-none ${isOver
                ? isSaturated
                    ? "bg-red-50 border-red-500 scale-100 opacity-80"
                    : "bg-blue-50/80 border-brand-quaternary border-dashed scale-[1.02] shadow-xl z-10"
                : "bg-slate-100/30 border-slate-200"
                }`}
        >
            {/* WIP Header */}
            <div className={`p-1 px-3 flex items-center justify-between border-b ${isSaturated ? "bg-red-600 border-red-700" : "bg-[#1f2937] border-slate-700"}`}>
                <div className="flex items-center gap-2">
                    <FiShield size={10} className="text-white/50" />
                    <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">WIP LIMIT: {limit}</span>
                </div>
                {isSaturated && (
                    <div className="flex items-center gap-1 text-white animate-pulse">
                        <FiAlertTriangle size={10} />
                        <span className="text-[8px] font-black uppercase">Saturated</span>
                    </div>
                )}
            </div>

            {/* Main Header */}
            <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${STATUS_COLORS[status]}`} />
                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.15em]">{title}</h3>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 min-w-[1.2rem] text-center ${isSaturated ? "bg-red-600 text-white" : "bg-slate-200 text-slate-800"}`}>
                        {tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onAddTask?.(status)}
                        className="p-1.5 text-slate-400 hover:text-brand-quaternary hover:bg-blue-50 transition-all active:scale-95"
                    >
                        <FiPlus size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-all">
                        <FiMoreVertical size={14} />
                    </button>
                </div>
            </div>

            {/* Tasks Container */}
            <div className={`flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar min-h-[400px] transition-all ${isOver && isSaturated ? "grayscale" : ""}`}>
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onDragStart={(e: React.DragEvent) => onDragStart(e, task.id)}
                    />
                ))}

                {tasks.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-white/50">
                        <FiShield size={24} className="text-slate-200 mb-2" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
                            Queue Ready for Deployment
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
