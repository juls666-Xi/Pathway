import { notFound } from "next/navigation";
import { requireAuthenticatedUser, requirePermission, requireRole } from "@/lib/auth";
import { ROLE_ROUTES, roleForPath } from "@/lib/role-routes";

export default async function ProtectedSection({ params }: PageProps<"/[role]/[section]">) {
  const { role: rolePath, section: sectionSlug } = await params;
  const role = roleForPath(rolePath);
  if (!role) notFound();

  const user = await requireAuthenticatedUser();
  if (user.role !== role) {
    await requireRole([role]);
  }

  const section = ROLE_ROUTES[role].sections.find(({ slug }) => slug === sectionSlug);
  if (!section) notFound();
  if (section.permission) await requirePermission(section.permission);

  return (
    <>
      <p className="secure-eyebrow">{ROLE_ROUTES[role].label.toUpperCase()} PORTAL</p>
      <h1>{section.label}</h1>
      <p className="secure-intro">{section.description}</p>
      <section className="secure-empty-state">
        <h2>Connected account required</h2>
        <p>This protected area is ready for school records. No preview or sample student data is shown here.</p>
      </section>
    </>
  );
}