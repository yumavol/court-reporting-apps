import { Decimal } from '@prisma/client/runtime/library';

export interface PaymentCalculateData {
  jobId: string;
  caseName: string;
  durationMinutes: number;
  reporterAmount: number;
  editorAmount: number;
  totalAmount: number;
}

export interface PaymentData {
  id: string;
  jobId: string;
  reporterAmount: Decimal;
  editorAmount: Decimal;
  totalAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentCalculateResponse = ApiResponse<PaymentCalculateData>;
export type PaymentProcessResponse = ApiResponse<PaymentData>;
