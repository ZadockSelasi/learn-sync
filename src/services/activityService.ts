import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'quiz_completed' 
  | 'task_completed' 
  | 'roadmap_created' 
  | 'flashcard_created'
  | 'error';

export interface ActivityLog {
  userId: string;
  userEmail: string | null;
  action: ActivityType;
  metadata?: any;
  timestamp: any;
}

/**
 * Logs a user activity to Firestore for analytics and monitoring
 */
export const logActivity = async (
  userId: string, 
  userEmail: string | null, 
  action: ActivityType, 
  metadata: any = {}
) => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      userId,
      userEmail,
      action,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
