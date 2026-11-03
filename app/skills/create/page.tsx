import { redirect } from "next/navigation";

// Skill creation lives in the dashboard
export default function NewSkillPage() {
    redirect("/dashboard/skills/new");
}
