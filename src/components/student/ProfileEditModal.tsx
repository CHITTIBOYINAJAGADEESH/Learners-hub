
import { Upload } from 'lucide-react';
import { UserProfile } from '@/types/student';

interface ProfileEditModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onProfileChange: (profile: UserProfile) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileEditModal = ({ 
  isOpen, 
  userProfile, 
  onClose, 
  onSave, 
  onProfileChange,
  onProfilePictureChange 
}: ProfileEditModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-lms-gray rounded-xl p-6 w-full max-w-md modal-content">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-poppins font-bold text-white">Edit Profile</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <form onSubmit={onSave} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-lms-blue"
              />
              <label className="absolute bottom-0 right-0 bg-lms-blue rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={onProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => onProfileChange({ ...userProfile, name: e.target.value })}
              className="lms-input"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              value={userProfile.bio}
              onChange={(e) => onProfileChange({ ...userProfile, bio: e.target.value })}
              className="lms-input min-h-[100px]"
              rows={4}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="lms-button-primary flex-1">
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="lms-button bg-gray-600 hover:bg-gray-700 flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
