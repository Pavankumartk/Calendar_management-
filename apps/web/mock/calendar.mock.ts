export const mockCalendars = [
  /*
    UNIVERSITY
  */
  {
    id: "cal-001",
    name: "B.Tech CSE - Semester 1",
    tenantType: "UNIVERSITY",
  },

  {
    id: "cal-002",
    name: "B.Tech ECE - Semester 3",
    tenantType: "UNIVERSITY",
  },

  /*
    SKILL ACADEMY
  */
  {
    id: "cal-003",
    name: "Java Full Stack - Batch 01",
    tenantType: "SKILL_ACADEMY",
  },

  /*
    BOOTCAMP
  */
  {
    id: "cal-004",
    name: "MERN Stack - January Cohort",
    tenantType: "BOOTCAMP",
  },

  /*
    CORPORATE
  */
  {
    id: "cal-005",
    name: "Information Security Training",
    tenantType: "CORPORATE",
  },
];

export const mockEvents = [
  /*
    UNIVERSITY EVENT
  */
  {
    id: "event-001",
    calendarId: "cal-001",
    tenantType: "UNIVERSITY",

    name: "Java Programming Class",
    eventType: "Class",

    startDate: "2026-09-15",
    endDate: "2026-09-15",

    startTime: "10:00",
    endTime: "11:00",

    allDay: false,

    description:
      "Introduction to Java Programming",

    organizer: "Faculty",

    location: "Room 204",

    mode: "Offline",

    meetingLink: "",

    recurrence: "NONE",

    reminder: "30_MINUTES",

    attendanceRequired: true,

    color: "#2563eb",

    status: "PUBLISHED",

    audience: {
      type: "GROUP",
      level1: "B.Tech",
      level2: "CSE",
      level3: "Semester 1",
    },
  },

  {
    id: "event-002",
    calendarId: "cal-001",
    tenantType: "UNIVERSITY",

    name: "Internal Assessment",
    eventType: "Internal Assessment",

    startDate: "2026-09-18",
    endDate: "2026-09-18",

    startTime: "09:00",
    endTime: "11:00",

    allDay: false,

    description:
      "Internal Assessment 1",

    organizer:
      "Examination Cell",

    location:
      "Exam Hall 1",

    mode: "Offline",

    meetingLink: "",

    recurrence: "NONE",

    reminder: "1_DAY",

    attendanceRequired: true,

    color: "#dc2626",

    status: "PUBLISHED",

    audience: {
      type: "GROUP",
      level1: "B.Tech",
      level2: "CSE",
      level3: "Semester 1",
    },
  },

  /*
    SKILL ACADEMY EVENT
  */
  {
    id: "event-003",
    calendarId: "cal-003",
    tenantType: "SKILL_ACADEMY",

    name: "Java Training Session",
    eventType: "Training Session",

    startDate: "2026-09-16",
    endDate: "2026-09-16",

    startTime: "11:00",
    endTime: "13:00",

    allDay: false,

    description:
      "Java Full Stack training session",

    organizer: "Trainer 1",

    location: "Training Room",

    mode: "Hybrid",

    meetingLink: "",

    recurrence: "NONE",

    reminder: "30_MINUTES",

    attendanceRequired: true,

    color: "#2563eb",

    status: "PUBLISHED",

    audience: {
      type: "GROUP",
      level1:
        "Software Development",
      level2:
        "Java Full Stack",
      level3:
        "Batch 01",
    },
  },

  /*
    BOOTCAMP EVENT
  */
  {
    id: "event-004",
    calendarId: "cal-004",
    tenantType: "BOOTCAMP",

    name: "Coding Challenge",
    eventType: "Coding Challenge",

    startDate: "2026-09-17",
    endDate: "2026-09-17",

    startTime: "10:00",
    endTime: "12:00",

    allDay: false,

    description:
      "Weekly coding challenge",

    organizer:
      "Lead Instructor",

    location: "Online",

    mode: "Online",

    meetingLink: "",

    recurrence: "NONE",

    reminder: "1_HOUR",

    attendanceRequired: false,

    color: "#2563eb",

    status: "PUBLISHED",

    audience: {
      type: "GROUP",
      level1:
        "Full Stack Development",
      level2:
        "MERN Stack",
      level3:
        "January 2026 Cohort",
    },
  },

  /*
    CORPORATE EVENT
  */
  {
    id: "event-005",
    calendarId: "cal-005",
    tenantType: "CORPORATE",

    name:
      "Information Security Training",

    eventType:
      "Compliance Training",

    startDate: "2026-09-20",
    endDate: "2026-09-20",

    startTime: "14:00",
    endTime: "15:30",

    allDay: false,

    description:
      "Mandatory information security training",

    organizer:
      "Learning & Development",

    location: "Virtual",

    mode: "Online",

    meetingLink: "",

    recurrence: "NONE",

    reminder: "1_DAY",

    attendanceRequired: true,

    color: "#2563eb",

    status: "PUBLISHED",

    audience: {
      type: "ENTIRE_TENANT",
    },
  },
];

export const mockTenants = [
  {
    id: "university",
    name:
      "University / College",
    type: "UNIVERSITY",
  },

  {
    id: "skill-academy",
    name: "Skill Academy",
    type: "SKILL_ACADEMY",
  },

  {
    id: "bootcamp",
    name: "Bootcamp",
    type: "BOOTCAMP",
  },

  {
    id: "corporate",
    name: "Corporate",
    type: "CORPORATE",
  },
];

