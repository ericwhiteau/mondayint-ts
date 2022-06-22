import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/monday/execute_action', authenticationMiddleware, transformationController.executeAction);
router.post('/monday/get_remote_list_options', authenticationMiddleware, transformationController.getRemoteListOptions);
router.post('/monday/set_job_number', authenticationMiddleware, transformationController.setJobNumber);
router.post('/monday/set_item_number', authenticationMiddleware, transformationController.setItemNumber);

export default router;
