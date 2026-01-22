import { useState, useMemo } from "react";
import { FiPlus, FiActivity, FiLayers, FiCheckSquare, FiShield, FiSearch, FiFilter } from "react-icons/fi";
import { KanbanBoard } from "../../features/kanban/components/KanbanBoard";
import { TaskModal } from "../../features/kanban/components/TaskModal";
import { useKanbanStore } from "../../store/kanban.store";
import type { NexusTask, TaskStatus } from "../../types/kanban";

export const KanbanPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<NexusTask | null>(null);
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TO_DO');
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("ALL");

    const { addTask, updateTask, deleteTask, tasks, wipLimits } = useKanbanStore();

    const taskList = useMemo(() => {
        let list = Object.values(tasks);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter((t: NexusTask) =>
                t.title.toLowerCase().includes(query) ||
                t.referenceId?.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.id.toLowerCase().includes(query)
            );
        }

        if (filterCategory !== "ALL") {
            list = list.filter((t: NexusTask) => t.category === filterCategory);
        }

        return list;
    }, [tasks, searchQuery, filterCategory]);

    const pendingCount = taskList.filter((t: NexusTask) => t.status === 'TO_DO').length;
    const progressCount = taskList.filter((t: NexusTask) => t.status === 'IN_PROGRESS').length;
    const doneCount = taskList.filter((t: NexusTask) => t.status === 'DONE').length;

    const handleAddTask = (status: TaskStatus) => {
        setSelectedTask(null);
        setDefaultStatus(status);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: NexusTask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
            {/* Enterprise Header */}
            <header className="h-14 bg-[#1f2937] border-b border-slate-700 flex items-center justify-between px-4 shrink-0 shadow-lg z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-quaternary p-1.5 text-white">
                        <FiShield size={16} />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-[12px] tracking-[0.2em] uppercase">
                            Enterprise Operations Control
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-brand-secondary uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 border border-slate-700">
                                V3.0 Enterprise Ultra
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse" /> System Ready
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-quaternary transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH BY TASK, REF OR ID..."
                            className="bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2 text-[10px] font-black uppercase outline-none focus:border-brand-quaternary w-80 placeholder:font-normal placeholder:text-slate-600 transition-all rounded-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-quaternary transition-colors" size={14} />
                        <select
                            className="bg-slate-800 border border-slate-700 text-white pl-9 pr-8 py-2 text-[10px] font-black uppercase outline-none focus:border-brand-quaternary cursor-pointer transition-all rounded-none appearance-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="ALL">ALL DEPARTMENTS</option>
                            <option value="PURCHASE_ORDER">PURCHASE ORDERS</option>
                            <option value="CONTAINER_LOGISTICS">LOGISTICS</option>
                            <option value="ACCOUNTING_AUDIT">ACCOUNTING</option>
                            <option value="IT_SUPPORT">IT SUPPORT</option>
                            <option value="SALES_FOLLOWUP">SALES CRM</option>
                            <option value="GENERAL_REMINDER">ADMINISTRATION</option>
                        </select>
                    </div>

                    <button
                        onClick={() => handleAddTask('TO_DO')}
                        className="flex items-center gap-2 bg-brand-quaternary text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md active:scale-95 hover:bg-blue-700 border border-blue-500 rounded-none"
                    >
                        <FiPlus /> Deploy New Task
                    </button>
                </div>
            </header>

            {/* Performance Stats */}
            <div className="flex bg-white border-b border-slate-200 shadow-sm z-10">
                <div className="flex-1 p-2 border-r border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 text-slate-500">
                            <FiLayers size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Backlog Queue</p>
                            <p className="text-sm font-black text-slate-900 leading-none">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase">WIP: {wipLimits.TO_DO}</p>
                    </div>
                </div>

                <div className="flex-1 p-2 border-r border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 p-2 text-white shadow-lg shadow-blue-200">
                            <FiActivity size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-brand-quaternary uppercase tracking-widest mb-0.5">Execution</p>
                            <p className="text-sm font-black text-blue-600 leading-none">{progressCount}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase">WIP: {wipLimits.IN_PROGRESS}</p>
                    </div>
                </div>

                <div className="flex-1 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-600 p-2 text-white">
                            <FiCheckSquare size={14} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Ready</p>
                            <p className="text-sm font-black text-emerald-700 leading-none">{doneCount}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase">Rate</p>
                        <p className="text-[10px] font-black text-emerald-600">{taskList.length > 0 ? Math.round((doneCount / taskList.length) * 100) : 0}%</p>
                    </div>
                </div>
            </div>

            {/* Main Operational Board */}
            <div className="flex-1 p-2 overflow-hidden bg-slate-50 shadow-inner">
                <KanbanBoard onAddTask={handleAddTask} onEditTask={handleEditTask} />
            </div>

            {/* Unified Task Control Center (Modal) */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={addTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                initialTask={selectedTask}
                defaultStatus={defaultStatus}
            />
        </div>
    );
};

export default KanbanPage;
