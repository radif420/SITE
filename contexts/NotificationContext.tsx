'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  playOrderSound: () => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const playNotificationSound = () => {
    if (typeof window !== 'undefined' && 'Audio' in window) {
      try {
        // Create a pleasant notification sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Pleasant notification melody
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  const playOrderSound = () => {
    if (typeof window !== 'undefined' && 'Audio' in window) {
      try {
        // Create a special order notification sound - more celebratory
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Celebratory order sound - ascending notes
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.15); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.45); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.7);
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast.success(notification.title, {
      description: notification.message,
      icon: <Bell className="h-4 w-4" />,
      duration: 5000
    });

    // Play appropriate sound based on notification type
    if (notification.type === 'order') {
      playOrderSound();
    } else {
      playNotificationSound();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for new orders (in a real app, this would be a WebSocket or polling)
  useEffect(() => {
    const checkForNewOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          // This is a simple check - in a real app, you'd track the last known order count
          // For demo purposes, we'll just show a notification for the first order if there are any
          if (orders.length > 0 && notifications.length === 0) {
            const latestOrder = orders[0];
            addNotification({
              type: 'order',
              title: 'New Order Received!',
              message: `Order #${latestOrder.id} from ${latestOrder.customerName}`
            });
          }
        }
      } catch (error) {
        // Ignore errors
      }
    };

    // Check every 30 seconds (in production, use WebSocket)
    const interval = setInterval(checkForNewOrders, 30000);
    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      playOrderSound,
      playNotificationSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}