export const mockRoles = [
  {
    id: "SUPER_ADMIN",
    name: "Super Admin",
  },

  {
    id: "PLATFORM_ADMIN",
    name: "Platform Admin",
  },

  {
    id: "TENANT_ADMIN",
    name:
      "Institute / Organization Admin",
  },

  {
    id: "COORDINATOR",
    name:
      "Coordinator / Manager",
  },

  {
    id: "FACULTY",
    name:
      "Faculty / Trainer / Instructor",
  },

  {
    id: "LEARNER",
    name:
      "Learner / Student / Employee",
  },
];

export const mockUniversityData = {
  academicYears: [
    "2025-26",
    "2026-27",
    "2027-28",
  ],

  programmes: [
    "B.Tech",
    "B.E",
    "B.Sc",
    "BCA",
    "BBA",
    "M.Tech",
    "MBA",
  ],

  branches: [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "AI & ML",
    "Data Science",
  ],

  years: [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
  ],

  semesters: [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ],

  schemes: [
    "2021 Scheme",
    "2025 Scheme",
    "2026 Scheme",
  ],
};

export const mockSkillAcademyData = {
  trainingYears: [
    "2025-26",
    "2026-27",
    "2027-28",
  ],

  programmes: [
    "Software Development",
    "Data Science",
    "Cloud Computing",
    "Cybersecurity",
    "Digital Marketing",
  ],

  courses: [
    "Java Full Stack",
    "Python Full Stack",
    "MERN Stack",
    "Data Analytics",
    "AWS",
    "DevOps",
    "Cybersecurity Fundamentals",
  ],

  batches: [
    "Batch 01",
    "Batch 02",
    "Morning Batch",
    "Afternoon Batch",
    "Evening Batch",
    "Weekend Batch",
  ],

  trainers: [
    "Trainer 1",
    "Trainer 2",
    "Trainer 3",
  ],

  modes: [
    "Online",
    "Offline",
    "Hybrid",
    "Self-paced",
  ],
};

export const mockBootcampData = {
  programmes: [
    "Full Stack Development",
    "Data Science",
    "UI/UX Design",
    "Cybersecurity",
    "Cloud & DevOps",
  ],

  cohorts: [
    "January 2026 Cohort",
    "April 2026 Cohort",
    "July 2026 Cohort",
    "September 2026 Cohort",
  ],

  learningTracks: [
    "MERN Stack",
    "Java Full Stack",
    "Python Full Stack",
    "Data Analytics",
    "UI/UX",
    "DevOps",
    "Cybersecurity Fundamentals",
  ],

  instructors: [
    "Instructor 1",
    "Instructor 2",
  ],

  mentors: [
    "Mentor 1",
    "Mentor 2",
  ],

  durations: [
    "6 Weeks",
    "8 Weeks",
    "12 Weeks",
    "16 Weeks",
  ],

  modes: [
    "Online",
    "Offline",
    "Hybrid",
  ],
};

export const mockCorporateData = {
  calendarYears: [
    "2026",
    "2027",
    "2028",
  ],

  businessUnits: [
    "Technology",
    "Operations",
    "Finance",
    "Sales",
    "Human Resources",
    "Customer Service",
  ],

  departments: [
    "IT",
    "Finance",
    "HR",
    "Marketing",
    "Sales",
    "Operations",
    "Customer Support",
  ],

  teams: [
    "Team A",
    "Team B",
    "Team C",
  ],

  programmes: [
    "Information Security",
    "Compliance",
    "Leadership Development",
    "Technical Training",
    "Employee Onboarding",
    "Product Training",
  ],

  trainingTypes: [
    "Compliance",
    "Technical",
    "Functional",
    "Leadership",
    "Onboarding",
  ],

  audiences: [
    "All Employees",
    "Business Unit",
    "Department",
    "Team",
    "Role",
    "Selected Employees",
  ],

  modes: [
    "Self-paced",
    "Instructor-led",
    "Virtual",
    "Offline",
    "Hybrid",
  ],
};

export const mockEventTypes = {
  UNIVERSITY: [
    "Semester Commencement",
    "Student Induction / Orientation",
    "Commencement of Classes",
    "Class",
    "Lab / Practical",
    "Assignment Deadline",
    "Internal Assessment",
    "Project Review",
    "Seminar / Workshop",
    "Last Working Day",
    "Theory Examination",
    "Practical Examination",
    "Viva Examination",
    "Holiday",
    "College / University Event",
    "Semester Break",
    "Commencement of Next Semester",
    "Other",
  ],

  SKILL_ACADEMY: [
    "Orientation",
    "Training Session",
    "Practical / eLab",
    "Assignment",
    "Assessment",
    "Workshop / Webinar",
    "Project Review",
    "Final Assessment",
    "Certification",
    "Placement Activity",
  ],

  BOOTCAMP: [
    "Orientation",
    "Coding Class",
    "Coding Lab",
    "Coding Challenge",
    "Weekly Assessment",
    "Mentor Session",
    "Project Milestone",
    "Mock Interview",
    "Final Project / Demo Day",
    "Placement Session",
    "Bootcamp Completion",
  ],

  CORPORATE: [
    "Training Available",
    "Instructor-Led Training",
    "Virtual Training",
    "Compliance Training",
    "Workshop / Webinar",
    "Assessment",
    "Completion Deadline",
    "Certification Exam",
    "Certificate Expiry / Renewal",
    "Onboarding Session",
    "Leadership / Manager Session",
  ],
};