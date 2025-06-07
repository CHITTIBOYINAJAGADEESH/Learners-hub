
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User, Play } from 'lucide-react';
import { Course } from '@/types/student';
import { useToast } from '@/hooks/use-toast';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('CourseDetailPage mounted with courseId:', courseId);
    
    if (!courseId) {
      toast({
        title: "Error",
        description: "No course ID provided",
        variant: "destructive"
      });
      navigate('/student');
      return;
    }

    const loadCourse = () => {
      try {
        // Get all available courses
        const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
        console.log('Looking for course in admin courses:', adminCourses);
        
        // Find course by ID (handle both string and number IDs)
        const numericCourseId = parseInt(courseId);
        const foundCourse = adminCourses.find((c: Course) => {
          const courseIdMatch = c.id === numericCourseId || c.id.toString() === courseId;
          console.log(`Checking course ${c.id} against ${courseId}: ${courseIdMatch}`);
          return courseIdMatch;
        });

        if (foundCourse) {
          console.log('Course found:', foundCourse);
          setCourse(foundCourse);
        } else {
          console.error('Course not found for ID:', courseId);
          toast({
            title: "Course Not Found",
            description: "The course you're looking for could not be found.",
            variant: "destructive"
          });
          navigate('/student');
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast({
          title: "Error",
          description: "Failed to load course details.",
          variant: "destructive"
        });
        navigate('/student');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, navigate, toast]);

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
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate('/student')}
            className="lms-button-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Header */}
      <div className="bg-lms-card border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/student')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="lms-card">
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-poppins font-bold text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules} modules</span>
                </div>
                {course.instructor && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Instructor: {course.instructor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Modules */}
            <div className="lms-card">
              <h2 className="text-xl font-poppins font-bold text-white mb-4">
                Course Modules
              </h2>
              
              <div className="space-y-3">
                {Array.from({ length: course.modules }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-lms-dark rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-lms-blue/20 text-lms-blue rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          Module {i + 1}: Course Content
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Learn the fundamentals and advanced concepts
                        </p>
                      </div>
                    </div>
                    
                    <button className="flex items-center space-x-2 text-lms-blue hover:text-blue-400 transition-colors">
                      <Play className="h-4 w-4" />
                      <span className="text-sm">Start</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="lms-card">
              <h3 className="text-lg font-poppins font-bold text-white mb-4">
                Course Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Self-paced learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{course.modules} modules</span>
                </div>
                {course.instructor && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{course.instructor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="lms-card">
              <h3 className="text-lg font-poppins font-bold text-white mb-4">
                Your Progress
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-white">0%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-lms-blue h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-gray-400 text-sm">
                  Start your learning journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
