
// Navigation route names
export const ROUTES = {
  // Auth Routes
  START: 'Start',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  OTP: 'OTP',                             // New unified OTP screen
  FORGOT_PASSWORD: 'ForgotPassword',
  FORGOT_PASSWORD_EMAIL: 'ForgotPasswordEmail',
  VERIFICATION_CODE: 'VerificationCode',
  RESET_PASSWORD: 'ResetPassword',
  RESET_PASSWORD_SUCCESS: 'ResetPasswordSuccess',
  
  // Main Routes
  HOME: 'Home',        // Primary route for the home/map screen
  PROFILE: 'Profile', 
  SETTINGS: 'Settings',
  HISTORICAL_PLACES: 'HistoricalPlaces',
  ACOTE: 'Acote',
  RESERVATION: 'Reservation',
  CONFIDENTIALITE: 'Confidentialite',
  PLACE_DETAILS: 'PlaceDetails',
  PLACE_REVIEWS: 'PlaceReviews',   // New route for place reviews
  
  // Admin Routes
  ADMIN_DASHBOARD: 'AdminDashboard',
  USER_MANAGEMENT: 'UserManagement',
  LOCATION_MANAGEMENT: 'LocationManagement',
  EVENT_MANAGEMENT: 'EventManagement', 
  REVIEW_MODERATION: 'ReviewModeration',
  GLOBAL_SUPERVISION: 'GlobalSupervision',
  
  // Provider Routes
  PROVIDER_DASHBOARD: 'ProviderDashboard',
  ACCOUNT_MANAGEMENT: 'AccountManagement',
  RESERVATION_MANAGEMENT: 'ReservationManagement',
  REVIEW_MANAGEMENT: 'ReviewManagement',
  PROMOTION_MANAGEMENT: 'PromotionManagement',
  ADD_PLACE: 'AddPlace',
  MY_PLACES: 'MyPlaces',
  EDIT_PLACE: 'EditPlace',
};

// Stack names
export const STACKS = {
  AUTH: 'AuthStack',
  USER: 'UserStack',
  ADMIN: 'AdminStack',
  PROVIDER: 'ProviderStack',
};
