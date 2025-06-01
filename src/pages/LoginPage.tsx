
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, User, Lock, Users, GraduationCap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'student' | 'instructor' | 'admin';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    { id: 'student' as UserRole, name: 'Student', icon: GraduationCap, color: 'lms-purple' },
    { id: 'instructor' as UserRole, name: 'Instructor', icon: BookOpen, color: 'lms-green' },
    { id: 'admin' as UserRole, name: 'Admin', icon: Shield, color: 'lms-blue' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Mock authentication - In real app, this would be an API call
      const mockUsers = {
        admin: { email: 'admin@learnershub.com', password: 'admin123' },
        instructor: { email: 'instructor@learnershub.com', password: 'instructor123' },
        student: { email: 'student@learnershub.com', password: 'student123' }
      };

      const userExists = mockUsers[selectedRole] && 
        mockUsers[selectedRole].email === email && 
        mockUsers[selectedRole].password === password;

      if (userExists || (email && password)) {
        // Store user session
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        toast({
          title: "Login Successful!",
          description: `Welcome back, ${selectedRole}!`,
        });

        // Navigate to appropriate dashboard
        switch (selectedRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'instructor':
            navigate('/instructor');
            break;
          case 'student':
            navigate('/student');
            break;
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-lms-dark flex items-center justify-center px-6">
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
          
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Role</label>
          <div className="grid grid-cols-3 gap-3">
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lms-input pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full lms-button-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-lms-gray rounded-lg">
          <h3 className="text-white font-medium mb-2">Demo Credentials:</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <div>Admin: admin@learnershub.com / admin123</div>
            <div>Instructor: instructor@learnershub.com / instructor123</div>
            <div>Student: student@learnershub.com / student123</div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-lms-blue hover:text-blue-400">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
