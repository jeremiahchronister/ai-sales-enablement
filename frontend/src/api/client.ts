import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Lead {
  id: number;
  company_name: string;
  industry: string;
  company_size: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  score?: number;
}

export interface LeadScore {
  lead_id: number;
  score: number;
  score_breakdown: {
    budget: number;
    authority: number;
    need: number;
    timeline: number;
  };
  recommendation: string;
  reasoning: string;
}

export interface ProposalRequest {
  lead_id: number;
  product_type: string;
  deal_size: number;
  contract_term: string;
  custom_requirements?: string;
}

export interface Proposal {
  id: number;
  lead_id: number;
  title: string;
  content: string;
  deal_size: number;
  contract_term: string;
  created_at: string;
}

export interface BattleCard {
  id: number;
  competitor_name: string;
  our_strengths: string[];
  their_weaknesses: string[];
  pricing_comparison: string;
  key_differentiators: string[];
  objection_handling: Record<string, string>;
  last_updated: string;
}

export interface ConversationRequest {
  conversation_type: string;
  transcript: string;
}

export interface ConversationAnalysis {
  id: number;
  conversation_type: string;
  sentiment: string;
  key_topics: string[];
  objections: string[];
  next_actions: string[];
  deal_risk_score: number;
  summary: string;
  analyzed_at: string;
}

// API Functions

// Leads
export const getLeads = async (): Promise<Lead[]> => {
  const response = await apiClient.get('/api/leads');
  return response.data;
};

export const createLead = async (lead: Omit<Lead, 'id' | 'score'>): Promise<Lead> => {
  const response = await apiClient.post('/api/leads', lead);
  return response.data;
};

export const scoreLead = async (leadId: number): Promise<LeadScore> => {
  const response = await apiClient.post(`/api/leads/${leadId}/score`);
  return response.data;
};

// Proposals
export const getProposals = async (): Promise<Proposal[]> => {
  const response = await apiClient.get('/api/proposals');
  return response.data;
};

export const generateProposal = async (request: ProposalRequest): Promise<Proposal> => {
  const response = await apiClient.post('/api/proposals/generate', request);
  return response.data;
};

// Battle Cards
export const getBattleCards = async (): Promise<BattleCard[]> => {
  const response = await apiClient.get('/api/battlecards');
  return response.data;
};

export const getBattleCard = async (id: number): Promise<BattleCard> => {
  const response = await apiClient.get(`/api/battlecards/${id}`);
  return response.data;
};

// Conversations
export const getConversations = async (): Promise<ConversationAnalysis[]> => {
  const response = await apiClient.get('/api/conversations');
  return response.data;
};

export const analyzeConversation = async (
  request: ConversationRequest
): Promise<ConversationAnalysis> => {
  const response = await apiClient.post('/api/conversations/analyze', request);
  return response.data;
};

export default apiClient;
