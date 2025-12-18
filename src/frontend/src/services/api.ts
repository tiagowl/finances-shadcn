// Import Firebase service instead of API service
import { firebaseService } from './firebaseService';

// Export firebaseService as apiService for backward compatibility
export const apiService = firebaseService;

