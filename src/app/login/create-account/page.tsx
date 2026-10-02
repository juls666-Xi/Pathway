import Link from "next/link";
import { AuthLayout } from "../auth-layout";
import { RegistrationForm } from "../registration-form";
import styles from "../login.module.css";

export default async function CreateAccountPage({ searchParams }: PageProps<"/login/create-account">) {
  const query = await searchParams;

  return (
    <AuthLayout
      kicker="JOIN OUR SCHOOL COMMUNITY"
      title={<>A new chapter<br /><em>starts here.</em></>}
      description="Create a student account to request access to the San Bartolome learning portal."
    >
      <p className={styles.formKicker}>STUDENT REGISTRATION</p>
      <h2>Create your account</h2>
      <p className={styles.formIntro}>Registration is reviewed by the school before portal access is enabled.</p>
      <RegistrationForm initialMessage={query.pending === "1" ? "Email confirmed. Your account is waiting for school approval before portal access is enabled." : undefined} />
      <div className={styles.formFooter}><span>Already have an account?</span><Link href="/login">Sign in</Link></div>
    </AuthLayout>
  );
}