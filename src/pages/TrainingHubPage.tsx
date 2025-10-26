import { useState } from 'react';
import { 
  BookOpen, Video, CheckCircle, Lock, Play, Award,
  Facebook, Instagram, MessageCircle, TrendingUp, Users, Target, ArrowRight
} from 'lucide-react';
import { CourseViewerPage } from './CourseViewerPage';

const trainingModules = [
  {
    id: 1,
    title: "Facebook Ads Mastery",
    icon: <Facebook className="w-6 h-6" />,
    duration: "45 min",
    lessons: 8,
    unlocked: true,
    color: "blue",
    description: "Learn how to run profitable Facebook ads campaigns",
    topics: [
      "Setting up Facebook Business Manager",
      "Creating high-converting ad copy",
      "Targeting the right audience",
      "Budget optimization strategies",
      "A/B testing your ads",
      "Analyzing ad performance",
      "Scaling successful campaigns",
      "Common mistakes to avoid"
    ]
  },
  {
    id: 2,
    title: "WhatsApp Marketing Pro",
    icon: <MessageCircle className="w-6 h-6" />,
    duration: "30 min",
    lessons: 6,
    unlocked: true,
    color: "green",
    description: "Master WhatsApp marketing and status strategies",
    topics: [
      "Optimizing your WhatsApp profile",
      "Save-for-save strategy explained",
      "Creating engaging status updates",
      "Best times to post status",
      "Building your status viewers list",
      "Converting viewers to customers"
    ]
  },
  {
    id: 3,
    title: "TikTok Growth Hacks",
    icon: <Video className="w-6 h-6" />,
    duration: "40 min",
    lessons: 7,
    unlocked: true,
    color: "purple",
    description: "Go viral on TikTok and grow your audience fast",
    topics: [
      "Understanding TikTok algorithm",
      "Creating viral content ideas",
      "Video editing basics",
      "Using trending sounds effectively",
      "Hashtag strategy for growth",
      "Posting schedule optimization",
      "Engaging with your audience"
    ]
  },
  {
    id: 4,
    title: "Instagram Engagement Tactics",
    icon: <Instagram className="w-6 h-6" />,
    duration: "35 min",
    lessons: 6,
    unlocked: true,
    color: "pink",
    description: "Build an engaged Instagram following",
    topics: [
      "Profile optimization",
      "Content pillars strategy",
      "Reels vs Posts vs Stories",
      "Hashtag research",
      "Engagement pods and groups",
      "Converting followers to customers"
    ]
  },
  {
    id: 5,
    title: "Content Creation Masterclass",
    icon: <BookOpen className="w-6 h-6" />,
    duration: "50 min",
    lessons: 9,
    unlocked: true,
    color: "orange",
    description: "Create content that converts",
    topics: [
      "Understanding your audience",
      "Copywriting fundamentals",
      "Visual content creation",
      "Video scripting techniques",
      "Storytelling for sales",
      "Call-to-action strategies",
      "Content calendar planning",
      "Repurposing content",
      "Measuring content performance"
    ]
  },
  {
    id: 6,
    title: "Sales Psychology",
    icon: <Target className="w-6 h-6" />,
    duration: "45 min",
    lessons: 8,
    unlocked: true,
    color: "red",
    description: "Master the psychology of selling",
    topics: [
      "Understanding buyer psychology",
      "Building trust quickly",
      "Handling objections",
      "Scarcity and urgency tactics",
      "Social proof strategies",
      "Closing techniques",
      "Follow-up sequences",
      "Building long-term relationships"
    ]
  },
  {
    id: 7,
    title: "Team Building & Leadership",
    icon: <Users className="w-6 h-6" />,
    duration: "40 min",
    lessons: 7,
    unlocked: false,
    color: "indigo",
    description: "Build and lead a successful team",
    topics: [
      "Recruiting strategies",
      "Training your team",
      "Motivation techniques",
      "Setting team goals",
      "Communication best practices",
      "Conflict resolution",
      "Creating team culture"
    ]
  },
  {
    id: 8,
    title: "Advanced Growth Strategies",
    icon: <TrendingUp className="w-6 h-6" />,
    duration: "60 min",
    lessons: 10,
    unlocked: false,
    color: "teal",
    description: "Scale your business to the next level",
    topics: [
      "Automation tools and systems",
      "Influencer partnerships",
      "Community building",
      "Personal branding",
      "Multiple income streams",
      "Passive income strategies",
      "Time management",
      "Goal setting framework",
      "Mindset for success",
      "Long-term wealth building"
    ]
  }
];

