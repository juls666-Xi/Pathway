import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";
import { requireAuthenticatedUser } from "@/lib/auth";
import { ROLE_ROUTES, visibleSections } from "@/lib/role-routes";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const user = await requireAuthenticatedUser();
  const role = ROLE_ROUTES[user.role];
  const sections = visibleSections(user.role, user.permissions.map(({ permission }) => permission));

  return (
    <div className="secure-shell">
      <header className="secure-header">
        <Link className="secure-brand" href={`/${role.path}`}>
          <span className="secure-brand-mark"><GraduationCap size={21} /></span>
          <span><strong>San Bartolome</strong><small>{role.label} portal</small></span>
        </Link>
        <nav className="secure-nav" aria-label={`${role.label} navigation`}>
          <Link href={`/${role.path}`}>Dashboard</Link>
          {sections.map((section) => <Link key={section.slug} href={`/${role.path}/${section.slug}`}>{section.label}</Link>)}
        </nav>
        <div className="secure-account">
          <span>{user.name}</span>
          <form action={logout}>
            <button className="secure-logout" type="submit"><LogOut size={15} /> Log out</button>
          </form>
        </div>
      </header>
      <main className="secure-content">{children}</main>
    </div>
  );
}