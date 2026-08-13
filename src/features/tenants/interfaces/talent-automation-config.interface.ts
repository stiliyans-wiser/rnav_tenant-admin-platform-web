export interface TalentAutomationConfig {
  screening_enabled?: boolean;
  enrichment_enabled?: boolean;
  reroute_enabled?: boolean;
  interview_prep_enabled?: boolean;
  confidence_threshold?: number;
  hitl_required_for_rejection?: boolean;
  screening_sla_seconds?: number;
  enrichment_questions?: string[];
  max_reroute_suggestions?: number;
  interview_prep_question_count?: number;
}
