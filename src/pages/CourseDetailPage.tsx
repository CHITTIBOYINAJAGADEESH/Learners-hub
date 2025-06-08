
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Play, Award } from 'lucide-react';
import { Course, Certificate } from '@/types/student';

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = () => {
    console.log('Loading course data for ID:', courseId);
    
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      // Load all courses (both admin courses and enrolled courses)
      const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]');
      
      // Also check course assignments
      const courseAssignments = JSON.parse(localStorage.getItem('courseAssignments') || '[]');
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const combinedUsers = [...allUsers, ...registeredUsers];
      
      const currentStudent = combinedUsers.find((user: any) => 
        user.email === userEmail && user.role === 'student'
      );
      
      // Get assigned courses
      const studentAssignments = courseAssignments.filter((assignment: any) => {
        const assignmentStudentId = assignment.studentId;
        const currentStudentId = currentStudent?.id;
        return currentStudentId && (
          assignmentStudentId === currentStudentId ||
          assignmentStudentId.toString() === currentStudentId.toString()
        );
      });
      
      const assignedCourses = studentAssignments.map((assignment: any) => {
        const adminCourse = adminCourses.find((course: any) => 
          course.id.toString() === assignment.courseId.toString()
        );
        return adminCourse ? { ...adminCourse, assignedBy: assignment.instructorEmail } : null;
      }).filter(Boolean);
      
      // Combine all available courses
      const allCourses = [...adminCourses, ...enrolledCourses, ...assignedCourses];
      
      console.log('All available courses:', allCourses);
      console.log('Looking for course with ID:', courseId);
      
      // Find the specific course
      const foundCourse = allCourses.find((c: Course) => 
        c.id.toString() === courseId?.toString()
      );
      
      console.log('Found course:', foundCourse);
      
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Generate sample modules based on course
        const sampleModules: Module[] = Array.from({ length: foundCourse.modules || 5 }, (_, index) => ({
          id: index + 1,
          title: `Module ${index + 1}: ${getModuleTitle(foundCourse.title, index)}`,
          description: `Learn about ${getModuleTitle(foundCourse.title, index).toLowerCase()}`,
          duration: `${Math.floor(Math.random() * 3) + 1} hours`,
          completed: false
        }));
        
        setModules(sampleModules);
        
        // Load completed modules from localStorage
        const completedKey = `completedModules_${userEmail}_${courseId}`;
        const completed = JSON.parse(localStorage.getItem(completedKey) || '[]');
        setCompletedModules(completed);
        
        // Update module completion status
        setModules(prev => prev.map(module => ({
          ...module,
          completed: completed.includes(module.id)
        })));
      } else {
        toast({
          title: "Course Not Found",
          description: "The course you're looking for could not be found.",
          variant: "destructive"
        });
        navigate('/student');
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleTitle = (courseTitle: string, index: number) => {
    const commonModules = [
      'Introduction and Basics',
      'Core Concepts',
      'Practical Applications',
      'Advanced Topics',
      'Project Work',
      'Best Practices',
      'Real-world Examples',
      'Final Assessment'
    ];
    
    if (courseTitle.toLowerCase().includes('programming')) {
      return ['Variables and Data Types', 'Control Structures', 'Functions', 'Object-Oriented Programming', 'Error Handling'][index] || commonModules[index];
    } else if (courseTitle.toLowerCase().includes('web')) {
      return ['HTML Fundamentals', 'CSS Styling', 'JavaScript Basics', 'Responsive Design', 'Frameworks'][index] || commonModules[index];
    } else if (courseTitle.toLowerCase().includes('data')) {
      return ['Data Collection', 'Data Cleaning', 'Analysis Techniques', 'Visualization', 'Interpretation'][index] || commonModules[index];
    }
    
    return commonModules[index] || `Topic ${index + 1}`;
  };

  const handleModuleComplete = (moduleId: number) => {
    const userEmail = localStorage.getItem('userEmail');
    const completedKey = `completedModules_${userEmail}_${courseId}`;
    
    const newCompleted = [...completedModules, moduleId];
    setCompletedModules(newCompleted);
    localStorage.setItem(completedKey, JSON.stringify(newCompleted));
    
    // Update module status
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, completed: true } : module
    ));
    
    toast({
      title: "Module Completed!",
      description: `You've successfully completed ${modules.find(m => m.id === moduleId)?.title}`,
    });
    
    // Check if all modules are completed
    if (newCompleted.length === modules.length) {
      generateCertificate();
    }
  };

  const generateCertificate = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userProfile = JSON.parse(localStorage.getItem(`studentProfile_${userEmail}`) || '{}');
    
    const certificate: Certificate = {
      id: `cert_${Date.now()}`,
      courseName: course?.title || 'Course',
      completionDate: new Date().toLocaleDateString(),
      duration: `${modules.length * 2} hours`, // Estimated duration
      studentName: userProfile.name || 'Student',
      grade: 'A' // Default grade
    };
    
    // Save certificate
    const certificatesKey = `studentCertificates_${userEmail}`;
    const existingCertificates = JSON.parse(localStorage.getItem(certificatesKey) || '[]');
    const updatedCertificates = [...existingCertificates, certificate];
    localStorage.setItem(certificatesKey, JSON.stringify(updatedCertificates));
    
    toast({
      title: "🎉 Congratulations!",
      description: "You've completed the course and earned a certificate! Check your Certificates tab to download it.",
    });
  };

  const progressPercentage = modules.length > 0 ? (completedModules.length / modules.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lms-dark flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-lms-dark flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Header */}
      <div className="bg-lms-dark-lighter border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/student')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white">{course.title}</h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="lms-card mb-6">
              <h2 className="text-xl font-poppins font-bold text-white mb-4">Course Progress</h2>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-lms-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm">
                {completedModules.length} of {modules.length} modules completed ({Math.round(progressPercentage)}%)
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-poppins font-bold text-white">Course Modules</h2>
              {modules.map((module) => (
                <div key={module.id} className="lms-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        module.completed 
                          ? 'bg-lms-green text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span>{module.id}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-poppins font-semibold text-white">
                          {module.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{module.description}</p>
                        <p className="text-gray-500 text-xs">{module.duration}</p>
                      </div>
                    </div>
                    
                    {!module.completed && (
                      <button
                        onClick={() => handleModuleComplete(module.id)}
                        className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30 flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Info Sidebar */}
          <div className="space-y-6">
            <div className="lms-card">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-poppins font-bold text-white mb-2">Course Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Modules:</span>
                  <span className="text-white">{modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{modules.length * 2} hours</span>
                </div>
                {course.instructor && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Instructor:</span>
                    <span className="text-white">{course.instructor}</span>
                  </div>
                )}
                {course.assignedBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned by:</span>
                    <span className="text-lms-green">{course.assignedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {progressPercentage === 100 && (
              <div className="lms-card bg-lms-green/10 border-lms-green/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Award className="h-8 w-8 text-lms-green" />
                  <div>
                    <h3 className="text-lg font-poppins font-bold text-lms-green">
                      Course Completed!
                    </h3>
                    <p className="text-green-300 text-sm">
                      Certificate available in your profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/student?tab=certificates')}
                  className="w-full lms-button bg-lms-green/20 text-lms-green hover:bg-lms-green/30"
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
