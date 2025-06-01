
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, CheckCircle, Lock, Award } from 'lucide-react';
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

  // Mock course data
  const course = {
    id: parseInt(id || '1'),
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with hands-on exercises",
    instructor: "Dr. Smith",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    modules: [
      {
        id: 1,
        title: "Getting Started with Programming",
        content: "In this module, you'll learn the basic concepts of programming including variables, data types, and basic syntax. Programming is the process of creating instructions for computers to follow.",
        isCompleted: true,
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
        isCompleted: true,
        isLocked: false,
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
        isCompleted: false,
        isLocked: false,
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
      },
      {
        id: 4,
        title: "Data Structures",
        content: "Learn about arrays, objects, and other ways to organize and store data efficiently in your programs.",
        isCompleted: false,
        isLocked: true,
        mcqs: []
      },
      {
        id: 5,
        title: "Final Project",
        content: "Apply everything you've learned by building a complete programming project from scratch.",
        isCompleted: false,
        isLocked: true,
        mcqs: []
      }
    ] as Module[]
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

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
          description: `Great job! You scored ${score}%. Module unlocked.`,
        });
        
        // Mark module as completed and unlock next module
        const moduleIndex = course.modules.findIndex(m => m.id === selectedModule!.id);
        if (moduleIndex !== -1) {
          course.modules[moduleIndex].isCompleted = true;
          if (moduleIndex + 1 < course.modules.length) {
            course.modules[moduleIndex + 1].isLocked = false;
          }
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

  const progress = (course.modules.filter(m => m.isCompleted).length / course.modules.length) * 100;

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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-poppins font-bold text-white mb-4">Course Modules</h2>
            <div className="space-y-3">
              {course.modules.map((module) => (
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
