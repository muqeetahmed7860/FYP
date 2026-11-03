import {z} from 'zod';
export const widgetNames=['balance','income','expenses','savings','budget','goals','tax','netWorth','recurring'] as const;
export const notificationDefaults={budget:true,recurring:true,goals:true,tax:true,security:true,insights:true,email:false,push:false};
export const preferenceSchema=z.object({
  level:z.enum(['BEGINNER','STANDARD','ADVANCED']).default('BEGINNER'),
  theme:z.enum(['light','dark','system']).default('system'),
  language:z.enum(['en','ur','roman']).default('en'),
  density:z.enum(['comfortable','compact']).default('comfortable'),
  fontSize:z.enum(['small','default','large']).default('default'),
  reducedMotion:z.boolean().default(false),hideAmounts:z.boolean().default(false),lockOnOpen:z.boolean().default(false),
  onboardingDone:z.boolean().default(false),onboardingStep:z.number().int().min(0).max(4).default(0),
  interests:z.array(z.enum(['expenses','budget','saving','tax','goals'])).max(5).default(['expenses']),
  checklistDismissed:z.boolean().default(false),tourDone:z.boolean().default(false),taxTourDone:z.boolean().default(false),
  widgets:z.array(z.enum(widgetNames)).max(9).refine(a=>new Set(a).size===a.length).default(['balance','income','expenses','savings','budget']),
  defaultAccount:z.string().max(100).default(''),lastPaymentMethod:z.enum(['BANK','CASH','CARD','WALLET']).default('CASH'),
  favoriteCategories:z.array(z.string().max(100)).max(12).default([]),lastCategory:z.string().max(100).default(''),
  taxYear:z.number().int().min(2000).max(2100).default(2026),taxSteps:z.record(z.string().regex(/^\d{4}$/),z.number().int().min(0).max(7)).default({}),
  notifications:z.object({budget:z.boolean(),recurring:z.boolean(),goals:z.boolean(),tax:z.boolean(),security:z.boolean(),insights:z.boolean(),email:z.boolean(),push:z.boolean()}).strict().default(notificationDefaults),
  usabilityOptIn:z.boolean().default(false)
}).strict();
export type Preferences=z.infer<typeof preferenceSchema>;
export const defaultPreferences=preferenceSchema.parse({});
export const featureDefaults={aiAssistant:false,ocr:false,voice:false,taxModule:true,advancedInsights:true,betaFeatures:false};
export const configSchema=z.object({
 defaultCurrency:z.literal('PKR').default('PKR'),defaultLanguage:z.enum(['en','ur','roman']).default('en'),budgetThreshold:z.number().int().min(1).max(100).default(75),
 emergencyCoefficients:z.object({baseMonths:z.number().min(1).max(12),variableMonths:z.number().min(0).max(12),businessMonths:z.number().min(0).max(12),dependentMonths:z.number().min(0).max(3),debtMonths:z.number().min(0).max(12),maxMonths:z.number().min(1).max(36)}).strict().default({baseMonths:3,variableMonths:2,businessMonths:1,dependentMonths:.5,debtMonths:1,maxMonths:12}),
 goalMonths:z.number().int().min(1).max(60).default(1),recurringMinOccurrences:z.number().int().min(3).max(12).default(3),recurringConfidence:z.number().int().min(50).max(100).default(85),
 notificationsEnabled:z.boolean().default(true),reportBranding:z.string().trim().min(1).max(80).default('HisabKetab AI'),
 features:z.object({aiAssistant:z.boolean(),ocr:z.boolean(),voice:z.boolean(),taxModule:z.boolean(),advancedInsights:z.boolean(),betaFeatures:z.boolean()}).strict().default(featureDefaults)
}).strict();
export const defaultConfig=configSchema.parse({});
