export interface TemplateSkill {
  skill_name: string;
  weight: number;
  category: 'hard' | 'soft';
  is_mandatory: boolean;
}

export interface ScoringTemplate {
  template_id: string;
  name: string;
  description: string;
  skills: TemplateSkill[];
  version: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ScoringTemplateListOut {
  templates: ScoringTemplate[];
}

export interface CreateScoringTemplateIn {
  name: string;
  description: string;
  skills: TemplateSkill[];
}

export interface UpdateScoringTemplateIn {
  name?: string;
  description?: string;
  skills?: TemplateSkill[];
  expected_version: number;
}
