import prisma from '@/lib/prisma';
import { ValidationError } from '@/lib/errors';
import type { PaymentInputDto } from './payment.schema';

export class PaymentService {
  private computeAmounts(durationMinutes: number, hasReporter: boolean, hasEditor: boolean, dto: PaymentInputDto) {
    const reporterAmount = hasReporter ? durationMinutes * dto.reporterRatePerMinute : 0;
    const editorAmount = hasEditor ? dto.editorFlatFee : 0;
    return { reporterAmount, editorAmount, totalAmount: reporterAmount + editorAmount };
  }

  async calculate(dto: PaymentInputDto) {
    const job = await prisma.job.findUnique({ where: { id: dto.jobId } });

    if (!job) {
      throw new ValidationError('Job not found', undefined, 404);
    }

    if (job.status !== 'REVIEWED') {
      throw new ValidationError('Only jobs with status REVIEWED can be calculated');
    }

    const durationMinutes = Number(job.durationMinutes);
    const amounts = this.computeAmounts(durationMinutes, !!job.reporterId, !!job.editorId, dto);

    return {
      jobId: job.id,
      caseName: job.name,
      durationMinutes,
      ...amounts,
    };
  }

  async processPayment(dto: PaymentInputDto) {
    const job = await prisma.job.findUnique({
      where: { id: dto.jobId },
      include: { payment: true },
    });

    if (!job) {
      throw new ValidationError('Job not found', undefined, 404);
    }

    if (job.payment) {
      throw new ValidationError('Payment already processed for this job');
    }

    if (job.status !== 'REVIEWED') {
      throw new ValidationError('Only jobs with status REVIEWED can be paid');
    }

    const durationMinutes = Number(job.durationMinutes);
    const amounts = this.computeAmounts(durationMinutes, !!job.reporterId, !!job.editorId, dto);

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          jobId: dto.jobId,
          reporterAmount: amounts.reporterAmount,
          editorAmount: amounts.editorAmount,
          totalAmount: amounts.totalAmount,
        },
      });

      await tx.job.update({
        where: { id: dto.jobId },
        data: { status: 'COMPLETED' },
      });

      return payment;
    });
  }
}
