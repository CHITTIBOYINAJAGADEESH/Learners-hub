
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, GraduationCap, Star, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-lms-dark">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-lms-purple" />
              <span className="text-2xl font-poppins font-bold text-white">Learners Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="lms-button bg-transparent border-lms-purple text-lms-purple hover:bg-lms-purple hover:text-white">
                Sign In
              </Link>
              <Link to="/register" className="lms-button-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold text-white leading-tight">
                Learn Without
                <span className="text-gradient"> Limits</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of learners worldwide and unlock your potential with our comprehensive learning management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="lms-button-primary text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="lms-button bg-transparent border-gray-600 text-white hover:border-white text-lg px-8 py-4">
                  Explore Courses
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop&crop=faces"
                alt="Students learning together"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-lms-purple/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-lms-blue/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-lms-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-white mb-4">
              Why Choose Learners Hub?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of education with our cutting-edge features designed for modern learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="lms-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-lms-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lms-blue/30 transition-colors">
                <BookOpen className="h-8 w-8 text-lms-blue" />
              </div>
              <h3 className="text-xl font-poppins font-bold text-white mb-4">Interactive Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Engage with dynamic content, quizzes, and hands-on projects that make learning exciting and effective.
              </p>
            </div>

            <div className="lms-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-lms-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lms-green/30 transition-colors">
                <Users className="h-8 w-8 text-lms-green" />
              </div>
              <h3 className="text-xl font-poppins font-bold text-white mb-4">Expert Instructors</h3>
              <p className="text-gray-300 leading-relaxed">
                Learn from industry professionals and experienced educators who are passionate about sharing knowledge.
              </p>
            </div>

            <div className="lms-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-lms-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lms-purple/30 transition-colors">
                <Award className="h-8 w-8 text-lms-purple" />
              </div>
              <h3 className="text-xl font-poppins font-bold text-white mb-4">Certified Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Earn recognized certificates upon course completion to showcase your new skills and achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-lms-blue mb-2">50K+</div>
              <div className="text-gray-300">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-lms-green mb-2">500+</div>
              <div className="text-gray-300">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-lms-purple mb-2">1000+</div>
              <div className="text-gray-300">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-lms-yellow mb-2">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-lms-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-300">
              Real stories from real learners who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lms-card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-lms-yellow fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "The courses are incredibly well-structured and the instructors are top-notch. I landed my dream job after completing the web development track!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612f1e8?w=50&h=50&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">Software Developer</div>
                </div>
              </div>
            </div>

            <div className="lms-card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-lms-yellow fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "Amazing platform! The interactive exercises and project-based learning helped me gain practical skills that I use daily in my work."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">Michael Chen</div>
                  <div className="text-gray-400 text-sm">Data Analyst</div>
                </div>
              </div>
            </div>

            <div className="lms-card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-lms-yellow fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "The flexibility to learn at my own pace while working full-time was exactly what I needed. Highly recommend to working professionals!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
                  alt="Student"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">Emily Rodriguez</div>
                  <div className="text-gray-400 text-sm">Marketing Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="lms-card text-center max-w-4xl mx-auto">
            <GraduationCap className="h-16 w-16 text-lms-purple mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of learners and take the first step towards achieving your goals. 
              Get started today with our free courses!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="lms-button-primary text-lg px-8 py-4">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="lms-button bg-transparent border-gray-600 text-white hover:border-white text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-lms-purple" />
              <span className="text-xl font-poppins font-bold text-white">Learners Hub</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Jagadeesh. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
