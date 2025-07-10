import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

class ActiveSessionService {
  private sessionId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isActive = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startSession();
    this.setupEventListeners();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('active_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('active_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async sendHeartbeat() {
    if (!this.sessionId || !this.isActive) return;

    try {
      await axios.post(`${API_BASE_URL}/heartbeat.php`, {
        session_id: this.sessionId,
        page_url: window.location.href
      });
    } catch (error) {
      console.warn('Failed to send heartbeat:', error);
    }
  }

  private async endSession() {
    if (!this.sessionId) return;

    try {
      await axios.post(`${API_BASE_URL}/end_session.php`, {
        session_id: this.sessionId
      });
    } catch (error) {
      console.warn('Failed to end session:', error);
    }
  }

  private startSession() {
    this.isActive = true;
    // Send initial heartbeat
    this.sendHeartbeat();
    
    // Send heartbeat every 45 seconds
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 45000);
  }

  private setupEventListeners() {
    // End session when user leaves
    window.addEventListener('beforeunload', () => {
      this.stopSession();
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isActive = false;
      } else {
        this.isActive = true;
        this.sendHeartbeat();
      }
    });

    // Handle route changes (for SPAs)
    window.addEventListener('popstate', () => {
      this.sendHeartbeat();
    });
  }

  public stopSession() {
    this.isActive = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    // Use sendBeacon for more reliable delivery when page is unloading
    if (navigator.sendBeacon && this.sessionId) {
      const data = JSON.stringify({ session_id: this.sessionId });
      navigator.sendBeacon(`${API_BASE_URL}/end_session.php`, data);
    } else {
      this.endSession();
    }
  }

  public static async getActiveUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_active_users.php`);
      return response.data;
    } catch (error) {
      console.error('Failed to get active users:', error);
      return { success: false, data: { active_users: 0 } };
    }
  }
}

export const activeSessionService = new ActiveSessionService();
export default ActiveSessionService;
