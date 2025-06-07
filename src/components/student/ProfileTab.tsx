
import { Mail, Calendar, Edit2 } from 'lucide-react';
import { UserProfile } from '@/types/student';

interface ProfileTabProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
}

export const ProfileTab = ({ userProfile, onEditProfile }: ProfileTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-poppins font-bold text-white">My Profile</h2>
        <button
          onClick={onEditProfile}
          className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="lms-card max-w-2xl">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={userProfile.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-lms-blue"
          />
          <div>
            <h3 className="text-2xl font-poppins font-bold text-white mb-2">
              {userProfile.name}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>Joined {userProfile.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-poppins font-semibold text-white mb-2">Bio</h4>
          <p className="text-gray-300 leading-relaxed">{userProfile.bio}</p>
        </div>
      </div>
    </div>
  );
};
