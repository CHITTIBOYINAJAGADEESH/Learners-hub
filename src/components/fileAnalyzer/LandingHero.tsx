
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export const LandingHero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">FileAnalyzer</span>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Analyze Any File with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}AI Power
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload documents, images, or any file format and get instant AI-powered analysis, 
            summaries, and insights. Download your results as professional PDF reports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4 hover-scale">
                  Start Analyzing Files
                </Button>
              </Link>
            )}
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 hover-scale">
                {isAuthenticated ? "Go to Dashboard" : "Login"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Drag & drop or click to upload PDF, DOCX, images, CSV and more formats
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
            <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Get intelligent summaries, extract key information, and OCR for images
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
            <Download className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">PDF Reports</h3>
            <p className="text-gray-600">
              Download professional PDF reports with all extracted insights
            </p>
          </div>
        </div>

        {/* Security Banner */}
        <div className="mt-16 p-6 bg-gray-900 rounded-xl text-white text-center">
          <Shield className="w-8 h-8 mx-auto mb-2" />
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-gray-300">
            Your files are processed securely and never stored permanently. Complete privacy guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};
