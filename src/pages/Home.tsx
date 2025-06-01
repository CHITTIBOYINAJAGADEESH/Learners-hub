
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Users, Award, TrendingUp, Globe, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-lms-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
              <BookOpen className="h-8 w-8 text-lms-blue" />
              <span className="text-2xl font-poppins font-bold text-white">Learners Hub</span>
            </Link>
            <Link to="/login" className="lms-button-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-white mb-6 animate-fadeIn">
            How Learners Hub Works
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeIn">
            A comprehensive workflow designed for seamless collaboration between administrators, instructors, and students
          </p>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-poppins font-bold text-white text-center mb-16">
              Platform Workflow
            </h2>

            {/* Workflow Steps */}
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-lms-blue via-lms-green to-lms-purple transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Step 1: Admin */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-lms-blue rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-white mb-4">1. Admin Creates</h3>
                  <div className="lms-card text-left">
                    <ul className="space-y-2 text-gray-300">
                      <li>• Creates comprehensive courses</li>
                      <li>• Defines learning modules</li>
                      <li>• Adds MCQ question banks</li>
                      <li>• Manages user accounts</li>
                      <li>• Monitors platform activity</li>
                    </ul>
                  </div>
                </div>

                {/* Step 2: Instructor */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-lms-green rounded-full flex items-center justify-center mx-auto mb-6 animate-glow" style={{animationDelay: '0.5s'}}>
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-white mb-4">2. Instructor Manages</h3>
                  <div className="lms-card text-left">
                    <ul className="space-y-2 text-gray-300">
                      <li>• Reviews admin-created courses</li>
                      <li>• Assigns courses to students</li>
                      <li>• Creates detailed module content</li>
                      <li>• Designs module-specific quizzes</li>
                      <li>• Tracks student performance</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3: Student */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-lms-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-glow" style={{animationDelay: '1s'}}>
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-poppins font-bold text-white mb-4">3. Student Learns</h3>
                  <div className="lms-card text-left">
                    <ul className="space-y-2 text-gray-300">
                      <li>• Enrolls in assigned courses</li>
                      <li>• Completes modules sequentially</li>
                      <li>• Takes module-specific quizzes</li>
                      <li>• Tracks learning progress</li>
                      <li>• Earns completion certificates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-lms-gray">
        <div className="container mx-auto">
          <h2 className="text-4xl font-poppins font-bold text-white text-center mb-16">
            Why Choose Learners Hub?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lms-card">
              <TrendingUp className="h-12 w-12 text-lms-blue mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">Progress Tracking</h3>
              <p className="text-gray-400">Real-time monitoring of student progress with detailed analytics and completion rates.</p>
            </div>

            <div className="lms-card">
              <Globe className="h-12 w-12 text-lms-green mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">Responsive Design</h3>
              <p className="text-gray-400">Fully responsive platform that works seamlessly across all devices and screen sizes.</p>
            </div>

            <div className="lms-card">
              <Shield className="h-12 w-12 text-lms-purple mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">Role-Based Security</h3>
              <p className="text-gray-400">Secure role-based access control ensuring data privacy and proper user permissions.</p>
            </div>

            <div className="lms-card">
              <Zap className="h-12 w-12 text-lms-yellow mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">Interactive Quizzes</h3>
              <p className="text-gray-400">Module-specific MCQ assessments with instant feedback and progress gates.</p>
            </div>

            <div className="lms-card">
              <Award className="h-12 w-12 text-lms-blue mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">Digital Certificates</h3>
              <p className="text-gray-400">Automated certificate generation with downloadable PDF format upon course completion.</p>
            </div>

            <div className="lms-card">
              <Users className="h-12 w-12 text-lms-green mb-4" />
              <h3 className="text-xl font-poppins font-bold text-white mb-3">User Management</h3>
              <p className="text-gray-400">Comprehensive user management with activity tracking and account administration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-poppins font-bold text-white text-center mb-16">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="lms-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lms-blue rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Admin User</h4>
                  <p className="text-gray-400 text-sm">University Administrator</p>
                </div>
              </div>
              <p className="text-gray-300">"The admin panel is incredibly intuitive. Managing courses and tracking student progress has never been easier."</p>
            </div>

            <div className="lms-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lms-green rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">I</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Instructor</h4>
                  <p className="text-gray-400 text-sm">Computer Science Professor</p>
                </div>
              </div>
              <p className="text-gray-300">"Creating modules and quizzes is streamlined. The platform makes course management effortless."</p>
            </div>

            <div className="lms-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lms-purple rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Student</h4>
                  <p className="text-gray-400 text-sm">Computer Science Major</p>
                </div>
              </div>
              <p className="text-gray-300">"The learning experience is engaging and the progress tracking keeps me motivated to complete courses."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-lms-gray">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-poppins font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our platform today and experience the future of learning management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="lms-button-primary">
              Create Account
            </Link>
            <Link to="/login" className="lms-button bg-transparent border-2 border-gray-600 text-white hover:border-lms-blue">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-lms-blue" />
            <span className="text-xl font-poppins font-bold text-white">Learners Hub</span>
          </div>
          <p className="text-gray-400">© 2024 Learners Hub. Empowering education through technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
