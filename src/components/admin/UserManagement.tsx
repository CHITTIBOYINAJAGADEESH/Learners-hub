
import { useState, useEffect } from 'react';
import { User, Trash2, RefreshCw, Search, Mail, Calendar, Clock, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  createdAt: string;
}

interface LoginRecord {
  id: number;
  email: string;
  role: string;
  loginTime: string;
  name: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RegisteredUser[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'logins'>('users');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      console.log('Loaded users:', registeredUsers);
      setUsers(registeredUsers);
      setFilteredUsers(registeredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoginHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      console.log('Loaded login history:', history);
      setLoginHistory(history);
    } catch (error) {
      console.error('Error loading login history:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadLoginHistory();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleDeleteUser = (userId: string, userEmail: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Remove from registered users
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      // Remove from user profiles
      const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      delete userProfiles[userEmail];
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

      // Remove course assignments for this user
      const courseAssignments = JSON.parse(localStorage.getItem('courseAssignments') || '[]');
      const updatedAssignments = courseAssignments.filter((assignment: any) => 
        assignment.studentEmail !== userEmail && assignment.instructorEmail !== userEmail
      );
      localStorage.setItem('courseAssignments', JSON.stringify(updatedAssignments));

      // Remove student progress
      localStorage.removeItem(`studentProgress_${userEmail}`);
      localStorage.removeItem(`studentCertificates_${userEmail}`);

      // Update state
      setUsers(updatedUsers);
      
      toast({
        title: "User Deleted",
        description: `User ${userEmail} has been successfully deleted.`,
      });

      console.log(`Deleted user: ${userEmail}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLoginRecord = (loginId: number) => {
    if (!confirm('Are you sure you want to delete this login record?')) {
      return;
    }

    try {
      const updatedHistory = loginHistory.filter(record => record.id !== loginId);
      localStorage.setItem('loginHistory', JSON.stringify(updatedHistory));
      setLoginHistory(updatedHistory);
      
      toast({
        title: "Login Record Deleted",
        description: "Login record has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting login record:', error);
      toast({
        title: "Error",
        description: "Failed to delete login record.",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'text-lms-blue bg-lms-blue/20';
      case 'instructor':
        return 'text-lms-green bg-lms-green/20';
      case 'admin':
        return 'text-lms-purple bg-lms-purple/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatLoginTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white">User Management</h2>
          <p className="text-gray-400">Manage registered users and login activities</p>
        </div>
        <button
          onClick={() => {
            loadUsers();
            loadLoginHistory();
          }}
          disabled={isLoading}
          className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-lms-purple text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4 inline mr-2" />
          Registered Users
        </button>
        <button
          onClick={() => setActiveTab('logins')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'logins'
              ? 'bg-lms-purple text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Recent Logins
        </button>
      </div>

      {/* Search Bar */}
      <div className="lms-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={activeTab === 'users' ? "Search users by name, email, or role..." : "Search login records..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lms-input pl-10"
          />
        </div>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="lms-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-lms-blue/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-lms-blue" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="lms-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-lms-green/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-lms-green" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Students</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'student').length}
              </p>
            </div>
          </div>
        </div>
        <div className="lms-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-lms-purple/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-lms-purple" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Instructors</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'instructor').length}
              </p>
            </div>
          </div>
        </div>
        <div className="lms-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-lms-yellow/20 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-lms-yellow" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Recent Logins</p>
              <p className="text-2xl font-bold text-white">{loginHistory.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'users' ? (
        <div className="lms-card">
          <h3 className="text-lg font-poppins font-semibold text-white mb-4">Registered Users</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 text-lms-blue animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h4 className="text-xl font-poppins font-bold text-white mb-2">
                {searchTerm ? 'No Users Found' : 'No Users Registered'}
              </h4>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No users have registered yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-lms-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{user.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="lms-card">
          <h3 className="text-lg font-poppins font-semibold text-white mb-4">Recent Login Activity</h3>
          
          {loginHistory.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h4 className="text-xl font-poppins font-bold text-white mb-2">No Login Activity</h4>
              <p className="text-gray-400">No recent login records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {loginHistory
                .filter(record => 
                  !searchTerm || 
                  record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  record.role.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-lms-dark rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{record.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{record.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatLoginTime(record.loginTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(record.role)}`}>
                      {record.role.charAt(0).toUpperCase() + record.role.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDeleteLoginRecord(record.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete Login Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
