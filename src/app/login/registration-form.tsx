"use client";

import { useActionState } from "react";
import { AtSign, LockKeyhole, UserRound } from "lucide-react";
import { createAccount } from "./actions";
import styles from "./login.module.css";

export function RegistrationForm({ initialMessage }: { initialMessage?: string }) {
  const [state, action, pending] = useActionState(createAccount, initialMessage ? { message: initialMessage } : undefined);

  return (
    <>
      <form className={styles.loginForm} action={action}>
        <label htmlFor="name">Full name</label>
        <span className={styles.inputWrap}><UserRound size={17} /><input id="name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} placeholder="Your name" required /></span>
        <label htmlFor="email">School email</label>
        <span className={styles.inputWrap}><AtSign size={17} /><input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="name@school.edu" required /></span>
        <label htmlFor="password">Password</label>
        <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} placeholder="At least 10 characters" required /></span>
        <label htmlFor="password_confirmation">Confirm password</label>
        <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" minLength={10} maxLength={128} placeholder="Enter your password again" required /></span>
        <button className={styles.submitButton} type="submit" disabled={pending}>{pending ? "Creating account…" : "Create student account"}</button>
      </form>
      {state?.message && <p className={styles.formMessage} role="status">{state.message}</p>}
    </>
  );
}