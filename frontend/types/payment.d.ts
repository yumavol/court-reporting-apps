interface PaymentCalculateResponse {
  jobId: string;
  caseName: string;
  durationMinutes: number;
  reporterAmount: number;
  editorAmount: number;
  totalAmount: number;
}

interface PaymentProcessResponse {
  id: string;
  jobId: string;
  reporterAmount: Decimal;
  editorAmount: Decimal;
  totalAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;
}
