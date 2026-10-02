import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { ROLE_ROUTES, roleForPath, visibleSections } from "@/lib/role-routes";

export default async function RoleDashboard({ params }: PageProps<"/[role]">) {
  const { role: rolePath } = await params;
  const role = roleForPath(rolePath);
  if (!role) notFound();

  const user = await requireRole([role]);
  const config = ROLE_ROUTES[role];
  const sections = visibleSections(role, user.permissions.map(({ permission }) => permission));

  return (
    <>
      <p className="secure-eyebrow">{config.label.toUpperCase()} PORTAL</p>
      <h1>Welcome, {user.name}</h1>
      <p className="secure-intro">Your school workspace and the features available to your account.</p>
      <section className="secure-section-grid" aria-label={`${config.label} features`}>
        {sections.map((section) => (
          <Link className="secure-section-link" href={`/${config.path}/${section.slug}`} key={section.slug}>
            <span><strong>{section.label}</strong><small>{section.description}</small></span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </section>
    </>
  );
}