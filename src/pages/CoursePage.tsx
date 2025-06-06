import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Lock, Award, Download, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

interface CertificateDetails {
  studentName: string;
  courseName: string;
  duration: string;
  completionDate: string;
  grade: string;
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
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateDetails, setCertificateDetails] = useState<CertificateDetails>({
    studentName: '',
    courseName: '',
    duration: '',
    completionDate: '',
    grade: 'Excellent'
  });
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);

  // Generate random duration in months
  const generateRandomDuration = () => {
    const months = Math.floor(Math.random() * 12) + 1; // 1-12 months
    return months === 1 ? '1 month' : `${months} months`;
  };

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
      const userEmail = localStorage.getItem('userEmail');
      
      // Mock student data - in real app, you'd get this from backend
      const students = [
        { id: 1, email: 'john@example.com' },
        { id: 2, email: 'jane@example.com' },
        { id: 3, email: 'mike@example.com' },
        { id: 4, email: 'student@learnershub.com' }
      ];
      
      const currentStudent = students.find(s => s.email === userEmail);
      if (!currentStudent) {
        toast({
          title: "Access Denied",
          description: "Student account not found.",
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

    // Load course data from admin courses or enrolled courses
    const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const userEmail = localStorage.getItem('userEmail');
    const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${userEmail}`) || '[]');
    
    courseData = adminCourses.find((c: any) => c.id === courseId) || 
                 enrolledCourses.find((c: any) => c.id === courseId);

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

    // Initialize certificate details
    const userName = localStorage.getItem('userName') || 'Student';
    setCertificateDetails({
      studentName: userName,
      courseName: courseData.title,
      duration: generateRandomDuration(),
      completionDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      grade: 'Excellent'
    });
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

  const handleCompleteModule = () => {
    if (!selectedModule || !studentProgress || !course) return;

    // Mark current module as completed
    updateStudentProgress(selectedModule.id);
    updateModuleLockStatus(selectedModule.id);

    // Find next module
    const currentIndex = course.modules.findIndex((m: Module) => m.id === selectedModule.id);
    const nextModule = course.modules[currentIndex + 1];

    // Check if all modules are completed
    const updatedCompletedModules = [...studentProgress.completedModules];
    if (!updatedCompletedModules.includes(selectedModule.id)) {
      updatedCompletedModules.push(selectedModule.id);
    }

    if (updatedCompletedModules.length === course.modules.length) {
      // All modules completed - show certificate modal
      setShowCertificateModal(true);
      toast({
        title: "🎉 Congratulations!",
        description: "You've completed all modules! Your certificate is ready.",
      });
    } else if (nextModule && !nextModule.isCompleted) {
      // Auto-select next module
      setSelectedModule({
        ...nextModule,
        isLocked: false
      });
      toast({
        title: "Module Completed!",
        description: `Great job! Moving to next module: ${nextModule.title}`,
      });
    } else {
      toast({
        title: "Module Completed!",
        description: "Well done! Select another module to continue.",
      });
    }
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

  const generateCertificatePDF = (details: CertificateDetails) => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Certificate background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer border (gold)
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(4);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Inner border
    pdf.setDrawColor(102, 126, 234);
    pdf.setLineWidth(2);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Header - Institution
    pdf.setFontSize(18);
    pdf.setTextColor(102, 126, 234);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEARNERS HUB EDUCATIONAL INSTITUTE', pageWidth / 2, 25, { align: 'center' });

    // Subtitle
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('AICTE Approved Institution - Reg. No: AICTE/2024/ED/001', pageWidth / 2, 32, { align: 'center' });

    // Certificate Title
    pdf.setFontSize(36);
    pdf.setTextColor(212, 175, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 50, { align: 'center' });

    // Decorative line
    pdf.setLineWidth(1);
    pdf.setDrawColor(212, 175, 55);
    pdf.line(60, 55, pageWidth - 60, 55);

    // Main content
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

    // Student Name
    pdf.setFontSize(28);
    pdf.setTextColor(102, 126, 234);
    pdf.setFont('helvetica', 'bold');
    pdf.text(details.studentName.toUpperCase(), pageWidth / 2, 85, { align: 'center' });

    // Course completion text
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text('has successfully completed the online course', pageWidth / 2, 100, { align: 'center' });

    // Course Name
    pdf.setFontSize(22);
    pdf.setTextColor(102, 126, 234);
    pdf.setFont('helvetica', 'bold');
    
    // Handle long course names
    const maxWidth = 200;
    const courseNameLines = pdf.splitTextToSize(details.courseName, maxWidth);
    if (courseNameLines.length === 1) {
      pdf.text(details.courseName, pageWidth / 2, 115, { align: 'center' });
    } else {
      let yPos = 112;
      courseNameLines.forEach((line: string) => {
        pdf.text(line, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
      });
    }

    // Course details
    pdf.setFontSize(14);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Duration: ${details.duration}`, pageWidth / 2, 135, { align: 'center' });
    pdf.text(`Completion Date: ${details.completionDate}`, pageWidth / 2, 145, { align: 'center' });
    pdf.text(`Grade: ${details.grade}`, pageWidth / 2, 155, { align: 'center' });

    // Certificate ID
    const certificateId = `LH${Date.now().toString().slice(-8)}`;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Certificate ID: ${certificateId}`, pageWidth / 2, 165, { align: 'center' });

    // Signature section
    const signatureY = pageHeight - 35;
    
    // Left signature (Director)
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(60, 60, 60);
    pdf.line(40, signatureY, 100, signatureY);
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dr. Rajesh Kumar', 70, signatureY + 5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.text('Director', 70, signatureY + 10, { align: 'center' });
    pdf.text('Learners Hub', 70, signatureY + 15, { align: 'center' });

    // Right signature (Academic Head)
    pdf.line(pageWidth - 100, signatureY, pageWidth - 40, signatureY);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Prof. Sunita Sharma', pageWidth - 70, signatureY + 5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.text('Academic Head', pageWidth - 70, signatureY + 10, { align: 'center' });
    pdf.text('AICTE Board', pageWidth - 70, signatureY + 15, { align: 'center' });

    // AICTE Stamp (circular)
    const stampX = pageWidth - 50;
    const stampY = pageHeight - 65;
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(2);
    pdf.circle(stampX, stampY, 18, 'S');
    
    // Inner stamp details
    pdf.setFontSize(8);
    pdf.setTextColor(220, 38, 38);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AICTE', stampX, stampY - 5, { align: 'center' });
    pdf.text('APPROVED', stampX, stampY, { align: 'center' });
    pdf.text('2024', stampX, stampY + 5, { align: 'center' });

    // Institution Seal (square)
    const sealX = 50;
    const sealY = pageHeight - 65;
    pdf.setDrawColor(102, 126, 234);
    pdf.setLineWidth(2);
    pdf.rect(sealX - 15, sealY - 15, 30, 30, 'S');
    
    pdf.setFontSize(6);
    pdf.setTextColor(102, 126, 234);
    pdf.text('LEARNERS', sealX, sealY - 8, { align: 'center' });
    pdf.text('HUB', sealX, sealY - 3, { align: 'center' });
    pdf.text('INSTITUTE', sealX, sealY + 2, { align: 'center' });
    pdf.text('EST. 2020', sealX, sealY + 8, { align: 'center' });

    // Footer note
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.text('This certificate is digitally generated and verified. Visit www.learnershub.edu for verification.', pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Download the PDF
    const fileName = `${details.courseName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate_${details.studentName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    // Save certificate to localStorage
    const userEmail = localStorage.getItem('userEmail');
    const existingCertificates = JSON.parse(localStorage.getItem(`studentCertificates_${userEmail}`) || '[]');
    const newCertificate = {
      id: certificateId,
      courseName: details.courseName,
      completionDate: details.completionDate,
      duration: details.duration,
      studentName: details.studentName,
      grade: details.grade
    };
    existingCertificates.push(newCertificate);
    localStorage.setItem(`studentCertificates_${userEmail}`, JSON.stringify(existingCertificates));

    toast({
      title: "Certificate Downloaded!",
      description: "Your certificate has been downloaded successfully and saved to your profile.",
    });
  };

  const handleDownloadCertificate = () => {
    generateCertificatePDF(certificateDetails);
    setShowCertificateModal(false);
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
                  onClick={() => setShowCertificateModal(true)}
                  className="lms-button-primary flex items-center space-x-2"
                >
                  <Award className="h-4 w-4" />
                  <span>Get Certificate</span>
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
                    Module Actions
                  </h3>
                  <div className="flex items-center space-x-4">
                    {!selectedModule.isCompleted && (
                      <button 
                        onClick={handleCompleteModule}
                        className="lms-button-primary flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete Module</span>
                      </button>
                    )}
                    <button 
                      onClick={handleStartQuiz}
                      className="lms-button bg-lms-blue/20 text-lms-blue hover:bg-lms-blue/30"
                      disabled={selectedModule.mcqs.length === 0}
                    >
                      {selectedModule.isCompleted ? 'Retake Quiz' : 'Take Quiz'}
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

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-lms-gray rounded-xl p-6 w-full max-w-md modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-poppins font-bold text-white flex items-center space-x-2">
                <Award className="h-6 w-6 text-lms-yellow" />
                <span>Get Certificate</span>
              </h3>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Student Name</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={certificateDetails.studentName}
                    onChange={(e) => setCertificateDetails(prev => ({ ...prev, studentName: e.target.value }))}
                    className="lms-input flex-1"
                    disabled={!isEditingCertificate}
                  />
                  <button
                    onClick={() => setIsEditingCertificate(!isEditingCertificate)}
                    className="lms-button bg-gray-600 hover:bg-gray-700 p-2"
                  >
                    {isEditingCertificate ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Course Name</label>
                <input
                  type="text"
                  value={certificateDetails.courseName}
                  onChange={(e) => setCertificateDetails(prev => ({ ...prev, courseName: e.target.value }))}
                  className="lms-input"
                  disabled={!isEditingCertificate}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={certificateDetails.duration}
                  onChange={(e) => setCertificateDetails(prev => ({ ...prev, duration: e.target.value }))}
                  className="lms-input"
                  disabled={!isEditingCertificate}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Completion Date</label>
                <input
                  type="text"
                  value={certificateDetails.completionDate}
                  onChange={(e) => setCertificateDetails(prev => ({ ...prev, completionDate: e.target.value }))}
                  className="lms-input"
                  disabled={!isEditingCertificate}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Grade</label>
                <select
                  value={certificateDetails.grade}
                  onChange={(e) => setCertificateDetails(prev => ({ ...prev, grade: e.target.value }))}
                  className="lms-input"
                  disabled={!isEditingCertificate}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Outstanding">Outstanding</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDownloadCertificate}
                className="lms-button-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="lms-button bg-gray-600 hover:bg-gray-700 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
