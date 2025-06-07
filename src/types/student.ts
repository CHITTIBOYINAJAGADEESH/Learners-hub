
export interface Course {
  id: number;
  title: string;
  description: string;
  modules: number;
  image: string;
  instructor?: string;
  assignedBy?: string;
  assignedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  joinDate: string;
}

export interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  duration: string;
  studentName: string;
  grade: string;
}
