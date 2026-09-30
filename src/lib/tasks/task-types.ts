import { z } from "zod";

export const TITLE_MAX_LENGTH = 500;

export const TASK_PRIORITIES = ["none", "low", "medium", "high"] as const;
export const TASK_STATUSES = ["active", "completed", "archived"] as const;

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeKey = z.string().regex(/^\d{2}:\d{2}$/);

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  notes: z.string().optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: dateKey.optional(),
  dueTime: timeKey.optional(),
  projectId: z.string().optional(),
  tags: z.array(z.string()),
  subtasks: z.array(subtaskSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type Subtask = z.infer<typeof subtaskSchema>;
export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];

export type NewTaskInput = {
  title: string;
  notes?: string;
  priority?: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  projectId?: string;
  tags?: string[];
};

export type TaskUpdates = Partial<
  Pick<Task, "title" | "notes" | "priority" | "dueDate" | "dueTime" | "projectId" | "tags">
>;

export type ParsedTaskInput = {
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: TaskPriority;
  projectName?: string;
  tags?: string[];
};
