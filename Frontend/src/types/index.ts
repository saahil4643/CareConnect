export type UserRole = 'elderly' | 'family' | 'volunteer' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  locality: string;
  address?: string;
  avatar?: string;
  createdAt: string;
  // Specific to Volunteer
  skills?: string[];
  preferredCategories?: AssistanceCategory[];
  availability?: string[];
  serviceArea?: string;
  bio?: string;
  rating?: number;
  completedTasksCount?: number;
  verificationStatus?: VerificationStatus;
  // Specific to Family Member
  relationshipToElderly?: string;
  elderlyName?: string;
  elderlyPhone?: string;
  elderlyAddress?: string;
  // Admin specific
  status?: 'active' | 'suspended';
}

export type AssistanceCategory = 
  | 'grocery'
  | 'medicine'
  | 'appointment'
  | 'transport'
  | 'household'
  | 'other';

export type RequestStatus = 
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RequestTimelineEvent {
  status: RequestStatus;
  timestamp: string;
  title: string;
  description: string;
  actor?: string;
}

export interface Feedback {
  id: string;
  requestId: string;
  rating: number; // 1 to 5
  comment: string;
  serviceQualityTags?: string[];
  submittedBy: string;
  volunteerId?: string;
  createdAt: string;
}

export interface AssistanceRequest {
  id: string;
  category: AssistanceCategory;
  title: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  locality: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterRole: 'elderly' | 'family';
  forElderlyName?: string;
  forElderlyRelationship?: string;
  additionalInstructions?: string;
  status: RequestStatus;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerPhone?: string;
  assignedVolunteerAvatar?: string;
  createdAt: string;
  updatedAt: string;
  timeline: RequestTimelineEvent[];
  feedback?: Feedback;
  cancellationReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'assignment' | 'status' | 'system';
  read: boolean;
  createdAt: string;
  requestId?: string;
}

export interface CategoryInfo {
  id: AssistanceCategory;
  label: string;
  description: string;
  iconName: string;
  popular?: boolean;
}
