import { Router } from 'express';
import { JobController } from '@/modules/job/job.controller';

const router = Router();
const jobController = new JobController();

router.post('/jobs', (req, res) => jobController.create(req, res));
router.get('/jobs', (req, res) => jobController.findAll(req, res));

export default router;
