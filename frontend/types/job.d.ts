type LocationType = 'REMOTE' | 'PHYSICAL';
type JobStatus = 'NEW' | 'ASSIGNED' | 'TRANSCRIBED' | 'REVIEWED' | 'COMPLETED';

interface ReporterResponse {
  id: string;
  name: string;
  location: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditorResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentResponse {
  id: string;
  jobId: string;
  reporterAmount: string;
  editorAmount: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

interface JobResponse {
  id: string;
  name: string;
  durationMinutes: string;
  locationType: LocationType;
  city: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  reporterId: string | null;
  editorId: string | null;
  reporter: ReporterResponse | null;
  editor: EditorResponse | null;
  payment: PaymentResponse | null;
}
