export interface EditorResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EditorListResponse = ApiResponse<EditorResponse[]>;
