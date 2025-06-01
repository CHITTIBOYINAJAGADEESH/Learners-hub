
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, User, Mail, Lock, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const [userRole, setUserRole] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    joinDate: '',
    lastLogin: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const role = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setUserRole(role || '');
    const profile = {
      name: name || email?.split('@')[0] || 'User',
      email: email || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=3b82f6&color=fff`,
      joinDate: 'November 2024',
      lastLogin: 'Just now'
    };
    
    setProfileData(profile);
    setFormData({
      name: profile.name,
      email: profile.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [navigate]);

  const handleBack = () => {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'instructor':
        navigate('/instructor');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // Update localStorage
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userEmail', formData.email);

    // Update profile data
    setProfileData({
      ...profileData,
      name: formData.name,
      email: formData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff`
    });

    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'lms-blue';
      case 'instructor': return 'lms-green';
      case 'student': return 'lms-purple';
      default: return 'gray-500';
    }
  };

  const getRoleStats = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Courses Created', value: '12' },
          { label: 'Active Users', value: '145' },
          { label: 'Total Sessions', value: '1,234' }
        ];
      case 'instructor':
        return [
          { label: 'Courses Assigned', value: '8' },
          { label: 'Students Taught', value: '45' },
          { label: 'Modules Created', value: '23' }
        ];
      case 'student':
        return [
          { label: 'Courses Enrolled', value: '3' },
          { label: 'Modules Completed', value: '12' },
          { label: 'Certificates Earned', value: '1' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Header */}
      <header className="bg-lms-gray border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <User className={`h-8 w-8 text-${getRoleColor(userRole)}`} />
                <span className="text-2xl font-poppins font-bold text-white">Profile</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getRoleColor(userRole)}/20 text-${getRoleColor(userRole)} capitalize`}>
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="lms-card text-center">
              <div className="relative inline-block mb-6">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-lms-blue rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h2 className="text-2xl font-poppins font-bold text-white mb-2">
                {profileData.name}
              </h2>
              <p className="text-gray-400 mb-4">{profileData.email}</p>
              
              <div className={`inline-block px-4 py-2 rounded-full bg-${getRoleColor(userRole)}/20 text-${getRoleColor(userRole)} font-medium capitalize mb-6`}>
                {userRole}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-white">{profileData.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login:</span>
                  <span className="text-white">{profileData.lastLogin}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lms-card mt-6">
              <h3 className="text-lg font-poppins font-bold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                {getRoleStats().map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className={`text-${getRoleColor(userRole)} font-bold`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="lms-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-poppins font-bold text-white">
                  {isEditing ? 'Edit Profile' : 'Profile Information'}
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="lms-button-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <div className="lms-input bg-lms-dark">{profileData.name}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="lms-input bg-lms-dark">{profileData.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Account Type
                    </label>
                    <div className={`lms-input bg-lms-dark capitalize text-${getRoleColor(userRole)}`}>
                      {userRole}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="lms-input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="lms-input pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-white mb-4">Change Password</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="lms-input pl-10"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="lms-input pl-10"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="lms-input pl-10"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button type="submit" className="lms-button-success flex-1">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="lms-button bg-gray-600 hover:bg-gray-700 flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Recent Activity */}
            <div className="lms-card mt-6">
              <h3 className="text-lg font-poppins font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className={`w-2 h-2 bg-${getRoleColor(userRole)} rounded-full`}></div>
                  <span>Profile updated</span>
                  <span className="text-gray-500 text-sm">Just now</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-lms-green rounded-full"></div>
                  <span>Logged in to dashboard</span>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-lms-blue rounded-full"></div>
                  <span>Password changed</span>
                  <span className="text-gray-500 text-sm">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
