import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { KanbanState, NexusTask, TaskStatus, NexusTaskAudit } from '../types/kanban';

const createAuditTrail = (action: string, details?: string): NexusTaskAudit => ({
    timestamp: new Date().toISOString(),
    userId: 'system-user', // Fallback until auth is integrated
    action,
    details
});

export const useKanbanStore = create<KanbanState>()(
    persist(
        (set, get) => ({
            tasks: {},
            wipLimits: {
                TO_DO: 50,
                IN_PROGRESS: 5, // Default WIP limit for focus
                DONE: 999
            },

            addTask: (taskData) => set((state) => {
                const id = crypto.randomUUID();
                const now = new Date().toISOString();
                const newTask: NexusTask = {
                    ...taskData,
                    id,
                    createdAt: now,
                    updatedAt: now,
                    lastMovedAt: now,
                    history: [createAuditTrail('CREATED', 'Task initialized via Enterprise V3.0')],
                };
                return {
                    tasks: {
                        ...state.tasks,
                        [id]: newTask
                    }
                };
            }),

            updateTask: (id, updates) => set((state) => {
                const task = state.tasks[id];
                if (!task) return state;
                const now = new Date().toISOString();

                // Track changes in history if significant
                const auditDetails = Object.keys(updates).join(', ');

                return {
                    tasks: {
                        ...state.tasks,
                        [id]: {
                            ...task,
                            ...updates,
                            updatedAt: now,
                            history: [...task.history, createAuditTrail('UPDATED', `Fields: ${auditDetails}`)]
                        }
                    }
                };
            }),

            deleteTask: (id) => set((state) => {
                const newTasks = { ...state.tasks };
                delete newTasks[id];
                return { tasks: newTasks };
            }),

            moveTask: (id, newStatus) => {
                const state = get();
                const task = state.tasks[id];
                if (!task || task.status === newStatus) return false;

                // WIP Limit Check
                const tasksInNewStatus = Object.values(state.tasks).filter(t => t.status === newStatus).length;
                if (tasksInNewStatus >= state.wipLimits[newStatus]) {
                    console.warn(`WIP Limit reached for ${newStatus}`);
                    return false;
                }

                const now = new Date().toISOString();
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [id]: {
                            ...task,
                            status: newStatus,
                            updatedAt: now,
                            lastMovedAt: now,
                            history: [...task.history, createAuditTrail('MOVED', `From ${task.status} to ${newStatus}`)]
                        }
                    }
                }));
                return true;
            },

            setWipLimit: (status, limit) => set((state) => ({
                wipLimits: { ...state.wipLimits, [status]: limit }
            })),

            purgeCorruptData: () => set((state) => {
                const cleanTasks = { ...state.tasks };
                let purgedCount = 0;

                Object.keys(cleanTasks).forEach(id => {
                    const task = cleanTasks[id];
                    // Purge test products or incomplete data
                    if (task.title.toLowerCase().includes('producto 0') || !task.category) {
                        delete cleanTasks[id];
                        purgedCount++;
                    }
                });

                if (purgedCount > 0) {
                    console.log(`Enterprise Purge: ${purgedCount} corrupt records removed.`);
                }

                return { tasks: cleanTasks };
            }),
        }),
        {
            name: 'nexus-task-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                return () => {
                    if (state) state.purgeCorruptData();
                };
            }
        }
    )
);
