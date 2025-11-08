import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'AI Lead Scoring',
      description: 'Score and qualify leads automatically using AI-powered BANT analysis',
      icon: '🎯',
      path: '/leads',
      color: 'bg-blue-500',
      stats: { time: '30 seconds', accuracy: '85%', impact: '3x qualified leads' },
    },
    {
      title: 'Proposal Generation',
      description: 'Generate custom proposals in minutes with AI-powered content creation',
      icon: '📄',
      path: '/proposals',
      color: 'bg-green-500',
      stats: { time: '3 minutes', accuracy: '70% acceptance', impact: '90% time savings' },
    },
    {
      title: 'Battle Cards',
      description: 'Access AI-updated competitive intelligence and objection handling',
      icon: '⚔️',
      path: '/battle-cards',
      color: 'bg-purple-500',
      stats: { competitors: '3 tracked', winRate: '20% higher', coverage: '100%' },
    },
    {
      title: 'Conversation Intelligence',
      description: 'Analyze sales calls and emails for insights, objections, and next steps',
      icon: '💬',
      path: '/conversations',
      color: 'bg-orange-500',
      stats: { insights: 'Real-time', sentiment: 'AI-powered', coaching: 'Actionable' },
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Sales Enablement Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          All-in-one AI-powered sales platform that consolidates lead scoring, proposal
          generation, competitive intelligence, and conversation analysis into a single
          unified solution.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-primary-600">$56M</div>
            <div className="text-sm text-gray-600 mt-1">ARR Target (M24)</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600">28%</div>
            <div className="text-sm text-gray-600 mt-1">Sales Cycle Reduction</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600">22%</div>
            <div className="text-sm text-gray-600 mt-1">Win Rate Improvement</div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group"
          >
            <div className={`${feature.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{feature.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h2>
                </div>
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                {Object.entries(feature.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm font-semibold text-primary-600">
                      {value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why AI Sales Enablement?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              35% Faster Sales Cycles
            </h3>
            <p className="text-gray-600">
              AI lead scoring and proposal generation accelerate your sales process
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              $14.4M Annual Value
            </h3>
            <p className="text-gray-600">
              For a 100-person sales team (80x ROI on $180K platform cost)
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All-in-One Platform
            </h3>
            <p className="text-gray-600">
              Consolidate 4+ point solutions into one AI-first platform
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg shadow-md p-8 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Built with Modern AI Technology
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">
            React + TypeScript
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full">
            FastAPI (Python)
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full">
            Anthropic Claude Sonnet 4
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Tailwind CSS</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">PostgreSQL</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">Docker</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
