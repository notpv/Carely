import React from 'react';
import { BookOpen } from 'lucide-react';

const resources = [
  {
    title: 'World Health Organization (WHO)',
    description: 'Global public health information and guidelines.',
    link: 'https://www.who.int',
  },
  {
    title: 'Mayo Clinic',
    description: 'Comprehensive health information and patient care.',
    link: 'https://www.mayoclinic.org',
  },
  {
    title: 'WebMD',
    description: 'Trusted medical information and health news.',
    link: 'https://www.webmd.com',
  },
  {
    title: 'National Institutes of Health (NIH)',
    description: 'U.S. medical research agency with health information.',
    link: 'https://www.nih.gov/health-information',
  },
   {
    title: 'ExRx.net',
    description: 'Comprehensive exercise library and instruction.',
    link: 'https://exrx.net',
  },
  {
    title: 'Sleep Foundation',
    description: 'Information and resources on sleep health.',
    link: 'https://www.sleepfoundation.org',
  },
];

const ResourcesPage = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 text-center">Health Resources</h1>
      <p className="text-gray-400 mb-12 text-center max-w-3xl mx-auto">
        This is a list of credible external resources for further reading. Always consult a healthcare professional for medical advice.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700/50 hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms`}}
          >
            <div className="flex items-center gap-4 mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-white">{resource.title}</h2>
            </div>
            <p className="text-gray-400">{resource.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;