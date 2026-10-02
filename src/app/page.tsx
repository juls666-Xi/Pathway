"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, BookOpen, CalendarDays, Check, ChevronDown,
  CircleHelp, ClipboardCheck, Clock3, GraduationCap, LayoutDashboard, LogOut, Menu,
  MessageSquareText, Search, Send, X,
} from "lucide-react";

type View = "Overview" | "My classes" | "Assignments" | "Grades";
type Course = { code: string; name: string; teacher: string; room: string; progress: number; color: string; mark: string };
type Assignment = { id: number; title: string; course: string; due: string; date: string; kind: string; status: "To do" | "In progress" | "Submitted" };

const courses: Course[] = [
  { code: "ENG 10", name: "English", teacher: "Ms. Reyes", room: "Room 204", progress: 78, color: "coral", mark: "E" },
  { code: "SCI 10", name: "Science", teacher: "Mr. Dela Cruz", room: "Lab 2", progress: 64, color: "mint", mark: "S" },
  { code: "MAT 10", name: "Mathematics", teacher: "Ms. Santos", room: "Room 301", progress: 82, color: "blue", mark: "M" },
  { code: "FIL 10", name: "Filipino", teacher: "Gng. Bautista", room: "Room 105", progress: 71, color: "yellow", mark: "F" },
];

const initialAssignments: Assignment[] = [
  { id: 1, title: "The story behind a place", course: "English", due: "Oct 5", date: "MON", kind: "Writing task", status: "In progress" },
  { id: 2, title: "Ecosystems field notes", course: "Science", due: "Oct 6", date: "TUE", kind: "Classwork", status: "To do" },
  { id: 3, title: "Linear equations · practice 4", course: "Mathematics", due: "Oct 8", date: "THU", kind: "Practice", status: "To do" },
  { id: 4, title: "Talasalitaan: kabanata 2", course: "Filipino", due: "Oct 9", date: "FRI", kind: "Reading", status: "Submitted" },
];

