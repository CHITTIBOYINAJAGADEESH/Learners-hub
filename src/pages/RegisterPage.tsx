
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, User, Mail, Lock, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'student' | 'instructor';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    { id: 'student' as UserRole, name: 'Student', icon: GraduationCap, color: 'lms-purple' },
    { id: 'instructor' as UserRole, name: 'Instructor', icon: BookOpen, color: 'lms-green' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      // Store user data
      const userData = {
        ...formData,
        role: selectedRole,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      // Store registration information for admin panel
      const registrationData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        registrationTime: new Date().toISOString(),
        type: 'registration'
      };

      // Get existing admin data
      const existingAdminData = JSON.parse(localStorage.getItem('adminUserData') || '[]');
      existingAdminData.push(registrationData);
      localStorage.setItem('adminUserData', JSON.stringify(existingAdminData));

      // Store user profile
      const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      userProfiles[formData.email] = {
        id: userData.id,
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        createdAt: userData.createdAt,
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b692?w=150&h=150&fit=crop&crop=face'
      };
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

      // CRITICAL FIX: Store in the format that instructor panel expects
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const newUser = {
        id: userData.id,
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        createdAt: userData.createdAt
      };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      console.log('=== REGISTRATION COMPLETE ===');
      console.log('Stored user in registeredUsers:', newUser);
      console.log('Total registered users:', registeredUsers.length);

      // Trigger storage event for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'registeredUsers',
        newValue: JSON.stringify(registeredUsers),
        storageArea: localStorage
      }));

      // In a real app, this would be sent to an API
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('isLoggedIn', 'true');

      toast({
        title: "Registration Successful!",
        description: `Welcome to Learners Hub, ${formData.name}!`,
      });

      // Navigate to appropriate dashboard
      switch (selectedRole) {
        case 'instructor':
          navigate('/instructor');
          break;
        case 'student':
          navigate('/student');
          break;
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-lms-dark flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-lms-blue" />
            <span className="text-2xl font-poppins font-bold text-white">Learners Hub</span>
          </div>
          
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our learning community</p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">I want to join as a</label>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? `border-${role.color} bg-${role.color}/10`
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    selectedRole === role.id ? `text-${role.color}` : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedRole === role.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {role.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="lms-input pl-10"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
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
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full lms-button-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-lms-blue hover:text-blue-400">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
