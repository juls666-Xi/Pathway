"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { updatePassword } from "./actions";
import styles from "./login.module.css";

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <>
      <form className={styles.loginForm} action={action}>
        <label htmlFor="password">New password</label>
        <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></span>
        <label htmlFor="password_confirmation">Confirm new password</label>
        <span className={styles.inputWrap}><LockKeyhole size={17} /><input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></span>
        <button className={styles.submitButton} type="submit" disabled={pending}>{pending ? "Updating password…" : "Update password"}</button>
      </form>
      {state?.message && <p className={styles.formMessage} role="status">{state.message}</p>}
    </>
  );
}