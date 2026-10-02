import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import styles from "./home.module.css";

const announcements = [
  { date: "SCHOOL", label: "School update", title: "School calendar updates from the school office" },
  { date: "CAMPUS", label: "Community", title: "Campus notices and upcoming school activities" },
  { date: "NEWS", label: "Campus life", title: "Stories and updates from our school community" },
];

export default function Home() {
  return (
    <main className={styles.site}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="San Bartolome High School homepage">
          <span className={styles.brandMark}><BookOpen size={21} /></span>
          <span><strong>San Bartolome</strong><small>HIGH SCHOOL</small></span>
        </Link>
        <nav className={styles.nav} aria-label="Public navigation">
          <a href="#announcements">Announcements</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link className={styles.loginLink} href="/login">Log in <ArrowUpRight size={15} /></Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /> SCHOOL YEAR 2026–2027 <span className={styles.eyebrowDivider}>/</span> SAN BARTOLOME, PHILIPPINES</p>
          <h1>San Bartolome<br />High School<span>.</span></h1>
          <p className={styles.heroText}>A community where curiosity takes root, learning finds its purpose, and every student can shape what comes next.</p>
          <div className={styles.heroActions}><Link className={styles.primaryLink} href="/login">School portal <ArrowRight size={16} /></Link><a className={styles.secondaryLink} href="#about">Discover our school <ArrowDown size={15} /></a></div>
        </div>
        <div className={styles.heroArt} aria-label="Illustration of the school campus" role="img">
          <div className={styles.artSun} /><div className={styles.artSkyline}><i /><i /><i /><i /><i /></div>
          <div className={styles.artCanopy} />
          <div className={styles.artBuilding}><span className={styles.artRoof} /><span className={styles.artFacade}><i /><i /><i /><i /><i /><i /><b /></span><span className={styles.artSteps} /></div>
          <div className={styles.artPath} /><span className={styles.artCaption}>A PLACE TO GROW</span><span className={styles.artNumber}>01 <i /> 03</span>
        </div>
        <a className={styles.scrollCue} href="#announcements"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </section>

      <section className={styles.announcementSection} id="announcements">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FROM OUR SCHOOL</p><h2>Announcements <span>&amp; updates</span></h2></div><span className={styles.issue}>PUBLIC BULLETIN <b>·</b> 2026</span></div>
        <div className={styles.announcementList}>{announcements.map((item) => <article className={styles.announcement} key={item.title}><time>{item.date}</time><span className={styles.announcementLabel}>{item.label}</span><h3>{item.title}</h3><ArrowUpRight className={styles.announcementArrow} size={17} aria-hidden="true" /></article>)}</div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutMark}>S<span>.</span>B<span>.</span>H<span>.</span>S</div>
        <div className={styles.aboutCopy}><p className={styles.eyebrow}>ABOUT THE SCHOOL</p><h2>Rooted in community.<br /><em>Ready for the future.</em></h2><p>San Bartolome High School brings learners, educators, and families together around thoughtful teaching and a strong sense of belonging. We help young people build the knowledge and confidence to contribute to their communities.</p><Link href="/login">For our school community <ArrowRight size={15} /></Link></div>
      </section>

      <footer className={styles.footer} id="contact">
        <Link className={styles.footerBrand} href="/"><BookOpen size={19} /><span>San Bartolome High School</span></Link>
        <p><MapPin size={14} /> San Bartolome, Philippines</p>
        <span className={styles.footerContact}>For school inquiries, please contact the school office.</span>
        <span className={styles.copyright}>© 2026 San Bartolome High School</span>
      </footer>
    </main>
  );
}
