import type { Metadata } from "next";
import { AllTasksScreen } from "@/components/screens/all-tasks-screen";

export const metadata: Metadata = { title: "All Tasks" };

export default function AllTasksPage() {
  return <AllTasksScreen />;
}