const navItems: { label: View; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "My classes", icon: BookOpen },
  { label: "Assignments", icon: ClipboardCheck }, { label: "Grades", icon: GraduationCap },
];

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="section-heading"><h2>{title}</h2>{action && <button className="text-action" onClick={onAction}>{action}<ArrowRight size={15} /></button>}</div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function changeView(view: View) { setActiveView(view); setMenuOpen(false); }
  function submitAssignment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAssignment) return;
    setAssignments((current) => current.map((assignment) => assignment.id === selectedAssignment.id ? { ...assignment, status: "Submitted" } : assignment));
    setSelectedAssignment(null);
    setNotice("Submitted in preview mode. Connect PostgreSQL to save real submissions.");
    window.setTimeout(() => setNotice(""), 4500);
  }

  const visibleCourses = courses.filter((course) => `${course.name} ${course.code} ${course.teacher}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const visibleAssignments = assignments.filter((assignment) => `${assignment.title} ${assignment.course}`.toLowerCase().includes(searchTerm.toLowerCase()));

  return <div className="portal-shell">
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <a className="school-brand" href="#home" onClick={() => changeView("Overview")}><span className="brand-mark"><GraduationCap size={22} /></span><span className="brand-copy"><strong>San Bartolome</strong><small>HIGH SCHOOL</small></span></a>
      <div className="term-picker"><span className="term-dot" /><span><small>School year</small><strong>2026–2027</strong></span><ChevronDown size={15} /></div>
      <p className="nav-label">LEARNING SPACE</p>
      <nav className="primary-nav" aria-label="Main navigation">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeView === label ? "nav-item-active" : ""}`} onClick={() => changeView(label)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "Assignments" && <span className="nav-count">3</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><div className="note-icon"><MessageSquareText size={17} /></div><strong>Need a hand?</strong><p>Your adviser is one message away.</p><button onClick={() => setNotice("Messaging will be available when school accounts are connected.")}>Ask for help <ArrowRight size={14} /></button></div>
        <button className="profile-button" onClick={() => setNotice("Student profile preview · Grade 10, Section Sampaguita.")}><span className="avatar">AM</span><span className="profile-copy"><strong>Angela Mendoza</strong><small>Grade 10 · Sampaguita</small></span><ChevronDown size={15} /></button></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

    <main className="main-area" id="home">
      <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="breadcrumb"><span>Student portal</span><span className="breadcrumb-slash">/</span><strong>{activeView}</strong></div><div className="topbar-actions">
        {searchOpen ? <label className="search-field"><Search size={16} /><input autoFocus placeholder="Search this page" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /><button className="icon-button search-close" aria-label="Close search" onClick={() => { setSearchOpen(false); setSearchTerm(""); }}><X size={15} /></button></label> : <button className="icon-button" aria-label="Search" title="Search" onClick={() => setSearchOpen(true)}><Search size={19} /></button>}
        <span className="topbar-divider" /><Link className="icon-button" href="/login" aria-label="Sign out or switch account" title="Sign out or switch account"><LogOut size={17} /></Link><span className="preview-label"><span />Preview data</span><button className="avatar avatar-small" aria-label="Student profile" onClick={() => setNotice("Student profile preview · Grade 10, Section Sampaguita.")}>AM</button></div></header>

      <div className="page-content">
        {activeView === "Overview" && <>
          <section className="welcome-row"><div><p className="eyebrow">FRIDAY, OCTOBER 2, 2026 <span>·</span> WEEK 6</p><h1>Good morning, Angela<span className="period">.</span></h1><p className="welcome-subtitle">A fresh week of learning is taking shape. Here’s your space.</p></div><div className="streak"><span className="streak-spark">✳</span><span><strong>4 day streak</strong><small>You’re building a rhythm</small></span></div></section>
          <section className="focus-banner" aria-label="Weekly focus"><div className="focus-copy"><p className="focus-kicker"><span /> THIS WEEK</p><h2>Small steps add up.</h2><p>You have <strong>{assignments.filter((item) => item.status !== "Submitted").length} assignments</strong> coming up. Pick one and make a start.</p><button className="focus-button" onClick={() => changeView("Assignments")}>See what’s due <ArrowRight size={16} /></button></div><div className="focus-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="art-sun" /><span className="art-leaf leaf-one" /><span className="art-leaf leaf-two" /><span className="art-page"><BookOpen size={39} strokeWidth={1.25} /></span><span className="art-star">✳</span></div><span className="banner-index">01 <span>/ 03</span></span></section>
          <section className="stats-row" aria-label="Your learning at a glance"><div className="stat-item"><span className="stat-icon stat-lilac"><CalendarDays size={18} /></span><span className="stat-copy"><small>Due this week</small><strong>3 <span>tasks</span></strong></span><span className="stat-note">Next: Mon, Oct 5</span></div><div className="stat-item"><span className="stat-icon stat-green"><Check size={18} /></span><span className="stat-copy"><small>Turned in</small><strong>8 <span>of 11</span></strong></span><span className="stat-note">You’re keeping pace</span></div><div className="stat-item"><span className="stat-icon stat-yellow"><ArrowDownRight size={18} /></span><span className="stat-copy"><small>Class average</small><strong>86<span>%</span></strong></span><span className="stat-note">Across 4 subjects</span></div></section>
          <div className="dashboard-grid"><section className="content-section"><SectionHeading title="Your classes" action="All classes" onAction={() => changeView("My classes")} /><div className="course-list">{courses.slice(0, 3).map((course) => <CourseRow key={course.code} course={course} onClick={() => changeView("My classes")} />)}</div></section><section className="content-section"><SectionHeading title="Coming up" action="All assignments" onAction={() => changeView("Assignments")} /><div className="assignment-list">{assignments.slice(0, 3).map((assignment) => <AssignmentRow key={assignment.id} assignment={assignment} onClick={() => setSelectedAssignment(assignment)} />)}</div></section></div>
          <footer className="page-footer"><span>San Bartolome High School <span className="footer-dot">·</span> Learning together, growing together</span><button onClick={() => setNotice("For portal support, please contact your class adviser.")}><CircleHelp size={14} /> Support</button></footer>
        </>}

        {activeView === "My classes" && <><PageIntro eyebrow="YOUR LEARNING SPACE" title="My classes" subtitle="The people, places, and ideas you’ll meet this year." /><section className="class-grid">{visibleCourses.map((course) => <CourseCard key={course.code} course={course} />)}{visibleCourses.length === 0 && <p className="empty-state">No classes match “{searchTerm}”.</p>}</section><footer className="page-footer"><span>San Bartolome High School <span className="footer-dot">·</span> Learning together, growing together</span></footer></>}

        {activeView === "Assignments" && <><PageIntro eyebrow="YOUR WORK, AT YOUR PACE" title="Assignments" subtitle="Keep an eye on what’s coming up and celebrate what you’ve finished." /><div className="filter-bar"><span><CalendarDays size={16} /> October 2026</span><div><button className="filter-chip filter-chip-active">All work</button><button className="filter-chip" onClick={() => setSearchTerm("")}>This week</button></div></div><section className="full-assignment-list">{visibleAssignments.map((assignment) => <AssignmentRow key={assignment.id} assignment={assignment} onClick={() => setSelectedAssignment(assignment)} />)}{visibleAssignments.length === 0 && <p className="empty-state">No assignments match “{searchTerm}”.</p>}</section><footer className="page-footer"><span>San Bartolome High School <span className="footer-dot">·</span> Learning together, growing together</span></footer></>}

        {activeView === "Grades" && <><PageIntro eyebrow="A LOOK AT YOUR PROGRESS" title="Grades & progress" subtitle="Every step counts. Here’s how your work is adding up this term." /><section className="grade-summary"><div className="grade-number"><span>TERM AVERAGE</span><strong>86<small>%</small></strong><p>Great consistency this term</p></div><div className="grade-bars">{courses.map((course, index) => <div className="grade-line" key={course.code}><span className={`course-mark mark-${course.color}`}>{course.mark}</span><span className="grade-course-name">{course.name}</span><span className="grade-track"><i style={{ width: `${[88, 82, 90, 84][index]}%` }} className={`bar-${course.color}`} /></span><strong>{[88, 82, 90, 84][index]}%</strong></div>)}</div></section><section className="grade-note"><span className="note-icon"><MessageSquareText size={18} /></span><div><strong>Feedback makes the difference.</strong><p>Open a class to review teacher feedback on your recent work.</p></div><button className="text-action" onClick={() => changeView("My classes")}>View classes <ArrowRight size={15} /></button></section><footer className="page-footer"><span>San Bartolome High School <span className="footer-dot">·</span> Learning together, growing together</span></footer></>}
      </div>
    </main>

    {selectedAssignment && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedAssignment(null); }}><section className="assignment-modal" role="dialog" aria-modal="true" aria-labelledby="assignment-title"><div className="modal-top"><span className="modal-tag">{selectedAssignment.course} · {selectedAssignment.kind}</span><button className="icon-button" aria-label="Close assignment" onClick={() => setSelectedAssignment(null)}><X size={19} /></button></div><h2 id="assignment-title">{selectedAssignment.title}</h2><p className="modal-due"><Clock3 size={15} /> Due {selectedAssignment.due}, 2026</p><p className="modal-description">Share what you noticed, wondered about, or learned. Your teacher will review your work in class.</p>{selectedAssignment.status === "Submitted" ? <div className="submitted-state"><Check size={18} /> Already submitted</div> : <form onSubmit={submitAssignment}><label htmlFor="response">Your response</label><textarea id="response" required minLength={3} placeholder="Start writing here…" /><div className="modal-actions"><span>Preview only · not saved to a school account</span><button className="submit-button" type="submit">Submit work <Send size={15} /></button></div></form>}</section></div>}
    {notice && <div className="toast" role="status"><Check size={17} />{notice}<button className="icon-button" aria-label="Dismiss message" onClick={() => setNotice("")}><X size={15} /></button></div>}
  </div>;
}

