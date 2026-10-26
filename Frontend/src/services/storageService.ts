import { User, AssistanceRequest, Notification, Feedback, RequestStatus } from '../types';
import { INITIAL_USERS, INITIAL_REQUESTS, INITIAL_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'careconnect_users_v1',
  CURRENT_USER: 'careconnect_current_user_v1',
  REQUESTS: 'careconnect_requests_v1',
  NOTIFICATIONS: 'careconnect_notifications_v1',
  FEEDBACKS: 'careconnect_feedbacks_v1',
  FONT_SIZE: 'careconnect_font_size_v1',
};

// Safe localStorage helper
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initialize storage with pre-seeded data if not already present
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    setStoredItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default logged in user is Eleanor Vance (Elderly) for immediate demonstration
    setStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
};

export const storageService = {
  // USER / AUTH SERVICE
  async getCurrentUser(): Promise<User | null> {
    initializeStorage();
    return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  async setCurrentUser(user: User | null): Promise<void> {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  async getUsers(): Promise<User[]> {
    initializeStorage();
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.id === id);
  },

  async registerUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      avatar: userData.avatar || `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 90000000000)}?w=200&auto=format&fit=crop&q=80`,
      rating: userData.role === 'volunteer' ? 5.0 : undefined,
      completedTasksCount: userData.role === 'volunteer' ? 0 : undefined,
      verificationStatus: userData.role === 'volunteer' ? 'pending' : undefined,
    };

    users.push(newUser);
    setStoredItem(STORAGE_KEYS.USERS, users);
    await this.setCurrentUser(newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    setStoredItem(STORAGE_KEYS.USERS, users);

    const currentUser = await this.getCurrentUser();
    if (currentUser?.id === id) {
      await this.setCurrentUser(updated);
    }
    return updated;
  },

  // ASSISTANCE REQUEST SERVICE
  async getAssistanceRequests(): Promise<AssistanceRequest[]> {
    initializeStorage();
    return getStoredItem<AssistanceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  async getRequestById(id: string): Promise<AssistanceRequest | undefined> {
    const requests = await this.getAssistanceRequests();
    return requests.find(r => r.id === id);
  },

  async createAssistanceRequest(
    data: Omit<AssistanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'timeline'>
  ): Promise<AssistanceRequest> {
    const requests = await this.getAssistanceRequests();
    const newId = `REQ-${1045 + requests.length}`;
    const timestamp = new Date().toISOString();

    const newRequest: AssistanceRequest = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      timeline: [
        {
          status: 'pending',
          timestamp,
          title: 'Request Submitted',
          description: `Assistance request created by ${data.requesterName}.`,
          actor: data.requesterName,
        },
      ],
    };

    requests.unshift(newRequest);
    setStoredItem(STORAGE_KEYS.REQUESTS, requests);

    // Create system notification for Admin
    await this.createNotification({
      userId: 'user-admin-1',
      title: 'New Assistance Request',
      message: `${data.requesterName} submitted a new request for ${data.category} in ${data.locality}.`,
      type: 'request',
      requestId: newId,
    });

    return newRequest;
  },

  async acceptRequest(requestId: string, volunteer: User): Promise<AssistanceRequest> {
    const requests = await this.getAssistanceRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const currentReq = requests[index];
    if (currentReq.status !== 'pending' && currentReq.status !== 'assigned') {
      throw new Error(`Cannot accept request in status "${currentReq.status}"`);
    }

    if (currentReq.assignedVolunteerId && currentReq.assignedVolunteerId !== volunteer.id) {
      throw new Error('This request is already assigned to another volunteer.');
    }

    const timestamp = new Date().toISOString();
    const updated: AssistanceRequest = {
      ...currentReq,
      status: 'accepted',
      assignedVolunteerId: volunteer.id,
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone,
      assignedVolunteerAvatar: volunteer.avatar,
      updatedAt: timestamp,
      timeline: [
        ...currentReq.timeline,
        {
          status: 'accepted',
          timestamp,
          title: 'Request Accepted',
          description: `Volunteer ${volunteer.name} accepted this request.`,
          actor: volunteer.name,
        },
      ],
    };

    requests[index] = updated;
    setStoredItem(STORAGE_KEYS.REQUESTS, requests);

    // Notify requester
    await this.createNotification({
      userId: updated.requesterId,
      title: 'Volunteer Accepted Your Request',
      message: `${volunteer.name} has accepted your request ${requestId}.`,
      type: 'assignment',
      requestId: requestId,
    });

    return updated;
  },

  async updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    note?: string,
    actorName?: string
  ): Promise<AssistanceRequest> {
    const requests = await this.getAssistanceRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const currentReq = requests[index];
    const timestamp = new Date().toISOString();

    let title = 'Status Updated';
    let defaultDesc = `Request status changed to ${newStatus}.`;

    if (newStatus === 'in_progress') {
      title = 'Assistance In Progress';
      defaultDesc = 'Volunteer has commenced the assistance task.';
    } else if (newStatus === 'completed') {
      title = 'Assistance Completed';
      defaultDesc = 'Volunteer marked the assistance task as safely completed.';
    } else if (newStatus === 'cancelled') {
      title = 'Request Cancelled';
      defaultDesc = note || 'Assistance request was cancelled.';
    }

    const updated: AssistanceRequest = {
      ...currentReq,
      status: newStatus,
      updatedAt: timestamp,
      cancellationReason: newStatus === 'cancelled' ? note : currentReq.cancellationReason,
      timeline: [
        ...currentReq.timeline,
        {
          status: newStatus,
          timestamp,
          title,
          description: note || defaultDesc,
          actor: actorName || 'System',
        },
      ],
    };

    requests[index] = updated;
    setStoredItem(STORAGE_KEYS.REQUESTS, requests);

    // If completed, increment volunteer's completedTasksCount
    if (newStatus === 'completed' && updated.assignedVolunteerId) {
      const users = await this.getUsers();
      const volIdx = users.findIndex(u => u.id === updated.assignedVolunteerId);
      if (volIdx !== -1) {
        users[volIdx].completedTasksCount = (users[volIdx].completedTasksCount || 0) + 1;
        setStoredItem(STORAGE_KEYS.USERS, users);
      }
    }

    // Send notifications to requester
    await this.createNotification({
      userId: updated.requesterId,
      title: `Update on Request ${requestId}`,
      message: note || defaultDesc,
      type: 'status',
      requestId,
    });

    return updated;
  },

  async assignVolunteer(requestId: string, volunteer: User, assignedBy = 'Administrator'): Promise<AssistanceRequest> {
    const requests = await this.getAssistanceRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const currentReq = requests[index];
    const timestamp = new Date().toISOString();

    const updated: AssistanceRequest = {
      ...currentReq,
      status: 'assigned',
      assignedVolunteerId: volunteer.id,
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone,
      assignedVolunteerAvatar: volunteer.avatar,
      updatedAt: timestamp,
      timeline: [
        ...currentReq.timeline,
        {
          status: 'assigned',
          timestamp,
          title: 'Volunteer Assigned',
          description: `Assigned to ${volunteer.name} by ${assignedBy}.`,
          actor: assignedBy,
        },
      ],
    };

    requests[index] = updated;
    setStoredItem(STORAGE_KEYS.REQUESTS, requests);

    // Notify volunteer
    await this.createNotification({
      userId: volunteer.id,
      title: 'New Task Assignment',
      message: `You have been assigned to ${updated.title} (${requestId}) in ${updated.locality}.`,
      type: 'assignment',
      requestId,
    });

    // Notify requester
    await this.createNotification({
      userId: updated.requesterId,
      title: 'Volunteer Assigned',
      message: `${volunteer.name} has been assigned to your request (${requestId}).`,
      type: 'assignment',
      requestId,
    });

    return updated;
  },

  async cancelRequest(requestId: string, reason: string, cancelledBy: string): Promise<AssistanceRequest> {
    return this.updateRequestStatus(requestId, 'cancelled', reason, cancelledBy);
  },

  // FEEDBACK SERVICE
  async submitFeedback(data: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
    const requests = await this.getAssistanceRequests();
    const reqIndex = requests.findIndex(r => r.id === data.requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    if (requests[reqIndex].feedback) {
      throw new Error('Feedback has already been submitted for this request.');
    }

    const timestamp = new Date().toISOString();
    const newFeedback: Feedback = {
      ...data,
      id: `fb-${Date.now()}`,
      createdAt: timestamp,
    };

    requests[reqIndex].feedback = newFeedback;
    setStoredItem(STORAGE_KEYS.REQUESTS, requests);

    // Also update volunteer average rating if volunteerId exists
    if (data.volunteerId) {
      const users = await this.getUsers();
      const volIdx = users.findIndex(u => u.id === data.volunteerId);
      if (volIdx !== -1) {
        const vol = users[volIdx];
        const currentRating = vol.rating || 5.0;
        const currentCount = vol.completedTasksCount || 1;
        // recalculate simple moving average
        const newRating = Number((((currentRating * currentCount) + data.rating) / (currentCount + 1)).toFixed(1));
        vol.rating = newRating;
        setStoredItem(STORAGE_KEYS.USERS, users);
      }
    }

    return newFeedback;
  },

  // NOTIFICATION SERVICE
  async getNotifications(userId?: string): Promise<Notification[]> {
    initializeStorage();
    const allNotifs = getStoredItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return allNotifs;
    return allNotifs.filter(n => n.userId === userId);
  },

  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const allNotifs = await this.getNotifications();
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    allNotifs.unshift(newNotif);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, allNotifs);
    return newNotif;
  },

  async markNotificationRead(id: string): Promise<void> {
    const allNotifs = await this.getNotifications();
    const item = allNotifs.find(n => n.id === id);
    if (item) {
      item.read = true;
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, allNotifs);
    }
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    const allNotifs = await this.getNotifications();
    allNotifs.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, allNotifs);
  },

  // RESET DEMO STATE
  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACKS);
    initializeStorage();
  },
};
