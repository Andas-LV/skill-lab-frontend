export const routes = {
	home: () => "/",
	login: () => "/login",
	modules: () => "/modules",
	createModule: () => "/modules/create",
	module: (id: number | string) => `/modules/${id}`,
	courses: () => "/courses",
	createCourse: () => "/courses/create",
	course: (id: number | string) => `/courses/${id}`,
	profile: () => "/profile",
	users: () => "/users",
	user: (id: number | string) => `/users/${id}`,
};