function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) { return <section className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}<span className="period">.</span></h1><p className="welcome-subtitle">{subtitle}</p></section>; }
function CourseRow({ course, onClick }: { course: Course; onClick: () => void }) { return <button className="course-row" onClick={onClick}><span className={`course-mark mark-${course.color}`}>{course.mark}</span><span className="course-main"><strong>{course.name}</strong><small>{course.teacher} <span>·</span> {course.room}</small></span><span className="course-progress"><span><i style={{ width: `${course.progress}%` }} className={`bar-${course.color}`} /></span><small>{course.progress}%</small></span><ArrowRight className="row-arrow" size={16} /></button>; }
function CourseCard({ course }: { course: Course }) { return <article className="course-card"><div className={`course-card-art art-${course.color}`}><span className={`course-mark mark-${course.color}`}>{course.mark}</span><BookOpen size={43} strokeWidth={1.2} /><span className="course-code">{course.code}</span></div><div className="course-card-body"><p className="course-card-code">{course.code} <span>·</span> GRADE 10</p><h2>{course.name}</h2><p className="course-teacher">{course.teacher} <span>·</span> {course.room}</p><div className="card-progress-label"><span>Term progress</span><strong>{course.progress}%</strong></div><span className="course-progress-track"><i style={{ width: `${course.progress}%` }} className={`bar-${course.color}`} /></span></div></article>; }
function AssignmentRow({ assignment, onClick }: { assignment: Assignment; onClick: () => void }) { return <button className="assignment-row" onClick={onClick}><span className="due-date"><strong>{assignment.date}</strong><span>{assignment.due}</span></span><span className="assignment-main"><strong>{assignment.title}</strong><small>{assignment.course} <span>·</span> {assignment.kind}</small></span><span className={`status-pill status-${assignment.status.toLowerCase().replace(" ", "-")}`}>{assignment.status === "Submitted" && <Check size={12} />}{assignment.status}</span><ArrowRight className="row-arrow" size={16} /></button>; }
