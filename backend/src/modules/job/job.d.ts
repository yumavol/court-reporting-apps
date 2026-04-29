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
}
[];

export type JobInsertResponse = ApiResponse<JobResponse>;
export type JobListResponse = ApiResponse<JobResponse[]>;
