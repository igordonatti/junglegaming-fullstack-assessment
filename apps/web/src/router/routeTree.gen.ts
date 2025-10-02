// Temporary hand-written route tree until codegen or file-based routes are added
import {
  createRootRouteWithContext,
  createRoute,
} from "@tanstack/react-router";
import HomePage from "../pages/index";
import LoginPage from "../pages/login";
import TasksPage from "../pages/tasks";
import TaskDetailPage from "../pages/tasks/$taskId";

export const root = createRootRouteWithContext()();
export const indexRoute = createRoute({
  getParentRoute: () => root,
  path: "/",
  component: HomePage,
});
export const loginRoute = createRoute({
  getParentRoute: () => root,
  path: "/login",
  component: LoginPage,
});
export const tasksRoute = createRoute({
  getParentRoute: () => root,
  path: "/tasks",
  component: TasksPage,
});
export const taskDetailRoute = createRoute({
  getParentRoute: () => root,
  path: "/tasks/$taskId",
  component: TaskDetailPage,
});

export const routeTree = root.addChildren([
  indexRoute,
  loginRoute,
  tasksRoute,
  taskDetailRoute,
]);
