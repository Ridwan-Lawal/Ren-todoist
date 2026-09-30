import { TaskDetailsScreen } from "@/components/screens/task-details-screen";

export default async function TaskPage(props: PageProps<"/tasks/[id]">) {
  const { id } = await props.params;
  return <TaskDetailsScreen id={id} />;
}
