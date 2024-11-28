import React from 'react';
import { FileDown, FileText, Github, Book, Link as LinkIcon } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'download' | 'documentation' | 'github' | 'guide' | 'link';
  url: string;
  size?: string;
  description?: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Project Starter Files',
    type: 'download',
    url: '#',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'API Documentation',
    type: 'documentation',
    url: '#'
  },
  {
    id: '3',
    title: 'Source Code',
    type: 'github',
    url: '#'
  },
  {
    id: '4',
    title: 'Setup Guide',
    type: 'guide',
    url: '#'
  },
  {
    id: '5',
    title: 'Additional Resources',
    type: 'link',
    url: '#',
    description: 'External learning materials'
  }
];

const iconMap = {
  download: FileDown,
  documentation: FileText,
  github: Github,
  guide: Book,
  link: LinkIcon
};

const typeLabels = {
  download: 'Download',
  documentation: 'View Docs',
  github: 'View Code',
  guide: 'Read Guide',
  link: 'Visit Link'
};

export const ProjectResources: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Project Resources</h2>
      <div className="space-y-3">
        {mockResources.map((resource) => {
          const Icon = iconMap[resource.type];
          return (
            <a
              key={resource.id}
              href={resource.url}
              target={resource.type === 'link' ? '_blank' : undefined}
              rel={resource.type === 'link' ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{resource.title}</h3>
                  {resource.size && (
                    <p className="text-xs text-gray-400 mt-0.5">{resource.size}</p>
                  )}
                  {resource.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{resource.description}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400 group-hover:text-blue-400">
                {typeLabels[resource.type]}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
