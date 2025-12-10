export const CourseCategory = {
	ALL: "ALL",
	FRONTEND: "FRONTEND",
	MOBILE: "MOBILE",
	BACKEND: "BACKEND",
	DESIGN: "DESIGN",
} as const;

export type CourseCategoryType =
	(typeof CourseCategory)[keyof typeof CourseCategory];

export const UserRole = {
	ADMIN: "ADMIN",
	USER: "USER",
	TEACHER: "TEACHER",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
