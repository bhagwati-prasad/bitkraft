import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentNegotiator } from './middleware/content-negotiator.js';
import { findRoute } from './core/route-registry.js';
import { renderPage, renderJSON } from './core/ssr-renderer.js';
import { homeController } from './controllers/home-controller.js';
import { aboutController } from './controllers/about-controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../../public')));

app.use(contentNegotiator);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', framework: 'BitKraft', version: '1.0.0-alpha.1' });
});

const controllers = {
  home: homeController,
  about: aboutController
};

app.get('*', async (req, res) => {
  try {
    const route = findRoute(req.path);
    
    if (!route) {
      return res.status(404).send('Page not found');
    }
    
    const controller = controllers[route.controller];
    
    if (!controller) {
      return res.status(500).send('Controller not found');
    }
    
    const pageData = await controller(req, res);
    
    if (req.renderMode === 'SSR') {
      const html = await renderPage(route, pageData);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      const json = await renderJSON(route, pageData);
      res.setHeader('Content-Type', 'application/json');
      res.json(json);
    }
  } catch (error) {
    console.error('[Server] Error handling request:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BitKraft server running on http://localhost:${PORT}`);
  console.log(`📦 Phase: 1 - Minimal Runtime Kernel`);
  console.log(`✅ SSR Mode: Enabled`);
  console.log(`✅ SPA Mode: Enabled`);
});

export default app;
