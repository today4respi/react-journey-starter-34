
// Theme colors for the application
export const lightTheme = {
  background: '#F6F6F7',
  card: '#FFFFFF',
  text: '#222222',
  textSecondary: '#666666',
  primary: '#0EA5E9',
  secondary: '#94A3B8',
  border: '#E2E8F0',
  success: '#22C55E',
  warning: '#FBBF24',
  danger: '#EF4444', // for error states
  error: '#EF4444',   // adding explicit error property
  info: '#60A5FA',
  headerBg: '#F8FAFC',
  tabBarBg: '#FFFFFF',
  inputBg: '#F1F5F9',
  divider: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  isDark: false,     // flag to check if dark mode is active
  
  // Login page specific colors
  loginHeaderBg: 'rgba(15, 23, 42, 0.9)',
  loginCardBg: '#FFFFFF',
  loginInputBg: '#F1F5F9',
  loginButtonBg: '#0EA5E9',
  loginButtonText: '#FFFFFF',
  loginSecondaryButtonBg: '#94A3B8',
  loginSecondaryButtonText: '#FFFFFF',
  
  // Modal specific colors
  modalOverlayBg: 'rgba(0, 0, 0, 0.4)',
  modalBg: '#FFFFFF',
  modalHeaderBg: '#F8FAFC',
  modalDragIndicator: '#CBD5E1',
};

export const darkTheme = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  primary: '#60A5FA',
  secondary: '#64748B',
  border: '#334155',
  success: '#22C55E',
  warning: '#FBBF24',
  danger: '#EF4444', // for error states
  error: '#EF4444',   // adding explicit error property
  info: '#60A5FA',
  headerBg: '#1E293B',
  tabBarBg: '#1E293B',
  inputBg: '#334155',
  divider: '#334155',
  shadow: 'rgba(0, 0, 0, 0.3)',
  isDark: true,      // flag to check if dark mode is active
  
  // Login page specific colors
  loginHeaderBg: 'rgba(15, 23, 42, 0.95)',
  loginCardBg: '#1E293B',
  loginInputBg: '#334155',
  loginButtonBg: '#60A5FA',
  loginButtonText: '#FFFFFF',
  loginSecondaryButtonBg: '#64748B',
  loginSecondaryButtonText: '#FFFFFF',
  
  // Modal specific colors
  modalOverlayBg: 'rgba(0, 0, 0, 0.6)',
  modalBg: '#1E293B',
  modalHeaderBg: '#0F172A',
  modalDragIndicator: '#334155',
};

export type ThemeColors = typeof lightTheme;

export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'light' ? lightTheme : darkTheme;
};
