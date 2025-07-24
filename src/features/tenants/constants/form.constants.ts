export const formFieldNames = {
  generalDetails: {
    companyName: 'company_name',
    domain: 'domain',
    chatStrategy: 'chat_strategy'
  },
  settings: {
    preferredCurrency: 'settings.preferred_currency',
    preferredTimezone: 'settings.preferred_timezone',
    theme: 'settings.theme',
    themeColor: 'settings.theme_color',
    defaultThemeMode: 'settings.default_theme_mode',
    logos: {
      light: 'settings.logos.light',
      dark: 'settings.logos.dark',
    },
    hasDarkLogo: 'settings.has_dark_logo',
  },
  sso: {
    type: 'sso_config.type',
    enabled: 'sso_config.enabled',
    tenantId: 'sso_config.tenant_id',
    clientId: 'sso_config.client_id',
    clientSecret: 'sso_config.client_secret',
    scopes: 'sso_config.scopes',
  },
  aiConfig: {
    aiType: 'ai_config.open_ai_type',
    aiEmbeddingModel: 'ai_config.open_ai_embedding_model',
    temperature: 'ai_config.temperature',
    openAiKey: 'ai_config.open_ai_key',
    openAiEndpoint: 'ai_config.open_ai_endpoint',
    openAiVersion: 'ai_config.open_ai_version',
    webSearch: 'ai_config.web_search',
  },
  documents: {
    documentTypes: 'document_types',
    documentDataSources: 'document_data_sources',
  },
  documentGroups: {
    name: 'name',
    description: 'description',
    metadata: 'metadata',
  },
  users: {
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
    password: 'password',
    role: 'role',
    accountId: 'account_id',
  },
};

export const CUSTOM_THEME_REQUIRED_VALIDATION = {
  [formFieldNames.settings.logos.light]: true,
  [formFieldNames.settings.logos.dark]: true,
  [formFieldNames.settings.defaultThemeMode]: true,
  [formFieldNames.settings.themeColor]: true,
};
