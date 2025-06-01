
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, Play, Star, CheckCircle } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-lms-dark overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-lms-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-lms-blue" />
              <span className="text-2xl font-poppins font-bold text-white">Learners Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/login" className="lms-button-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-6 leading-tight">
              Welcome to <span className="text-lms-blue">Learners Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced Learning Management System for Admins, Instructors, and Students
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/register" className="lms-button-primary flex items-center space-x-2">
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/home" className="lms-button flex items-center space-x-2 bg-transparent border-2 border-gray-600 text-white hover:border-lms-blue">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-lms-blue mb-2">500+</div>
                <div className="text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lms-green mb-2">50+</div>
                <div className="text-gray-400">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lms-purple mb-2">100+</div>
                <div className="text-gray-400">Courses Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-lms-blue/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-lms-green/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-lms-purple/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">
              Three Powerful User Roles
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Designed for comprehensive learning management with role-based access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin */}
            <div className="lms-card group hover:scale-105 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-lms-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                  <Users className="h-8 w-8 text-lms-blue" />
                </div>
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">Admin Panel</h3>
                <ul className="text-gray-400 space-y-2 text-left">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Create & manage courses</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Add MCQ questions</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Monitor user activity</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Manage user accounts</li>
                </ul>
              </div>
            </div>

            {/* Instructor */}
            <div className="lms-card group hover:scale-105 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-lms-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                  <BookOpen className="h-8 w-8 text-lms-green" />
                </div>
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">Instructor Dashboard</h3>
                <ul className="text-gray-400 space-y-2 text-left">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Assign courses to students</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Create course modules</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Design module quizzes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Track student progress</li>
                </ul>
              </div>
            </div>

            {/* Student */}
            <div className="lms-card group hover:scale-105 transition-all duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-lms-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow">
                  <Award className="h-8 w-8 text-lms-purple" />
                </div>
                <h3 className="text-2xl font-poppins font-bold text-white mb-4">Student Portal</h3>
                <ul className="text-gray-400 space-y-2 text-left">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Access assigned courses</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Complete module quizzes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Track learning progress</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-lms-green mr-2" /> Earn certificates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="lms-card max-w-4xl mx-auto">
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">
              Ready to Transform Learning?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of learners, instructors, and administrators already using Learners Hub
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="lms-button-primary">
                Start Your Journey
              </Link>
              <Link to="/login" className="lms-button bg-transparent border-2 border-gray-600 text-white hover:border-lms-blue">
                Sign In
              </Link>
            </div>
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

export default Index;
