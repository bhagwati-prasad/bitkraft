import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../../templates');

export async function renderPage(route, pageData) {
  const { data, meta } = pageData;
  
  const context = {
    meta: {
      title: meta.title || 'BitKraft Framework',
      description: meta.description || '',
    },
    data,
    route,
    features: route.features || [],
  };
  
  try {
    const html = await ejs.renderFile(
      path.join(TEMPLATES_DIR, 'layout.ejs'),
      context
    );
    
    return html;
  } catch (error) {
    console.error('[SSR Renderer] Error rendering page:', error);
    throw error;
  }
}

export async function renderJSON(route, pageData) {
  const { data, meta } = pageData;
  
  const pageTemplate = path.join(TEMPLATES_DIR, `pages/${route.name}.ejs`);
  
  try {
    const html = await ejs.renderFile(pageTemplate, { data });
    
    return {
      route: {
        path: route.path,
        name: route.name,
        features: route.features,
      },
      data,
      meta,
      html,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[SSR Renderer] Error rendering JSON payload:', error);
    throw error;
  }
}

export default {
  renderPage,
  renderJSON,
};
