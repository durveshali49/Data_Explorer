import Container from '@/components/ui/Container';
import { Mail, Github, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact</h1>

        <div className="card p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            This project was built as part of a full-stack engineering assessment. Feel free to reach out
            or explore the codebase!
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Github className="w-6 h-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">GitHub Repository</h3>
                <a
                  href="https://github.com/yourusername/product-explorer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View on GitHub
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a
                  href="mailto:contact@example.com"
                  className="text-primary-600 hover:text-primary-700"
                >
                  contact@example.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <ExternalLink className="w-6 h-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">API Documentation</h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center"
                >
                  View Swagger Docs
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Links</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Frontend:</strong>{' '}
              <span className="text-gray-600">[Your deployed frontend URL]</span>
            </li>
            <li>
              <strong>Backend:</strong>{' '}
              <span className="text-gray-600">[Your deployed backend URL]</span>
            </li>
            <li>
              <strong>GitHub:</strong>{' '}
              <span className="text-gray-600">[Your GitHub repository URL]</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Submission Note</h3>
          <p className="text-blue-800">
            This project was submitted through the Google Form as per the assignment requirements.
            All deliverables including the live deployment links and GitHub repository are available.
          </p>
        </div>
      </div>
    </Container>
  );
}
