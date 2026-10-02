"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AtSign, Eye, EyeOff, LockKeyhole } from "lucide-react";
import styles from "./login.module.css";
import { login } from "./actions";
import { AuthLayout } from "./auth-layout";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      kicker="STUDENT LEARNING PORTAL"
      title={<>Make room for<br /><em>what’s next.</em></>}
      description="Your classes, assignments, and progress, together in one learning space."
    >
      <p className={styles.formKicker}>WELCOME BACK</p>
      <h2 id="login-heading">Sign in to continue</h2>
      <p className={styles.formIntro}>Use your school account to enter the learning portal.</p>
      <form className={styles.loginForm} action={action}>
        <label htmlFor="email">School email</label>
        <span className={styles.inputWrap}><AtSign size={17} /><input id="email" name="email" type="email" autoComplete="username" placeholder="name@school.edu" required /></span>
        <div className={styles.passwordLabel}><label htmlFor="password">Password</label><Link href="/login/forgot-password">Forgot password?</Link></div>
        <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required /><button className={styles.revealButton} type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
        <button className={styles.submitButton} type="submit" disabled={pending}>{pending ? "Signing in…" : "Continue to portal"}</button>
      </form>
      {state?.message && <p className={styles.formMessage} role="alert">{state.message}</p>}
      <div className={styles.formFooter}><span>New to the portal?</span><Link href="/login/create-account">Create a student account</Link></div>
    </AuthLayout>
  );
}