export async function homeController(req, res) {
  const data = {
    title: 'Welcome to BitKraft',
    subtitle: 'Hybrid SSR + SPA Framework',
    features: [
      'No Hydration',
      'No Virtual DOM',
      'Lifecycle-First',
      'Frontend Efficiency'
    ]
  };
  
  return {
    data,
    meta: {
      title: 'Home - BitKraft Framework',
      description: 'BitKraft hybrid SSR + SPA framework demo'
    }
  };
}

export default homeController;
