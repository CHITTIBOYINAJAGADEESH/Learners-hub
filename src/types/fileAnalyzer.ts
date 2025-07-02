
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
}

export interface FileUpload {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  summary: string;
  extractedText?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface FileAnalysis {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  extractedText: string;
  summary: string;
  keyPoints: string[];
  entities: string[];
}
