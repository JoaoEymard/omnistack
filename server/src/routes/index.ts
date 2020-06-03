import { Router } from 'express';

import items from './items';
import points from './points';

const routes = Router();

routes.use('/items', items);
routes.use('/points', points);

export default routes;
