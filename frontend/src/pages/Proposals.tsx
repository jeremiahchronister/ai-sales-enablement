import { useState, useEffect } from 'react';
import { getProposals, generateProposal, getLeads, Proposal, Lead } from '../api/client';

const Proposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [proposalRequest, setProposalRequest] = useState({
    lead_id: 0,
    product_type: 'SaaS',
    deal_size: 100000,
    contract_term: 'Annual',
    custom_requirements: '',
  });

  useEffect(() => {
    loadProposals();
    loadLeads();
  }, []);

  const loadProposals = async () => {
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    }
  };

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const handleGenerateProposal = async () => {
    try {
      setLoading(true);
      const proposal = await generateProposal(proposalRequest);
      setProposals([proposal, ...proposals]);
      setSelectedProposal(proposal);
      setShowGenerateModal(false);
      setProposalRequest({
        lead_id: 0,
        product_type: 'SaaS',
        deal_size: 100000,
        contract_term: 'Annual',
        custom_requirements: '',
      });
    } catch (error) {
      console.error('Failed to generate proposal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    return lead ? lead.company_name : `Lead #${leadId}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📄 AI Proposal Generation
          </h1>
          <p className="text-gray-600">
            Generate custom proposals in minutes with AI-powered content creation
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          + Generate Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Total Proposals</div>
          <div className="text-3xl font-bold text-gray-900">{proposals.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Time Saved</div>
          <div className="text-3xl font-bold text-green-600">3.5h</div>
          <div className="text-xs text-gray-500 mt-1">per proposal</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Total Deal Value</div>
          <div className="text-3xl font-bold text-primary-600">
            ${proposals.reduce((sum, p) => sum + p.deal_size, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Acceptance Rate</div>
          <div className="text-3xl font-bold text-blue-600">70%</div>
          <div className="text-xs text-gray-500 mt-1">sent without edits</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposals List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Proposals</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedProposal?.id === proposal.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {proposal.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {getLeadName(proposal.lead_id)}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary-600 font-medium">
                      ${proposal.deal_size.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No proposals yet. Generate your first one!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Proposal Detail */}
        <div className="lg:col-span-2">
          {selectedProposal ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProposal.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>For: {getLeadName(selectedProposal.lead_id)}</span>
                  <span>•</span>
                  <span>${selectedProposal.deal_size.toLocaleString()}</span>
                  <span>•</span>
                  <span>{selectedProposal.contract_term}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedProposal.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
                <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Download PDF
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Copy to Clipboard
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a proposal to view
              </h3>
              <p className="text-gray-600">
                Or generate a new proposal using the button above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Proposal Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Generate New Proposal
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Lead
                </label>
                <select
                  value={proposalRequest.lead_id}
                  onChange={(e) =>
                    setProposalRequest({
                      ...proposalRequest,
                      lead_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={0}>Select a lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.company_name} ({lead.contact_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>
                <select
                  value={proposalRequest.product_type}
                  onChange={(e) =>
                    setProposalRequest({
                      ...proposalRequest,
                      product_type: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Size ($)
                </label>
                <input
                  type="number"
                  value={proposalRequest.deal_size}
                  onChange={(e) =>
                    setProposalRequest({
                      ...proposalRequest,
                      deal_size: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Term
                </label>
                <select
                  value={proposalRequest.contract_term}
                  onChange={(e) =>
                    setProposalRequest({
                      ...proposalRequest,
                      contract_term: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="Multi-year">Multi-year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Requirements (Optional)
                </label>
                <textarea
                  value={proposalRequest.custom_requirements}
                  onChange={(e) =>
                    setProposalRequest({
                      ...proposalRequest,
                      custom_requirements: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any specific requirements or customizations..."
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateProposal}
                disabled={loading || proposalRequest.lead_id === 0}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {loading && (
              <div className="mt-4 text-center text-sm text-gray-600">
                AI is generating your proposal... This may take 30-60 seconds.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;
