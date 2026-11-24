import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/components/project-hero";
import { ScrubText } from "@/components/scrub-text";
import { Story } from "@/components/sections/story";
import { Gallery } from "@/components/sections/gallery";
import { Film } from "@/components/sections/film";
import { NextProject } from "@/components/next-project";
import { getProject, nextProject, plain, PROJECTS } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${plain(project.title)} — NZ Pro Photography` : "Story — NZ Pro Photography" };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    // key remounts the whole story when you move between projects, so every scroll trigger starts clean
    <div key={project.slug}>
      <ProjectHero project={project} />
      <ScrubText eyebrow={`Story ${project.no}`} text={project.intro} />
      <Story project={project} />
      <Gallery project={project} />
      <Film project={project} />
      <NextProject project={nextProject(project.slug)} />
    </div>
  );
}
