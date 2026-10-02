import Link from "next/link";
import { AuthLayout } from "../auth-layout";
import { PasswordResetRequestForm } from "../password-reset-request-form";
import styles from "../login.module.css";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      kicker="ACCOUNT RECOVERY"
      title={<>Let’s get you<br /><em>back on track.</em></>}
      description="Request a secure password reset link using the email on your school account."
    >
      <p className={styles.formKicker}>PASSWORD HELP</p>
      <h2>Forgot your password?</h2>
      <p className={styles.formIntro}>We’ll send a reset link if an account matches that email.</p>
      <PasswordResetRequestForm />
      <div className={styles.formFooter}><Link href="/login">Back to sign in</Link></div>
    </AuthLayout>
  );
}