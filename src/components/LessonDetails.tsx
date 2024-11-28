import React from 'react';
import { FileDown, Book, Clock, Target, Link as LinkIcon } from 'lucide-react';
import type { Lesson, LessonResource } from '../lib/pocketbase';
import { lessonResourceService } from '../lib/pocketbase';
import { useQuery } from '@tanstack/react-query';

interface LessonDetailsProps {
  lesson: Lesson | null;
}

const iconMap = {
  download: FileDown,
  documentation: Book,
  link: LinkIcon,
  guide: Book,
  github: Book,
};

export const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson }) => {
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['lessonResources', lesson?.id],
    queryFn: async () => {
      if (!lesson?.id) {
        console.log('No lesson ID provided');
        return [];
      }
      try {
        const result = await lessonResourceService.getAll(lesson.id);
        console.log('Resources fetched:', result);
        return result;
      } catch (err) {
        console.error('Error fetching resources:', err);
        throw err;
      }
    },
    enabled: !!lesson?.id,
  });

  console.log('Current lesson:', lesson);
  console.log('Resources state:', { isLoading, error, resources });

  const handleResource = async (resource: LessonResource) => {
    try {
      if (resource.resource_type === 'link') {
        // For link type, open in new tab
        window.open(resource.resource_url, '_blank', 'noopener,noreferrer');
      } else {
        // For other types, download the file
        const url = lessonResourceService.getFileUrl(resource);
        console.log('Downloading from URL:', url);
        
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = resource.resource_title || 'download';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error handling resource:', error);
    }
  };

  if (!lesson) {
    return null;
  }

  const {
    description,
    duration,
    objectives = [],
  } = lesson;

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-white/95 mb-6">Lesson Details</h2>

      {/* Lesson Description */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white/90 mb-3">About This Lesson</h3>
        <p className="text-white/70 leading-relaxed">{description}</p>
      </div>

      {/* Lesson Info */}
      {duration && (
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/60">Duration</h4>
            <p className="text-white/90">{duration}</p>
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      {objectives?.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white/90">Learning Objectives</h3>
          </div>
          <ul className="list-disc list-inside text-white/70 space-y-2">
            {objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Resources */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileDown className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white/90">Resources</h3>
        </div>

        {isLoading ? (
          <p className="text-white/60 text-center py-4">Loading resources...</p>
        ) : error ? (
          <div className="text-red-400/90 text-center py-4">
            <p>Error loading resources</p>
            <p className="text-sm mt-1">{(error as Error)?.message || 'Unknown error'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources && resources.length > 0 ? (
              resources.map((resource) => {
                const Icon = iconMap[resource.resource_type as keyof typeof iconMap] || Book;
                return (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg group hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-white/90 font-medium">{resource.resource_title}</h4>
                        <p className="text-sm text-white/60 capitalize">{resource.resource_type}</p>
                        {resource.resource_description && (
                          <p className="text-sm text-white/50 mt-1">{resource.resource_description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleResource(resource)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all duration-200"
                      title={resource.resource_type === 'link' ? 'Open Link' : 'Download Resource'}
                    >
                      {resource.resource_type === 'link' ? (
                        <LinkIcon className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <FileDown className="w-4 h-4 text-indigo-400" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-white/60 text-center py-4">No resources available for this lesson.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