export const TrainingHubPage = () => {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [viewingLesson, setViewingLesson] = useState<{courseId: string, lessonId: string} | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const toggleLesson = (moduleId: number, lessonIndex: number) => {
    const key = `${moduleId}-${lessonIndex}`;
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedLessons(newCompleted);
  };

  const getModuleProgress = (moduleId: number) => {
    const module = trainingModules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completed = module.topics.filter((_, i) => 
      completedLessons.has(`${moduleId}-${i}`)
    ).length;
    
    return (completed / module.topics.length) * 100;
  };

  const selectedModuleData = trainingModules.find(m => m.id === selectedModule);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Training Hub 🎓</h1>
            <p className="text-indigo-100 text-lg">
              Master the skills you need to succeed and grow your business
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-semibold">Courses Completed</p>
              <p className="text-3xl font-bold">
                {trainingModules.filter(m => getModuleProgress(m.id) === 100).length}/{trainingModules.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!selectedModule ? (
        <>
          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingModules.map((module) => {
              const progress = getModuleProgress(module.id);
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
                pink: 'from-pink-500 to-pink-600',
                orange: 'from-orange-500 to-orange-600',
                red: 'from-red-500 to-red-600',
                indigo: 'from-indigo-500 to-indigo-600',
                teal: 'from-teal-500 to-teal-600',
              };

              return (
                <div
                  key={module.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition ${
                    !module.unlocked ? 'opacity-75' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        {module.icon}
                      </div>
                      {!module.unlocked && <Lock className="w-5 h-5" />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-sm opacity-90">{module.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <span className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>{module.lessons} lessons</span>
                      </span>
                      <span>{module.duration}</span>
                    </div>

                    {/* Progress Bar */}
                    {module.unlocked && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} h-2 rounded-full transition-all`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => module.unlocked && setSelectedModule(module.id)}
                      disabled={!module.unlocked}
                      className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                        module.unlocked
                          ? `bg-gradient-to-r ${colorClasses[module.color as keyof typeof colorClasses]} text-white hover:opacity-90`
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {module.unlocked ? (
                        <>
                          <Play className="w-5 h-5" />
                          <span>{progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'} Course</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Locked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlock Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3">🔓 How to Unlock Advanced Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UnlockStep
                number="1"
                title="Complete Basic Courses"
                description="Finish the first 6 training modules"
              />
              <UnlockStep
                number="2"
                title="Build Your Team"
                description="Recruit at least 10 active members"
              />
              <UnlockStep
                number="3"
                title="Reach Earnings Goal"
                description="Earn a total of KES 10,000"
              />
            </div>
          </div>
        </>
      ) : (
        /* Module Detail View */
        <div className="bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setSelectedModule(null)}
            className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Courses</span>
          </button>

          {selectedModuleData && (
            <>
              <div className="flex items-start space-x-4 mb-8">
                <div className={`p-4 bg-gradient-to-br from-${selectedModuleData.color}-500 to-${selectedModuleData.color}-600 rounded-xl text-white`}>
                  {selectedModuleData.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {selectedModuleData.title}
                  </h2>
                  <p className="text-slate-600 mb-4">{selectedModuleData.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Video className="w-4 h-4" />
                      <span>{selectedModuleData.lessons} lessons</span>
                    </span>
                    <span>{selectedModuleData.duration}</span>
                    <span className="text-green-600 font-semibold">
                      {getModuleProgress(selectedModuleData.id).toFixed(0)}% Complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedModuleData.topics.map((topic, index) => {
                  const isCompleted = completedLessons.has(`${selectedModuleData.id}-${index}`);
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                        isCompleted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                      }`}
                      onClick={() => toggleLesson(selectedModuleData.id, index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : 'bg-slate-300'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${isCompleted ? 'text-green-900' : 'text-slate-900'}`}>
                              {topic}
                            </p>
                            <p className="text-xs text-slate-500">
                              {isCompleted ? 'Completed' : 'Click to mark as complete'}
                            </p>
                          </div>
                        </div>
                        <Play className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UnlockStep = ({ number, title, description }: any) => (
  <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-white">{number}</span>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  </div>
);
