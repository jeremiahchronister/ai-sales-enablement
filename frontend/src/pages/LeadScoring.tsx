import { useState, useEffect } from 'react';
import { getLeads, createLead, scoreLead, Lead, LeadScore } from '../api/client';

const LeadScoring = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadScore, setLeadScore] = useState<LeadScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const handleAddLead = async () => {
    try {
      setLoading(true);
      const created = await createLead(newLead);
      setLeads([...leads, created]);
      setShowAddModal(false);
      setNewLead({
        company_name: '',
        industry: '',
        company_size: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
      });
    } catch (error) {
      console.error('Failed to create lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreLead = async (lead: Lead) => {
    try {
      setLoading(true);
      setSelectedLead(lead);
      const score = await scoreLead(lead.id);
      setLeadScore(score);

      // Update lead in list with score
      setLeads(leads.map(l =>
        l.id === lead.id ? { ...l, score: score.score } : l
      ));
    } catch (error) {
      console.error('Failed to score lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 AI Lead Scoring
          </h1>
          <p className="text-gray-600">
            Score and qualify leads automatically using AI-powered BANT analysis
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Scored Leads</div>
          <div className="text-3xl font-bold text-primary-600">
            {leads.filter(l => l.score).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Score</div>
          <div className="text-3xl font-bold text-green-600">
            {leads.filter(l => l.score).length > 0
              ? Math.round(
                  leads.filter(l => l.score).reduce((sum, l) => sum + (l.score || 0), 0) /
                    leads.filter(l => l.score).length
                )
              : 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">High Quality ({'>'} 70)</div>
          <div className="text-3xl font-bold text-blue-600">
            {leads.filter(l => l.score && l.score >= 70).length}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.company_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{lead.industry}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{lead.company_size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.contact_name}</div>
                  <div className="text-xs text-gray-500">{lead.contact_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.score ? (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                        lead.score
                      )}`}
                    >
                      {lead.score}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not scored</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleScoreLead(lead)}
                    disabled={loading}
                    className="text-primary-600 hover:text-primary-900 font-medium disabled:opacity-50"
                  >
                    {loading && selectedLead?.id === lead.id ? 'Scoring...' : 'Score'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score Details */}
      {leadScore && selectedLead && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Score Analysis: {selectedLead.company_name}
          </h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Overall Score</span>
              <span className={`text-4xl font-bold ${getScoreColor(leadScore.score).split(' ')[0]}`}>
                {leadScore.score}/100
              </span>
            </div>
            <p className="text-gray-600 mb-4">{leadScore.recommendation}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Budget</div>
              <div className="text-2xl font-bold text-primary-600">
                {leadScore.score_breakdown.budget}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Authority</div>
              <div className="text-2xl font-bold text-primary-600">
                {leadScore.score_breakdown.authority}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Need</div>
              <div className="text-2xl font-bold text-primary-600">
                {leadScore.score_breakdown.need}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Timeline</div>
              <div className="text-2xl font-bold text-primary-600">
                {leadScore.score_breakdown.timeline}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">AI Reasoning</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{leadScore.reasoning}</p>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Lead</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newLead.company_name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={newLead.industry}
                  onChange={(e) =>
                    setNewLead({ ...newLead, industry: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  value={newLead.company_size}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company_size: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={newLead.contact_name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, contact_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newLead.contact_email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, contact_email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={newLead.contact_phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, contact_phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                disabled={loading}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScoring;
