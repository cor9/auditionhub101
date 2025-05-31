import { 
  AuditionStatus, 
  AuditionType,
  ContactType,
  ExpenseCategory,
  InsightType,
  BookingType,
  BookingStatus,
  PaymentStatus,
  SubscriptionTier,
  SubscriptionStatus
} from '@prisma/client';

// User type definitions
export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  childName?: string;
  childAge?: number;
  childGender?: string;
  childEthnicity?: string;
  childHeight?: string;
  childWeight?: string;
  childHairColor?: string;
  childEyeColor?: string;
  parentName?: string;
  phone?: string;
  location?: string;
  timezone?: string;
};

// Audition type definitions
export type AuditionData = {
  id: string;
  projectTitle: string;
  roleName: string;
  type: AuditionType;
  status: AuditionStatus;
  description?: string;
  auditionDate?: Date;
  callbackDate?: Date;
  location?: string;
  virtualLink?: string;
  notes?: string;
  sides?: string;
  selftapeUrl?: string;
  castingCompany?: string;
  castingDirector?: string;
  castingAssistant?: string;
  castingEmail?: string;
  castingPhone?: string;
  submittedBy?: string;
  submittedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Contact type definitions
export type ContactData = {
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
};

// Expense type definitions
export type ExpenseData = {
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
};

// Insight type definitions
export type InsightData = {
  id: string;
  title: string;
  content: string;
  type: InsightType;
  createdAt: Date;
  updatedAt: Date;
};

// Booking type definitions
export type BookingData = {
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
};

// Subscription type definitions
export type SubscriptionData = {
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
};

// Email Log type definitions
export type EmailLogData = {
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
};

// Dashboard stats and analytics
export type DashboardStats = {
  totalAuditions: number;
  pendingAuditions: number;
  submittedAuditions: number;
  callbackAuditions: number;
  bookedAuditions: number;
  releasedAuditions: number;
  upcomingAuditions: AuditionData[];
  recentExpenses: ExpenseData[];
  insights: InsightData[];
};

export type AuditionsByStatus = {
  status: AuditionStatus;
  count: number;
};

export type ExpensesByCategory = {
  category: ExpenseCategory;
  totalAmount: number;
};

export type AuditionsByMonth = {
  month: string;
  count: number;
};