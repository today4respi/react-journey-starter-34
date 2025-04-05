
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
  if (!visible) return null;

  const handleLogout = () => {
    router.replace('/(auth)/login');
    onClose();
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
    onClose();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={handleSettings}>
        <Settings size={20} color="#60A5FA" />
        <Text style={styles.optionText}>Réglages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <LogOut size={20} color="#EF4444" />
        <Text style={[styles.optionText, styles.logoutText]}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  logoutText: {
    color: '#EF4444',
  },
});
