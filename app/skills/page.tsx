import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Browse Skills | Skills Reliquary",
  description: "Browse public skills shared by the community.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

async function getPublicSkills(query: string) {
  return prisma.skill.findMany({
    where: {
      isPublic: true,
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });
}

export default async function SkillsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const skills = await getPublicSkills(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Skills</h1>
          <p className="text-base-content/70 mt-1">
            {skills.length} public {skills.length === 1 ? "skill" : "skills"}
            {query && <> matching &ldquo;{query}&rdquo;</>}
          </p>
        </div>
        <Link href="/dashboard/skills/new" className="btn btn-primary btn-sm">
          Share a Skill
        </Link>
      </div>

      <form action="/skills" className="join w-full max-w-md mb-8">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or description"
          className="input input-bordered join-item w-full"
        />
        <button type="submit" className="btn join-item">
          Search
        </button>
      </form>

      {skills.length === 0 ? (
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <p className="text-base-content/70">
              {query ? "No skills match your search." : "No public skills yet — be the first."}
            </p>
            {query ? (
              <Link href="/skills" className="btn btn-ghost btn-sm mt-2">
                Clear search
              </Link>
            ) : (
              <Link href="/dashboard/skills/new" className="btn btn-primary btn-sm mt-2">
                Create a Skill
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              className="card bg-base-200 shadow-xl hover:bg-base-300 transition-colors"
            >
              <div className="card-body">
                <h2 className="card-title text-lg">{skill.name}</h2>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {skill.description}
                </p>
                <div className="flex justify-between mt-4 text-xs text-base-content/50">
                  <span>by {skill.author.name}</span>
                  <span>{skill.createdAt.toLocaleDateString("en-US")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
