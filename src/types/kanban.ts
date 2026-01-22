export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory =
    | 'PURCHASE_ORDER'
    | 'CONTAINER_LOGISTICS'
    | 'ACCOUNTING_AUDIT'
    | 'IT_SUPPORT'
    | 'SALES_FOLLOWUP'
    | 'GENERAL_REMINDER';

export interface NexusTaskAudit {
    timestamp: string;
    userId: string;
    action: string;
    details?: string;
}

export interface NexusTask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    category: TaskCategory;
    createdAt: string;
    updatedAt: string;
    lastMovedAt: string; // For "Stuck" logic
    dueDate?: string;
    assignedTo?: string;
    referenceId?: string;
    dependencies?: string[]; // IDs of other tasks
    tags?: string[];
    history: NexusTaskAudit[];
}

export interface KanbanState {
    tasks: Record<string, NexusTask>;
    wipLimits: Record<TaskStatus, number>;
    addTask: (task: Omit<NexusTask, 'id' | 'createdAt' | 'updatedAt' | 'lastMovedAt' | 'history'>) => void;
    updateTask: (id: string, updates: Partial<NexusTask>) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, newStatus: TaskStatus) => boolean; // Returns false if WIP limit exceeded
    setWipLimit: (status: TaskStatus, limit: number) => void;
    purgeCorruptData: () => void;
}
