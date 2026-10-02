"use client";

import { useActionState } from "react";
import { AtSign } from "lucide-react";
import { requestPasswordReset } from "./actions";
import styles from "./login.module.css";

export function PasswordResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <>
      <form className={styles.loginForm} action={action}>
        <label htmlFor="email">School email</label>
        <span className={styles.inputWrap}><AtSign size={17} /><input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="name@school.edu" required /></span>
        <button className={styles.submitButton} type="submit" disabled={pending}>{pending ? "Sending link…" : "Send reset link"}</button>
      </form>
      {state?.message && <p className={styles.formMessage} role="status">{state.message}</p>}
    </>
  );
}