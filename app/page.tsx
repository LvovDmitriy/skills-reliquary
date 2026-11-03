import { Suspense } from "react";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

async function getLandingData() {
  "use cache";
  cacheLife("minutes");

  const [skillCount, authorCount, recentSkills] = await Promise.all([
    prisma.skill.count({ where: { isPublic: true } }),
    prisma.user.count({ where: { skills: { some: { isPublic: true } } } }),
    prisma.skill.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  return { skillCount, authorCount, recentSkills };
}

const features = [
  {
    icon: "🔎",
    title: "Discover",
    text: "Browse skills other people have written for their agents and reuse what already works.",
  },
  {
    icon: "✍️",
    title: "Write",
    text: "Capture a workflow once — instructions, steps, conventions — as a plain-text skill.",
  },
  {
    icon: "🔒",
    title: "Share or keep private",
    text: "Publish a skill for everyone, or keep it private in your own dashboard.",
  },
];

const steps = [
  { title: "Create an account", text: "Sign up in seconds — no setup required." },
  { title: "Write a skill", text: "Give it a name, a short description, and the instructions." },
  { title: "Use it anywhere", text: "Copy the skill into your agent of choice or share the link." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 lg:py-28 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="badge badge-primary badge-outline mb-6">
              A library of reusable agent skills
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Teach your AI agents{" "}
              <span className="text-primary">once</span>. Reuse everywhere.
            </h1>
            <p className="mt-6 text-lg text-base-content/70 max-w-xl">
              Skills Reliquary is a place to write, collect, and share the
              instructions that make AI agents good at specific jobs — from code
              review checklists to release workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/skills" className="btn btn-primary btn-lg">
                Browse Skills
              </Link>
              <Link href="/dashboard/skills/new" className="btn btn-outline btn-lg">
                Share a Skill
              </Link>
            </div>
          </div>

          <div className="mockup-code bg-base-200 text-sm shadow-xl">
            <pre data-prefix="1"><code className="text-primary">---</code></pre>
            <pre data-prefix="2"><code>name: code-review</code></pre>
            <pre data-prefix="3"><code>description: Review a diff for bugs</code></pre>
            <pre data-prefix="4"><code className="text-primary">---</code></pre>
            <pre data-prefix="5"><code></code></pre>
            <pre data-prefix="6"><code className="text-secondary"># Code review</code></pre>
            <pre data-prefix="7"><code></code></pre>
            <pre data-prefix="8"><code>1. Read the full diff first.</code></pre>
            <pre data-prefix="9"><code>2. Flag correctness issues before style.</code></pre>
            <pre data-prefix="10"><code>3. Cite every finding as file:line.</code></pre>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 max-w-6xl">
        <Suspense fallback={<StatsSkeleton />}>
          <Stats />
        </Suspense>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything a skill needs, nothing it doesn&apos;t
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card bg-base-200">
              <div className="card-body">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="text-base-content/70">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-base-200 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <ul className="steps steps-vertical md:steps-horizontal w-full">
            {steps.map((step) => (
              <li key={step.title} className="step step-primary">
                <div className="text-left md:text-center px-4">
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-base-content/70">{step.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent skills */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold">Recently shared</h2>
          <Link href="/skills" className="link link-primary">
            View all →
          </Link>
        </div>
        <Suspense fallback={<RecentSkillsSkeleton />}>
          <RecentSkills />
        </Suspense>
      </section>

      {/* Call to action */}
      <section className="container mx-auto px-4 pb-20 max-w-6xl">
        <div className="card bg-primary text-primary-content">
          <div className="card-body items-center text-center py-12">
            <h2 className="card-title text-3xl">Got a workflow worth sharing?</h2>
            <p className="max-w-xl opacity-90">
              Turn it into a skill and help other people&apos;s agents do it right
              the first time.
            </p>
            <div className="card-actions mt-4">
              <Link href="/register" className="btn btn-neutral">
                Get started — it&apos;s free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

async function Stats() {
  const { skillCount, authorCount } = await getLandingData();

  return (
    <div className="stats stats-vertical sm:stats-horizontal w-full bg-base-200 shadow">
      <div className="stat place-items-center">
        <div className="stat-title">Public skills</div>
        <div className="stat-value text-primary">{skillCount}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Authors</div>
        <div className="stat-value">{authorCount}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">Price</div>
        <div className="stat-value">Free</div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return <div className="skeleton h-28 w-full" />;
}

async function RecentSkills() {
  const { recentSkills } = await getLandingData();

  if (recentSkills.length === 0) {
    return (
      <div className="card bg-base-200">
        <div className="card-body items-center text-center">
          <p className="text-base-content/70">No public skills yet — be the first.</p>
          <Link href="/dashboard/skills/new" className="btn btn-primary btn-sm mt-2">
            Create a Skill
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recentSkills.map((skill) => (
        <Link
          key={skill.id}
          href={`/skills/${skill.id}`}
          className="card bg-base-200 hover:bg-base-300 transition-colors"
        >
          <div className="card-body">
            <h3 className="card-title text-lg">{skill.name}</h3>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {skill.description}
            </p>
            <p className="text-xs text-base-content/50 mt-2">by {skill.author.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function RecentSkillsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton h-36 w-full" />
      ))}
    </div>
  );
}
