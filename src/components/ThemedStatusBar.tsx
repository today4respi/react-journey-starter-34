
import { StatusBar, StatusBarProps } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';
import { Platform, View, StatusBar as RNStatusBar, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ThemedStatusBarProps extends Omit<StatusBarProps, 'style'> {
  translucent?: boolean;
  showBackground?: boolean;
}

export default function ThemedStatusBar({ 
  translucent = true, 
  showBackground = true,
  ...props 
}: ThemedStatusBarProps) {
  const { theme } = useTheme();
  const colors = useThemeColors();
  
  // Reduce the status bar height to minimize empty space
  const statusBarHeight = Platform.OS === 'ios' ? 44 : RNStatusBar.currentHeight || 0;
  
  if (!showBackground) {
    return (
      <StatusBar 
        style={theme === 'dark' ? 'light' : 'dark'} 
        translucent={translucent}
        {...props}
      />
    );
  }
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.headerBg, height: statusBarHeight }
    ]}>
      <StatusBar 
        style={theme === 'dark' ? 'light' : 'dark'} 
        translucent={translucent}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  }
});
