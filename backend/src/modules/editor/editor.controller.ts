import { Request, Response } from 'express';
import { EditorService } from '@/modules/editor/editor.service';
import { EditorListResponse } from './editor';

const editorService = new EditorService();

export class EditorController {
  async findAll(req: Request, res: Response): Promise<void> {
    const editors = await editorService.findAll();
    const response: EditorListResponse = {
      success: true,
      data: editors,
    };
    res.status(200).json(response);
  }
}
