import { ReporterResponse } from '@/modules/reporter/reporter.d';
import { EditorResponse } from '@/modules/editor/editor.d';

export interface JobResponse {
  locationType: LocationType;
  city: string | null;
  reporterId: string | null;
  editorId: string | null;
  id: string;
  name: string;
  durationMinutes: Decimal;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  reporter: ReporterResponse | null;
  editor: EditorResponse | null;
  payment: Payment | null;
}
[];

export type JobInsertResponse = ApiResponse<Omit<JobResponse, 'reporter' | 'editor' | 'payment'>>;
let data: JobInsertResponse;
export type JobListResponse = ApiResponse<JobResponse[]>;
