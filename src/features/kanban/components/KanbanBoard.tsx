import { useMemo } from "react";
import { useKanbanStore } from "../../../store/kanban.store";
import type { TaskStatus, KanbanTask } from "../../../types/kanban";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
    onAddTask: (status: TaskStatus) => void;
    onEditTask: (task: KanbanTask) => void;
}

export const KanbanBoard = ({ onAddTask, onEditTask }: KanbanBoardProps) => {
    const { tasks, moveTask } = useKanbanStore();

    const tasksByStatus = useMemo(() => {
        const grouped: Record<TaskStatus, KanbanTask[]> = {
            TO_DO: [],
            IN_PROGRESS: [],
            DONE: []
        };

        Object.values(tasks).forEach(task => {
            grouped[task.status].push(task);
        });

        // Sort by updatedAt desc
        Object.keys(grouped).forEach(status => {
            grouped[status as TaskStatus].sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        });

        return grouped;
    }, [tasks]);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            moveTask(taskId, status);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4 custom-scrollbar">
            <KanbanColumn
                title="Pendientes"
                status="TO_DO"
                tasks={tasksByStatus.TO_DO}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDragStart={handleDragStart}
                onDrop={(e: React.DragEvent) => handleDrop(e, 'TO_DO')}
                onDragOver={handleDragOver}
            />
            <KanbanColumn
                title="En Proceso"
                status="IN_PROGRESS"
                tasks={tasksByStatus.IN_PROGRESS}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDragStart={handleDragStart}
                onDrop={(e: React.DragEvent) => handleDrop(e, 'IN_PROGRESS')}
                onDragOver={handleDragOver}
            />
            <KanbanColumn
                title="Finalizadas"
                status="DONE"
                tasks={tasksByStatus.DONE}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDragStart={handleDragStart}
                onDrop={(e: React.DragEvent) => handleDrop(e, 'DONE')}
                onDragOver={handleDragOver}
            />
        </div>
    );
};
