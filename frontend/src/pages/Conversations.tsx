import { useState, useEffect } from 'react';
import { getConversations, analyzeConversation, ConversationAnalysis } from '../api/client';

const Conversations = () => {
  const [conversations, setConversations] = useState<ConversationAnalysis[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationAnalysis | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [conversationRequest, setConversationRequest] = useState({
    conversation_type: 'call',
    transcript: '',
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleAnalyzeConversation = async () => {
    try {
      setLoading(true);
      const analysis = await analyzeConversation(conversationRequest);
      setConversations([analysis, ...conversations]);
      setSelectedConversation(analysis);
      setShowAnalyzeModal(false);
      setConversationRequest({
        conversation_type: 'call',
        transcript: '',
      });
    } catch (error) {
      console.error('Failed to analyze conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment.toLowerCase().includes('positive')) return 'text-green-600 bg-green-100';
    if (sentiment.toLowerCase().includes('negative')) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💬 Conversation Intelligence
          </h1>
          <p className="text-gray-600">
            Analyze sales calls and emails for insights, objections, and next steps
          </p>
        </div>
        <button
          onClick={() => setShowAnalyzeModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          + Analyze Conversation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Total Conversations</div>
          <div className="text-3xl font-bold text-gray-900">{conversations.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Sentiment</div>
          <div className="text-3xl font-bold text-green-600">Positive</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Actionability Rate</div>
          <div className="text-3xl font-bold text-primary-600">80%</div>
          <div className="text-xs text-gray-500 mt-1">follow-up actions</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Analysis Time</div>
          <div className="text-3xl font-bold text-blue-600">30s</div>
          <div className="text-xs text-gray-500 mt-1">avg per conversation</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Conversations
              </h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 capitalize">
                      {conversation.conversation_type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                        conversation.sentiment
                      )}`}
                    >
                      {conversation.sentiment}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(conversation.analyzed_at).toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {conversation.summary}
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No conversations yet. Analyze your first one!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              {/* Header */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {selectedConversation.conversation_type} Analysis
                  </h2>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getSentimentColor(
                      selectedConversation.sentiment
                    )}`}
                  >
                    {selectedConversation.sentiment}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Analyzed {new Date(selectedConversation.analyzed_at).toLocaleString()}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">📝</span>
                  Summary
                </h3>
                <p className="text-blue-900">{selectedConversation.summary}</p>
              </div>

              {/* Deal Risk Score */}
              <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Deal Risk Score
                  </h3>
                  <p className="text-sm text-gray-600">
                    Probability of deal loss based on conversation signals
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-4xl font-bold ${
                      getRiskColor(selectedConversation.deal_risk_score).split(' ')[0]
                    }`}
                  >
                    {selectedConversation.deal_risk_score}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedConversation.deal_risk_score >= 70
                      ? 'High Risk'
                      : selectedConversation.deal_risk_score >= 40
                      ? 'Medium Risk'
                      : 'Low Risk'}
                  </div>
                </div>
              </div>

              {/* Key Topics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Key Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.key_topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Objections */}
              <div>
                <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Objections Raised
                </h3>
                {selectedConversation.objections.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedConversation.objections.map((objection, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{objection}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No objections raised</p>
                )}
              </div>

              {/* Next Actions */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                  <span className="mr-2">✅</span>
                  Recommended Next Actions
                </h3>
                <ul className="space-y-3">
                  {selectedConversation.next_actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 mr-3 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 flex space-x-4">
                <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Add to CRM
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Share with Manager
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation to view
              </h3>
              <p className="text-gray-600">
                Or analyze a new conversation using the button above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Conversation Modal */}
      {showAnalyzeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Analyze Conversation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conversation Type
                </label>
                <select
                  value={conversationRequest.conversation_type}
                  onChange={(e) =>
                    setConversationRequest({
                      ...conversationRequest,
                      conversation_type: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="demo">Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript / Content
                </label>
                <textarea
                  value={conversationRequest.transcript}
                  onChange={(e) =>
                    setConversationRequest({
                      ...conversationRequest,
                      transcript: e.target.value,
                    })
                  }
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste your call transcript, email thread, or meeting notes here..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  Tip: Longer transcripts provide more detailed insights
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAnalyzeModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyzeConversation}
                disabled={loading || !conversationRequest.transcript.trim()}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>

            {loading && (
              <div className="mt-4 text-center text-sm text-gray-600">
                AI is analyzing your conversation... This may take 20-40 seconds.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
