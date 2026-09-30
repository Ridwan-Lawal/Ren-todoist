"use client";

import { getTasks } from "@/lib/tasks/task-service";
import { createCollectionHook } from "./use-collection";

export const useTasks = createCollectionHook(getTasks);
