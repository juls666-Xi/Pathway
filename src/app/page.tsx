import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth";
import { ROLE_ROUTES } from "@/lib/role-routes";

export default async function Home() {
  const user = await requireAuthenticatedUser();
  redirect(`/${ROLE_ROUTES[user.role].path}`);
}
