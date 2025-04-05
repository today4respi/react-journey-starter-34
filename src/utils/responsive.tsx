
import React from 'react';
import { Dimensions, Platform, PixelRatio, ScaledSize } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions that we're designing for
const baseWidth = 375;
const baseHeight = 812;

// Scaling factors
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

/**
 * Function to scale a size responsively based on screen width
 */
export const wp = (size: number) => {
  const newSize = size * widthScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Function to scale a size responsively based on screen height
 */
export const hp = (size: number) => {
  const newSize = size * heightScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Function for responsive font sizing
 */
export const fp = (size: number) => {
  const scale = Math.min(widthScale, heightScale);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Hook to get screen dimensions and update on orientation changes
 */
export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = React.useState<ScaledSize>({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scale: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale()
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
        scale: PixelRatio.get(),
        fontScale: PixelRatio.getFontScale()
      });
    });

    return () => subscription.remove();
  }, []);

  return dimensions;
};

/**
 * Constants for device platform
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Get safe area insets for different platforms
 */
export const getSafeAreaInsets = () => {
  // Default insets - can be adjusted based on device specifics
  const defaultInsets = {
    top: isIOS ? 50 : 30,
    bottom: isIOS ? 34 : 16,
    left: 0,
    right: 0,
  };
  
  return defaultInsets;
};
