import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AssistanceRequest, User, Notification, Feedback, RequestStatus } from '../types';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface DataContextType {
  requests: AssistanceRequest[];
  volunteers: User[];
  allUsers: User[];
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  createRequest: (data: Omit<AssistanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'timeline'>) => Promise<AssistanceRequest>;
  acceptRequest: (requestId: string) => Promise<AssistanceRequest>;
  updateRequestStatus: (requestId: string, status: RequestStatus, note?: string) => Promise<AssistanceRequest>;
  assignVolunteer: (requestId: string, volunteerId: string) => Promise<AssistanceRequest>;
  cancelRequest: (requestId: string, reason: string) => Promise<AssistanceRequest>;
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Promise<Feedback>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [reqList, userList, notifList] = await Promise.all([
        storageService.getAssistanceRequests(),
        storageService.getUsers(),
        storageService.getNotifications(currentUser?.id),
      ]);
      setRequests(reqList);
      setAllUsers(userList);
      setNotifications(notifList);
    } catch (err) {
      console.error('Failed to refresh CareConnect data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const volunteers = allUsers.filter(u => u.role === 'volunteer');
  const unreadCount = notifications.filter(n => !n.read).length;

  const createRequest = async (
    data: Omit<AssistanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'timeline'>
  ): Promise<AssistanceRequest> => {
    const newReq = await storageService.createAssistanceRequest(data);
    await refreshData();
    return newReq;
  };

  const acceptRequest = async (requestId: string): Promise<AssistanceRequest> => {
    if (!currentUser || currentUser.role !== 'volunteer') {
      throw new Error('Only registered volunteers can accept requests');
    }
    const updated = await storageService.acceptRequest(requestId, currentUser);
    await refreshData();
    return updated;
  };

  const updateRequestStatus = async (
    requestId: string,
    status: RequestStatus,
    note?: string
  ): Promise<AssistanceRequest> => {
    const updated = await storageService.updateRequestStatus(
      requestId,
      status,
      note,
      currentUser?.name || 'Authorized User'
    );
    await refreshData();
    return updated;
  };

  const assignVolunteer = async (requestId: string, volunteerId: string): Promise<AssistanceRequest> => {
    const volunteer = allUsers.find(u => u.id === volunteerId);
    if (!volunteer) throw new Error('Volunteer not found');

    const updated = await storageService.assignVolunteer(
      requestId,
      volunteer,
      currentUser?.name || 'Administrator'
    );
    await refreshData();
    return updated;
  };

  const cancelRequest = async (requestId: string, reason: string): Promise<AssistanceRequest> => {
    const updated = await storageService.cancelRequest(
      requestId,
      reason,
      currentUser?.name || 'Requester'
    );
    await refreshData();
    return updated;
  };

  const submitFeedback = async (data: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
    const fb = await storageService.submitFeedback(data);
    await refreshData();
    return fb;
  };

  const markNotificationRead = async (id: string): Promise<void> => {
    await storageService.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async (): Promise<void> => {
    if (!currentUser) return;
    await storageService.markAllNotificationsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = async (): Promise<void> => {
    storageService.resetDemoData();
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        volunteers,
        allUsers,
        notifications,
        unreadCount,
        isLoading,
        refreshData,
        createRequest,
        acceptRequest,
        updateRequestStatus,
        assignVolunteer,
        cancelRequest,
        submitFeedback,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
