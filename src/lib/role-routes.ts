import type { UserRole } from "@prisma/client";

export type RoleSection = {
  slug: string;
  label: string;
  description: string;
  permission?: string;
};

export const ROLE_ROUTES: Record<UserRole, { path: string; label: string; sections: RoleSection[] }> = {
  STUDENT: {
    path: "student",
    label: "Student",
    sections: [
      { slug: "profile", label: "My profile", description: "Your school account profile." },
      { slug: "courses", label: "Subjects & courses", description: "Courses and class resources assigned to you." },
      { slug: "schedule", label: "Class schedule", description: "Your current class schedule." },
      { slug: "assignments", label: "Assignments", description: "Work assigned in your enrolled classes." },
      { slug: "materials", label: "Learning materials", description: "Resources shared with your classes." },
      { slug: "grades", label: "Grades & records", description: "Your academic records and teacher feedback." },
      { slug: "attendance", label: "Attendance", description: "Your attendance record." },
      { slug: "announcements", label: "Announcements", description: "Updates intended for students." },
      { slug: "notifications", label: "Notifications", description: "Updates for your school account." },
    ],
  },
  TEACHER: {
    path: "teacher",
    label: "Teacher",
    sections: [
      { slug: "profile", label: "My profile", description: "Your school account profile." },
      { slug: "classes", label: "Assigned classes", description: "Classes assigned to your account." },
      { slug: "students", label: "Class students", description: "Student rosters for your assigned classes." },
      { slug: "materials", label: "Learning materials", description: "Manage resources for your classes." },
      { slug: "assignments", label: "Assignments", description: "Create and review class assignments." },
      { slug: "grades", label: "Grade management", description: "Review work and manage class grades." },
      { slug: "attendance", label: "Attendance", description: "Manage attendance for assigned classes." },
      { slug: "announcements", label: "Class announcements", description: "Share updates with your classes." },
      { slug: "notifications", label: "Notifications", description: "Updates for your school account." },
    ],
  },
  STAFF: {
    path: "staff",
    label: "Staff",
    sections: [
      { slug: "profile", label: "My profile", description: "Your school account profile." },
      { slug: "students", label: "Student information", description: "Records allowed by your assigned permissions.", permission: "STUDENT_RECORDS_READ" },
      { slug: "announcements", label: "Announcements", description: "Manage public school announcements when permitted.", permission: "ANNOUNCEMENTS_MANAGE" },
      { slug: "operations", label: "School operations", description: "Operational tools allowed for your account.", permission: "OPERATIONS_ACCESS" },
    ],
  },
  ADMIN: {
    path: "admin",
    label: "Administrator",
    sections: [
      { slug: "users", label: "User management", description: "Manage school user accounts and status." },
      { slug: "students", label: "Students", description: "Manage student accounts and records." },
      { slug: "teachers", label: "Teachers", description: "Manage teacher accounts and assignments." },
      { slug: "staff", label: "Staff", description: "Manage staff accounts and permissions." },
      { slug: "courses", label: "Courses & subjects", description: "Manage school courses and subjects." },
      { slug: "classes", label: "Classes", description: "Manage class sections and rosters." },
      { slug: "announcements", label: "Announcements", description: "Manage public and role-specific announcements." },
      { slug: "settings", label: "System settings", description: "Manage school portal configuration." },
      { slug: "reports", label: "Reports", description: "Review school operational and academic reports." },
      { slug: "permissions", label: "Roles & permissions", description: "Manage role assignments and staff access." },
    ],
  },
};

export function roleForPath(path: string): UserRole | undefined {
  return (Object.keys(ROLE_ROUTES) as UserRole[]).find((role) => ROLE_ROUTES[role].path === path);
}

export function visibleSections(role: UserRole, permissions: string[]) {
  return ROLE_ROUTES[role].sections.filter((section) =>
    !section.permission || role === "ADMIN" || permissions.includes(section.permission),
  );
}