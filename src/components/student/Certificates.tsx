
import { Award, Download } from 'lucide-react';
import { Certificate } from '@/types/student';

interface CertificatesProps {
  certificates: Certificate[];
  onGenerateCertificate: (certificate: Certificate) => void;
}

export const Certificates = ({ certificates, onGenerateCertificate }: CertificatesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins font-bold text-white">My Certificates</h2>
      
      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-24 w-24 text-gray-500 mx-auto mb-6" />
          <h3 className="text-2xl font-poppins font-bold text-white mb-4">
            No Certificates Yet
          </h3>
          <p className="text-gray-400">
            Complete courses to earn certificates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="lms-card">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-lms-yellow" />
                <div>
                  <h3 className="text-lg font-poppins font-bold text-white">
                    {certificate.courseName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Completed on {certificate.completionDate}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-300 text-sm">
                  <strong>Duration:</strong> {certificate.duration}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Grade:</strong> {certificate.grade}
                </p>
              </div>
              
              <button
                onClick={() => onGenerateCertificate(certificate)}
                className="w-full lms-button bg-lms-yellow/20 text-lms-yellow hover:bg-lms-yellow/30 flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
