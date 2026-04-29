export interface ReporterResponse {
  id: string;
  name: string;
  location: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReporterListResponse = ApiResponse<ReporterResponse[]>;
