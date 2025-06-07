
import { ArrowLeft, BookOpen } from 'lucide-react';
import { UserProfile } from '@/types/student';

interface StudentDashboardHeaderProps {
  userProfile: UserProfile;
  onBackClick: () => void;
  onLogout: () => void;
}

export const StudentDashboardHeader = ({ 
  userProfile, 
  onBackClick, 
  onLogout 
}: StudentDashboardHeaderProps) => {
  return (
    <header className="bg-lms-gray border-b border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackClick}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-lms-blue" />
              <span className="text-2xl font-poppins font-bold text-white">Student Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={userProfile.profilePicture}
                alt="Student"
                className="w-10 h-10 rounded-full object-cover border-2 border-lms-blue"
              />
              <span className="text-white font-medium">{userProfile.name}</span>
            </div>
            <button onClick={onLogout} className="lms-button-primary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
