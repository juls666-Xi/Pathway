import { redirect } from "next/navigation";
import { AuthLayout } from "../auth-layout";
import { UpdatePasswordForm } from "../update-password-form";
import styles from "../login.module.css";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login/forgot-password");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login/forgot-password");

  return (
    <AuthLayout
      kicker="SECURE ACCOUNT RECOVERY"
      title={<>Choose a new<br /><em>password.</em></>}
      description="Set a new password for your San Bartolome school account."
    >
      <p className={styles.formKicker}>PASSWORD RESET</p>
      <h2>Set a new password</h2>
      <p className={styles.formIntro}>Use at least 10 characters. You’ll need to sign in again afterward.</p>
      <UpdatePasswordForm />
    </AuthLayout>
  );
}