"use client";

import { getProjects } from "@/lib/projects/project-service";
import { createCollectionHook } from "./use-collection";

export const useProjects = createCollectionHook(getProjects);
