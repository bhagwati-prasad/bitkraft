export const routes = [
  {
    path: '/',
    name: 'home',
    controller: 'home',
    features: ['hero', 'footer'],
    meta: {
      title: 'Home - BitKraft Framework',
      description: 'BitKraft hybrid SSR + SPA framework demo'
    }
  },
  {
    path: '/about',
    name: 'about',
    controller: 'about',
    features: ['team', 'footer'],
    meta: {
      title: 'About - BitKraft Framework',
      description: 'Learn about BitKraft framework architecture'
    }
  }
];

export function findRoute(path) {
  const normalizedPath = path === '' ? '/' : path;
  return routes.find(route => route.path === normalizedPath);
}

export function getAllRoutes() {
  return routes;
}

export default {
  routes,
  findRoute,
  getAllRoutes
};
