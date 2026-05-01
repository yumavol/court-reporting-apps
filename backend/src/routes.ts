import { Router } from 'express';
import { JobController } from '@/modules/job/job.controller';
import { ReporterController } from '@/modules/reporter/reporter.controller';
import { EditorController } from '@/modules/editor/editor.controller';

const router = Router();
const jobController = new JobController();
const reporterController = new ReporterController();
const editorController = new EditorController();

router.post('/jobs', (req, res) => jobController.create(req, res));
router.get('/jobs', (req, res) => jobController.findAll(req, res));
router.patch('/jobs/assign/:id', (req, res) => jobController.assign(req, res));

router.get('/reporters', (req, res) => reporterController.findAll(req, res));

router.get('/editors', (req, res) => editorController.findAll(req, res));

export default router;
