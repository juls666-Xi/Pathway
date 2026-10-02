"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AtSign,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
} from "lucide-react";
import styles from "./login.module.css";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.loginShell}>
      <section className={styles.welcomePanel}>
        <Link className={styles.brand} href="/" aria-label="San Bartolome High School home">
          <span className={styles.brandMark}><GraduationCap size={23} /></span>
          <span className={styles.brandCopy}><strong>San Bartolome</strong><small>HIGH SCHOOL</small></span>
        </Link>

        <div className={styles.welcomeContent}>
          <p className={styles.kicker}>STUDENT LEARNING PORTAL</p>
          <h1>Make room for<br /><em>what’s next.</em></h1>
          <p className={styles.welcomeText}>Your classes, assignments, and progress, together in one learning space.</p>
          <div className={styles.studyArt} aria-hidden="true">
            <span className={styles.artGrid} />
            <span className={styles.artBook}><BookOpen size={58} strokeWidth={1.15} /></span>
            <span className={styles.artBookmark} />
            <span className={styles.artLine} />
            <span className={styles.artDot} />
            <span className={styles.artCaption}>LEARN · GROW · LEAD</span>
          </div>
        </div>

        <footer className={styles.welcomeFooter}><span>School year 2026–2027</span><span>San Bartolome, Philippines</span></footer>
      </section>

      <section className={styles.formPanel} aria-labelledby="login-heading">
        <div className={styles.formWrap}>
          <p className={styles.formKicker}>WELCOME BACK</p>
          <h2 id="login-heading">Sign in to continue</h2>
          <p className={styles.formIntro}>Use your school account to enter the learning portal.</p>

          <form className={styles.loginForm} action={action}>
            <label htmlFor="email">School email</label>
            <span className={styles.inputWrap}><AtSign size={17} /><input id="email" name="email" type="email" autoComplete="username" placeholder="name@school.edu" required /></span>

            <div className={styles.passwordLabel}><label htmlFor="password">Password</label><span>School account</span></div>
            <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required /><button className={styles.revealButton} type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>

            <button className={styles.submitButton} type="submit" disabled={pending}>{pending ? "Signing in…" : "Continue to portal"}</button>
          </form>

          {state?.message && <p className={styles.formMessage} role="alert">{state.message}</p>}
          <div className={styles.formFooter}><span>Need help accessing your account? Contact the school office.</span></div>
        </div>
        <p className={styles.legalNote}>For San Bartolome High School students and staff</p>
      </section>
    </main>
  );
}