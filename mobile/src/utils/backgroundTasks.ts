import { AppState, AppStateStatus } from 'react-native';

// Auto logout configuration
export interface AutoLogoutConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  enabled: boolean;
}

// Auto logout timer
export class AutoLogoutTimer {
  private static instance: AutoLogoutTimer;
  private timer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private config: AutoLogoutConfig = {
    timeoutMinutes: 30,
    warningMinutes: 5,
    enabled: true,
  };
  private onWarning?: () => void;
  private onLogout?: () => void;

  static getInstance(): AutoLogoutTimer {
    if (!AutoLogoutTimer.instance) {
      AutoLogoutTimer.instance = new AutoLogoutTimer();
    }
    return AutoLogoutTimer.instance;
  }

  configure(config: Partial<AutoLogoutConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setCallbacks(onWarning: () => void, onLogout: () => void): void {
    this.onWarning = onWarning;
    this.onLogout = onLogout;
  }

  start(): void {
    if (!this.config.enabled) return;

    this.reset();

    // Set warning timer
    const warningTime = (this.config.timeoutMinutes - this.config.warningMinutes) * 60 * 1000;
    this.warningTimer = setTimeout(() => {
      if (this.onWarning) {
        this.onWarning();
      }
    }, warningTime);

    // Set logout timer
    const logoutTime = this.config.timeoutMinutes * 60 * 1000;
    this.timer = setTimeout(() => {
      if (this.onLogout) {
        this.onLogout();
      }
    }, logoutTime);
  }

  reset(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  stop(): void {
    this.reset();
  }

  extend(additionalMinutes: number = 15): void {
    if (!this.config.enabled) return;
    
    this.config.timeoutMinutes += additionalMinutes;
    this.start(); // Restart with new timeout
  }
}

// Network status monitoring (simplified)
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private listeners: ((isConnected: boolean) => void)[] = [];
  private isConnected: boolean = true;

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  // Simplified network monitoring
  initialize(): void {
    console.log('Network monitoring initialized (simplified)');
  }

  addListener(listener: (isConnected: boolean) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Method to manually update connection status
  updateConnectionStatus(isConnected: boolean): void {
    if (this.isConnected !== isConnected) {
      this.isConnected = isConnected;
      this.listeners.forEach(listener => listener(isConnected));
    }
  }
}

// App state management
export class AppStateManager {
  private static instance: AppStateManager;
  private lastActiveTime: number = Date.now();
  private autoLogoutTimer: AutoLogoutTimer;
  private networkMonitor: NetworkMonitor;
  private appStateSubscription: any = null;

  static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  constructor() {
    this.autoLogoutTimer = AutoLogoutTimer.getInstance();
    this.networkMonitor = NetworkMonitor.getInstance();
  }

  initialize(onWarning: () => void, onLogout: () => void): void {
    // Initialize auto logout
    this.autoLogoutTimer.setCallbacks(onWarning, onLogout);
    
    // Initialize network monitoring
    this.networkMonitor.initialize();

    // Listen to app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    
    // Start auto logout timer
    this.handleAppStateChange('active');
  }

  cleanup(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    this.autoLogoutTimer.stop();
  }

  handleAppStateChange(nextAppState: AppStateStatus): void {
    const now = Date.now();

    if (nextAppState === 'active') {
      // App became active
      this.lastActiveTime = now;
      this.autoLogoutTimer.start();
      console.log('App became active - auto logout timer started');
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App went to background
      this.autoLogoutTimer.stop();
      console.log('App went to background - auto logout timer stopped');
    }
  }

  handleUserActivity(): void {
    // Reset auto logout timer on user activity
    this.lastActiveTime = Date.now();
    this.autoLogoutTimer.start();
  }

  getLastActiveTime(): number {
    return this.lastActiveTime;
  }

  addNetworkListener(listener: (isConnected: boolean) => void): () => void {
    return this.networkMonitor.addListener(listener);
  }

  isNetworkConnected(): boolean {
    return this.networkMonitor.getConnectionStatus();
  }

  // Method to update network status manually
  updateNetworkStatus(isConnected: boolean): void {
    this.networkMonitor.updateConnectionStatus(isConnected);
  }
}

// Export utilities
export const initializeBackgroundTasks = (): void => {
  console.log('Background tasks initialized successfully');
};

export const cleanupBackgroundTasks = (): void => {
  // Stop auto logout timer
  const autoLogoutTimer = AutoLogoutTimer.getInstance();
  autoLogoutTimer.stop();

  // Cleanup app state manager
  const appStateManager = AppStateManager.getInstance();
  appStateManager.cleanup();

  console.log('Background tasks cleaned up successfully');
};

export default {
  NetworkMonitor,
  AutoLogoutTimer,
  AppStateManager,
  initializeBackgroundTasks,
  cleanupBackgroundTasks,
}; 