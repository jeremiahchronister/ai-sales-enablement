import { useState, useEffect } from 'react';
import { getBattleCards, BattleCard } from '../api/client';

const BattleCards = () => {
  const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<BattleCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBattleCards();
  }, []);

  const loadBattleCards = async () => {
    try {
      setLoading(true);
      const data = await getBattleCards();
      setBattleCards(data);
      if (data.length > 0) {
        setSelectedCard(data[0]);
      }
    } catch (error) {
      console.error('Failed to load battle cards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <div className="text-lg text-gray-600">Loading battle cards...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ⚔️ Competitive Battle Cards
        </h1>
        <p className="text-gray-600">
          Access AI-updated competitive intelligence and objection handling
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Competitors Tracked</div>
          <div className="text-3xl font-bold text-gray-900">{battleCards.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Win Rate Improvement</div>
          <div className="text-3xl font-bold text-green-600">+20%</div>
          <div className="text-xs text-gray-500 mt-1">on competitive deals</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Last Updated</div>
          <div className="text-3xl font-bold text-primary-600">Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Coverage</div>
          <div className="text-3xl font-bold text-blue-600">100%</div>
          <div className="text-xs text-gray-500 mt-1">of competitive deals</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Competitor Cards Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Competitors</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {battleCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedCard?.id === card.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="font-semibold text-gray-900">
                    {card.competitor_name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Updated {new Date(card.last_updated).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Battle Card Detail */}
        <div className="lg:col-span-3">
          {selectedCard ? (
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              {/* Header */}
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCard.competitor_name}
                </h2>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(selectedCard.last_updated).toLocaleDateString()}
                </div>
              </div>

              {/* Our Strengths */}
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center">
                  <span className="mr-2">✅</span>
                  Our Strengths
                </h3>
                <ul className="space-y-2">
                  {selectedCard.our_strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Their Weaknesses */}
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-3 flex items-center">
                  <span className="mr-2">❌</span>
                  Their Weaknesses
                </h3>
                <ul className="space-y-2">
                  {selectedCard.their_weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Comparison */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Pricing Comparison
                </h3>
                <p className="text-blue-900">{selectedCard.pricing_comparison}</p>
              </div>

              {/* Key Differentiators */}
              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-3 flex items-center">
                  <span className="mr-2">⭐</span>
                  Key Differentiators
                </h3>
                <ul className="space-y-2">
                  {selectedCard.key_differentiators.map((diff, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objection Handling */}
              <div>
                <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
                  <span className="mr-2">💬</span>
                  Objection Handling
                </h3>
                <div className="space-y-4">
                  {Object.entries(selectedCard.objection_handling).map(
                    ([objection, response], index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="font-semibold text-gray-900 mb-2">
                          <span className="text-orange-600 mr-2">Objection:</span>
                          "{objection}"
                        </div>
                        <div className="text-gray-700 pl-4 border-l-4 border-primary-500">
                          <span className="font-medium text-primary-600">Response:</span>{' '}
                          {response}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200 flex space-x-4">
                <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Download PDF
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Share with Team
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a competitor
              </h3>
              <p className="text-gray-600">
                Choose a competitor from the sidebar to view battle card details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleCards;
