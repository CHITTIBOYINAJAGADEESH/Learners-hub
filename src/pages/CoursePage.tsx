
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Lock, Award, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  id: number;
  title: string;
  content: string;
  isCompleted: boolean;
  isLocked: boolean;
  mcqs: MCQ[];
}

interface StudentProgress {
  courseId: number;
  studentId: number;
  completedModules: number[];
  overallProgress: number;
  isCompleted: boolean;
  completionDate?: string;
}

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [course, setCourse] = useState<any>(null);

  // Initialize course and student progress
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load course data
    const courseId = parseInt(id || '1');
    let courseData = null;

    // For students, check if course is assigned to them
    if (userRole === 'student') {
      const courseAssignments = JSON.parse(localStorage.getItem('courseAssignments') || '[]');
      const studentEmail = localStorage.getItem('userEmail');
      
      // Mock student data - in real app, you'd get this from backend
      const students = [
        { id: 1, email: 'john@example.com' },
        { id: 2, email: 'jane@example.com' },
        { id: 3, email: 'mike@example.com' },
        { id: 4, email: 'student@learnershub.com' }
      ];
      
      const currentStudent = students.find(s => s.email === studentEmail);
      if (!currentStudent) {
        toast({
          title: "Access Denied",
          description: "Student account not found.",
          variant: "destructive",
        });
        navigate('/student');
        return;
      }

      const isAssigned = courseAssignments.some((assignment: any) => 
        assignment.courseId === courseId && assignment.studentId === currentStudent.id
      );

      if (!isAssigned) {
        toast({
          title: "Access Denied",
          description: "This course is not assigned to you.",
          variant: "destructive",
        });
        navigate('/student');
        return;
      }

      // Load student progress
      const savedProgress = JSON.parse(localStorage.getItem('studentProgress') || '[]');
      let progress = savedProgress.find((p: StudentProgress) => 
        p.courseId === courseId && p.studentId === currentStudent.id
      );

      if (!progress) {
        progress = {
          courseId,
          studentId: currentStudent.id,
          completedModules: [],
          overallProgress: 0,
          isCompleted: false
        };
        savedProgress.push(progress);
        localStorage.setItem('studentProgress', JSON.stringify(savedProgress));
      }
      setStudentProgress(progress);
    }

    // Load course data from admin courses
    const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    courseData = adminCourses.find((c: any) => c.id === courseId);

    if (!courseData) {
      // Fallback to mock data
      courseData = {
        id: courseId,
        title: "Introduction to Programming",
        description: "Learn the fundamentals of programming with hands-on exercises",
        instructor: "Dr. Smith",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        modules: []
      };
    }

    // Load instructor modules for this course
    const instructorModules = JSON.parse(localStorage.getItem('instructorModules') || '[]');
    const courseModules = instructorModules.filter((m: any) => m.courseId === courseId);

    if (courseModules.length > 0) {
      // Use instructor-created modules
      courseData.modules = courseModules.map((module: any, index: number) => ({
        ...module,
        isCompleted: studentProgress?.completedModules.includes(module.id) || false,
        isLocked: index === 0 ? false : !studentProgress?.completedModules.includes(courseModules[index - 1]?.id)
      }));
    } else {
      // Fallback to default modules
      courseData.modules = [
        {
          id: 1,
          title: "Getting Started with Programming",
          content: "In this module, you'll learn the basic concepts of programming including variables, data types, and basic syntax. Programming is the process of creating instructions for computers to follow.",
          isCompleted: studentProgress?.completedModules.includes(1) || false,
          isLocked: false,
          mcqs: [
            {
              id: 1,
              question: "What is a variable in programming?",
              options: ["A fixed value", "A container for storing data", "A programming language", "A computer component"],
              correctAnswer: 1
            },
            {
              id: 2,
              question: "Which of the following is a primitive data type?",
              options: ["Array", "Object", "Integer", "Class"],
              correctAnswer: 2
            },
            {
              id: 3,
              question: "What does 'syntax' mean in programming?",
              options: ["The meaning of code", "The rules for writing code", "The speed of execution", "The memory usage"],
              correctAnswer: 1
            },
            {
              id: 4,
              question: "What is debugging?",
              options: ["Writing new code", "Finding and fixing errors", "Running code", "Saving code"],
              correctAnswer: 1
            },
            {
              id: 5,
              question: "Which symbol is commonly used for assignment in many programming languages?",
              options: ["==", "=", "!=", "=>"],
              correctAnswer: 1
            }
          ]
        },
        {
          id: 2,
          title: "Control Structures",
          content: "Learn about conditional statements, loops, and how to control the flow of your programs. Control structures allow you to make decisions and repeat actions in your code.",
          isCompleted: studentProgress?.completedModules.includes(2) || false,
          isLocked: !studentProgress?.completedModules.includes(1),
          mcqs: [
            {
              id: 1,
              question: "What is an if statement used for?",
              options: ["Looping", "Making decisions", "Storing data", "Printing output"],
              correctAnswer: 1
            },
            {
              id: 2,
              question: "Which loop runs at least once?",
              options: ["for loop", "while loop", "do-while loop", "if loop"],
              correctAnswer: 2
            },
            {
              id: 3,
              question: "What does 'else' do in an if-else statement?",
              options: ["Repeats the if condition", "Executes when if condition is false", "Ends the program", "Creates a loop"],
              correctAnswer: 1
            },
            {
              id: 4,
              question: "What is the purpose of a loop?",
              options: ["To store data", "To repeat code", "To make decisions", "To end programs"],
              correctAnswer: 1
            },
            {
              id: 5,
              question: "Which operator is used for 'not equal' in most languages?",
              options: ["=", "==", "!=", "<>"],
              correctAnswer: 2
            }
          ]
        },
        {
          id: 3,
          title: "Functions and Methods",
          content: "Discover how to organize your code using functions and methods. Functions help you write reusable code and break down complex problems into smaller, manageable pieces.",
          isCompleted: studentProgress?.completedModules.includes(3) || false,
          isLocked: !studentProgress?.completedModules.includes(2),
          mcqs: [
            {
              id: 1,
              question: "What is a function?",
              options: ["A variable", "A reusable block of code", "A data type", "A loop"],
              correctAnswer: 1
            },
            {
              id: 2,
              question: "What are function parameters?",
              options: ["Return values", "Input values", "Variable names", "Function names"],
              correctAnswer: 1
            },
            {
              id: 3,
              question: "What does 'return' do in a function?",
              options: ["Starts the function", "Ends the function and gives back a value", "Creates a loop", "Prints output"],
              correctAnswer: 1
            },
            {
              id: 4,
              question: "What is function scope?",
              options: ["Function speed", "Where variables can be accessed", "Function size", "Function type"],
              correctAnswer: 1
            },
            {
              id: 5,
              question: "Why are functions useful?",
              options: ["They make code longer", "They make code reusable", "They slow down programs", "They use more memory"],
              correctAnswer: 1
            }
          ]
        }
      ];
    }

    setCourse(courseData);
  }, [id, navigate]);

  const handleBack = () => {
    const userRole = localStorage.getItem('userRole');
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

  const handleModuleSelect = (module: Module) => {
    if (module.isLocked) {
      toast({
        title: "Module Locked",
        description: "Complete the previous module to unlock this one.",
        variant: "destructive",
      });
      return;
    }
    setSelectedModule(module);
    setShowQuiz(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
  };

  const handleStartQuiz = () => {
    if (!selectedModule || selectedModule.mcqs.length === 0) {
      toast({
        title: "No Quiz Available",
        description: "This module doesn't have a quiz yet.",
        variant: "destructive",
      });
      return;
    }
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(selectedModule.mcqs.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const updateModuleLockStatus = (moduleId: number) => {
    if (!course || !studentProgress) return;

    // Update course modules lock status
    const updatedModules = course.modules.map((module: Module, index: number) => {
      if (module.id === moduleId) {
        return { ...module, isCompleted: true };
      }
      
      // Unlock next module if current one is completed
      if (index > 0 && course.modules[index - 1].id === moduleId) {
        return { ...module, isLocked: false };
      }
      
      return module;
    });

    setCourse({ ...course, modules: updatedModules });
  };

  const updateStudentProgress = (moduleId: number) => {
    if (!studentProgress || !course) return;

    const updatedProgress = { ...studentProgress };
    if (!updatedProgress.completedModules.includes(moduleId)) {
      updatedProgress.completedModules.push(moduleId);
    }

    // Calculate overall progress
    updatedProgress.overallProgress = (updatedProgress.completedModules.length / course.modules.length) * 100;

    // Check if course is completed
    if (updatedProgress.completedModules.length === course.modules.length) {
      updatedProgress.isCompleted = true;
      updatedProgress.completionDate = new Date().toISOString();
    }

    setStudentProgress(updatedProgress);

    // Save to localStorage
    const allProgress = JSON.parse(localStorage.getItem('studentProgress') || '[]');
    const progressIndex = allProgress.findIndex((p: StudentProgress) => 
      p.courseId === updatedProgress.courseId && p.studentId === updatedProgress.studentId
    );

    if (progressIndex !== -1) {
      allProgress[progressIndex] = updatedProgress;
    } else {
      allProgress.push(updatedProgress);
    }

    localStorage.setItem('studentProgress', JSON.stringify(allProgress));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedModule!.mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and complete quiz
      const correctAnswers = selectedModule!.mcqs.filter((mcq, index) => 
        mcq.correctAnswer === selectedAnswers[index]
      ).length;
      const score = Math.round((correctAnswers / selectedModule!.mcqs.length) * 100);
      setQuizScore(score);
      setQuizCompleted(true);
      
      if (score >= 70) {
        toast({
          title: "Quiz Completed!",
          description: `Great job! You scored ${score}%. Module completed!`,
        });
        
        // Update student progress and unlock next module
        updateStudentProgress(selectedModule!.id);
        updateModuleLockStatus(selectedModule!.id);
        
        // Check if course is completed
        if (studentProgress && studentProgress.completedModules.length + 1 === course.modules.length) {
          toast({
            title: "Course Completed!",
            description: "Congratulations! You've completed the entire course. Certificate available for download.",
          });
        }
      } else {
        toast({
          title: "Quiz Failed",
          description: `You scored ${score}%. You need 70% to pass. Try again!`,
          variant: "destructive",
        });
      }
    }
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(selectedModule!.mcqs.length).fill(-1));
  };

  const handleDownloadCertificate = () => {
    if (!studentProgress?.isCompleted || !course) {
      toast({
        title: "Certificate Not Available",
        description: "Complete all modules to download your certificate.",
        variant: "destructive",
      });
      return;
    }

    const studentName = localStorage.getItem('userName') || 'Student';
    const completionDate = new Date(studentProgress.completionDate!).toLocaleDateString();
    
    // Create certificate HTML
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body { 
            font-family: 'Georgia', serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border: 10px solid #gold;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 3px solid #ddd;
            border-radius: 10px;
          }
          h1 { 
            font-size: 48px; 
            color: #333; 
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          .subtitle { 
            font-size: 24px; 
            color: #666; 
            margin-bottom: 40px; 
          }
          .student-name { 
            font-size: 36px; 
            color: #8B4513; 
            font-weight: bold; 
            margin: 30px 0;
            text-decoration: underline;
          }
          .course-title { 
            font-size: 28px; 
            color: #333; 
            margin: 30px 0;
            font-style: italic;
          }
          .completion-date { 
            font-size: 18px; 
            color: #666; 
            margin-top: 40px; 
          }
          .signature-section { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 60px; 
            font-size: 16px;
          }
          .signature-line { 
            border-top: 2px solid #333; 
            width: 200px; 
            padding-top: 10px; 
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Completion</h1>
          <div class="subtitle">This is to certify that</div>
          <div class="student-name">${studentName}</div>
          <div class="subtitle">has successfully completed the course</div>
          <div class="course-title">${course.title}</div>
          <div class="completion-date">Completed on: ${completionDate}</div>
          <div class="signature-section">
            <div class="signature-line">
              <div>Student Signature</div>
            </div>
            <div class="signature-line">
              <div>Instructor Signature</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the certificate
    const blob = new Blob([certificateHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title}_Certificate_${studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully!",
    });
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-lms-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading course...</div>
      </div>
    );
  }

  const progress = studentProgress ? studentProgress.overallProgress : 0;

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
                <BookOpen className="h-8 w-8 text-lms-blue" />
                <div>
                  <h1 className="text-xl font-poppins font-bold text-white">{course.title}</h1>
                  <p className="text-gray-400 text-sm">Instructor: {course.instructor}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Overall Progress</div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-lms-green h-2 rounded-full transition-all duration-300" 
                      style={{width: `${progress}%`}}
                    ></div>
                  </div>
                  <span className="text-lms-green font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
              {studentProgress?.isCompleted && (
                <button
                  onClick={handleDownloadCertificate}
                  className="lms-button-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-poppins font-bold text-white mb-4">Course Modules</h2>
            <div className="space-y-3">
              {course.modules.map((module: Module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedModule?.id === module.id
                      ? 'border-lms-blue bg-lms-blue/10'
                      : module.isLocked
                      ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
                      : 'border-gray-600 hover:border-gray-500 bg-lms-gray'
                  }`}
                  disabled={module.isLocked}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {module.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-lms-green" />
                      ) : module.isLocked ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Play className="h-5 w-5 text-lms-blue" />
                      )}
                      <div>
                        <h3 className={`font-medium ${
                          module.isLocked ? 'text-gray-500' : 'text-white'
                        }`}>
                          {module.title}
                        </h3>
                        <p className={`text-sm ${
                          module.isLocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          Module {module.id}
                        </p>
                      </div>
                    </div>
                    {module.isCompleted && (
                      <Award className="h-4 w-4 text-lms-green" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-2">
            {!selectedModule ? (
              <div className="lms-card text-center">
                <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-bold text-white mb-2">
                  Select a Module
                </h3>
                <p className="text-gray-400">
                  Choose a module from the left to start learning
                </p>
              </div>
            ) : !showQuiz ? (
              <div className="space-y-6">
                <div className="lms-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-poppins font-bold text-white">
                      {selectedModule.title}
                    </h2>
                    {selectedModule.isCompleted && (
                      <CheckCircle className="h-6 w-6 text-lms-green" />
                    )}
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedModule.content}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                      Learning Objectives
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Understand core concepts and terminology</li>
                      <li>• Apply knowledge through practical examples</li>
                      <li>• Complete hands-on exercises</li>
                      <li>• Pass the module assessment</li>
                    </ul>
                  </div>
                </div>

                <div className="lms-card">
                  <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                    Module Assessment
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Complete the quiz to test your understanding and unlock the next module.
                    You need a score of 70% or higher to pass.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleStartQuiz}
                      className="lms-button-primary"
                      disabled={selectedModule.mcqs.length === 0}
                    >
                      {selectedModule.isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                    {selectedModule.mcqs.length > 0 && (
                      <span className="text-gray-400 text-sm">
                        {selectedModule.mcqs.length} questions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : !quizCompleted ? (
              <div className="lms-card">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">
                      Question {currentQuestionIndex + 1} of {selectedModule.mcqs.length}
                    </span>
                    <span className="text-lms-blue">
                      {Math.round(((currentQuestionIndex + 1) / selectedModule.mcqs.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-lms-blue h-2 rounded-full transition-all duration-300"
                      style={{width: `${((currentQuestionIndex + 1) / selectedModule.mcqs.length) * 100}%`}}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-poppins font-bold text-white mb-6">
                  {selectedModule.mcqs[currentQuestionIndex].question}
                </h3>

                <div className="space-y-3 mb-8">
                  {selectedModule.mcqs[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-lms-blue bg-lms-blue/10 text-white'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? 'border-lms-blue bg-lms-blue'
                            : 'border-gray-500'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="lms-button bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === -1}
                    className="lms-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestionIndex === selectedModule.mcqs.length - 1 ? 'Finish Quiz' : 'Next'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="lms-card text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  quizScore >= 70 ? 'bg-lms-green/20' : 'bg-red-500/20'
                }`}>
                  {quizScore >= 70 ? (
                    <CheckCircle className="h-10 w-10 text-lms-green" />
                  ) : (
                    <span className="text-2xl font-bold text-red-400">{quizScore}%</span>
                  )}
                </div>
                
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">
                  {quizScore >= 70 ? 'Congratulations!' : 'Quiz Failed'}
                </h3>
                
                <p className="text-gray-400 mb-2">
                  You scored {quizScore}% on this quiz
                </p>
                
                <p className="text-gray-500 mb-6">
                  {quizScore >= 70 
                    ? 'You passed! The next module has been unlocked.' 
                    : 'You need 70% to pass. Review the material and try again.'
                  }
                </p>

                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => setShowQuiz(false)}
                    className="lms-button bg-gray-600 hover:bg-gray-700"
                  >
                    Back to Module
                  </button>
                  {quizScore < 70 && (
                    <button 
                      onClick={handleRetakeQuiz}
                      className="lms-button-primary"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
