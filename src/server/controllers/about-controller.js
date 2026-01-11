export async function aboutController(req, res) {
  const data = {
    title: 'About BitKraft',
    description: 'BitKraft is a hybrid SSR + SPA framework built on Node.js and Vite.',
    principles: [
      'No Hydration, No Virtual DOM',
      'Feature-Based Architecture',
      'Content Negotiation',
      'Frontend Efficiency Critical',
      'Standards-Based Development'
    ]
  };
  
  return {
    data,
    meta: {
      title: 'About - BitKraft Framework',
      description: 'Learn about BitKraft framework architecture'
    }
  };
}

export default aboutController;
