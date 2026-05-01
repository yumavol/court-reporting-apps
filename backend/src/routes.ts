import { Router } from 'express';
import { JobController } from '@/modules/job/job.controller';
import { ReporterController } from '@/modules/reporter/reporter.controller';
import { EditorController } from '@/modules/editor/editor.controller';
import { PaymentController } from '@/modules/payment/payment.controller';

const router = Router();
const jobController = new JobController();
const reporterController = new ReporterController();
const editorController = new EditorController();
const paymentController = new PaymentController();

router.post('/jobs', (req, res) => jobController.create(req, res));
router.get('/jobs', (req, res) => jobController.findAll(req, res));
router.patch('/jobs/:id/assign', (req, res) => jobController.assign(req, res));
router.patch('/jobs/:id/status', (req, res) => jobController.updateStatus(req, res));

router.get('/reporters', (req, res) => reporterController.findAll(req, res));

router.get('/editors', (req, res) => editorController.findAll(req, res));

router.post('/payments/calculate', (req, res) => paymentController.calculate(req, res));
router.post('/payments', (req, res) => paymentController.processPayment(req, res));

export default router;
