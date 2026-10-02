import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import styles from "./login.module.css";

type AuthLayoutProps = {
  kicker: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ kicker, title, description, children }: AuthLayoutProps) {
  return (
    <main className={styles.loginShell}>
      <section className={styles.welcomePanel}>
        <Link className={styles.brand} href="/" aria-label="San Bartolome High School home">
          <span className={styles.brandMark}><GraduationCap size={23} /></span>
          <span className={styles.brandCopy}><strong>San Bartolome</strong><small>HIGH SCHOOL</small></span>
        </Link>
        <div className={styles.welcomeContent}>
          <p className={styles.kicker}>{kicker}</p>
          <h1>{title}</h1>
          <p className={styles.welcomeText}>{description}</p>
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
      <section className={styles.formPanel}>
        <div className={styles.formWrap}>{children}</div>
        <p className={styles.legalNote}>For San Bartolome High School students and staff</p>
      </section>
    </main>
  );
}
