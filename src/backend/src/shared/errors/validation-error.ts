import { AppError } from './app-error';

export class ValidationError extends AppError {
  constructor(message: string, public errors: any[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}





