import { ProjectScreen } from "@/components/screens/project-screen";

export default async function ProjectPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  return <ProjectScreen id={id} />;
}
