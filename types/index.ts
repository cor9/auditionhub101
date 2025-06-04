// Enums
export type AuditionType = 'TV' | 'FILM' | 'COMMERCIAL' | 'THEATRE' | 'VOICEOVER' | 'OTHER';
export type AuditionStatus = 'PENDING' | 'SUBMITTED' | 'CALLBACK' | 'BOOKED' | 'RELEASED';
export type RoleSize = 'PRINCIPAL' | 'SUPPORTING' | 'LEAD' | 'SERIES_REGULAR' | 'FRACTIONAL_SERIES_REGULAR' | 'RECURRING_GUEST_STAR' | 'GUEST_STAR' | 'RECURRING_COSTAR' | 'COSTAR' | 'CONTRACT';
export type AuditionSource = 'AGENCY' | 'MANAGEMENT' | 'SELF_SUBMIT' | 'OTHER';
export type UnionStatus = 'NON_UNION' | 'SAG_AFTRA' | 'AEA';
export type ContactType = 'CASTING_DIRECTOR' | 'AGENT' | 'MANAGER' | 'COACH' | 'OTHER';
export type ExpenseCategory = 'COACHING' | 'SELF_TAPE_GEAR' | 'TRAVEL' | 'WARDROBE' | 'HEADSHOTS' | 'MEMBERSHIPS' | 'OTHER';
export type InsightType = 'PERFORMANCE' | 'CASTING_TRENDS' | 'CALLBACKS_ANALYSIS' | 'GENERAL_TIPS';
export type BookingType = 'COACHING_SESSION' | 'SELF_TAPE_FEEDBACK' | 'AUDITION_PREP_GUIDE';
export type BookingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';
export type SubscriptionTier = 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAUSED';

// User type definitions
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  parentName?: string;
  phone?: string;
  location?: string;
  timezone?: string;
}

// Actor type definitions
export interface ActorProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  ethnicity?: string;
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  bio?: string;
  headshot?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Audition type definitions
export interface AuditionData {
  id: string;
  actorId: string;
  projectTitle: string;
  roleName: string;
  roleSize: RoleSize;
  type: AuditionType;
  status: AuditionStatus;
  castingDirector: string;
  isInPerson: boolean;
  location?: string;
  auditionDate: Date;
  source: AuditionSource;
  union: UnionStatus;
  breakdown: string;
  dateSubmitted: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact type definitions
export interface ContactData {
  id: string;
  name: string;
  type: ContactType;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  notes?: string;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Expense type definitions
export interface ExpenseData {
  id: string;
  amount: number;
  description?: string;
  category: ExpenseCategory;
  date: Date;
  receiptUrl?: string;
  reimbursable: boolean;
  reimbursed: boolean;
  auditionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Insight type definitions
export interface InsightData {
  id: string;
  title: string;
  content: string;
  type: InsightType;
  createdAt: Date;
  updatedAt: Date;
}

// Booking type definitions
export interface BookingData {
  id: string;
  type: BookingType;
  status: BookingStatus;
  startTime: Date;
  endTime?: Date;
  notes?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  stripePaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription type definitions
export interface SubscriptionData {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email Log type definitions
export interface EmailLogData {
  id: string;
  sender?: string;
  recipient?: string;
  subject?: string;
  receivedAt: Date;
  parsedContent?: string;
  status: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard stats and analytics
export interface DashboardStats {
  totalAuditions: number;
  pendingAuditions: number;
  submittedAuditions: number;
  callbackAuditions: number;
  bookedAuditions: number;
  releasedAuditions: number;
  upcomingAuditions: AuditionData[];
  recentExpenses: ExpenseData[];
  insights: InsightData[];
}

export interface AuditionsByStatus {
  status: AuditionStatus;
  count: number;
}

export interface ExpensesByCategory {
  category: ExpenseCategory;
  totalAmount: number;
}

export interface AuditionsByMonth {
  month: string;
  count: number;
}