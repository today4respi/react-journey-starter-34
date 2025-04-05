import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  TextInput, 
  Image,
  Platform,
  Animated,
} from 'react-native';
import { X, Search, User } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { wp, hp, fp } from '../../utils/responsive';

type User = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
};

interface UserSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

const UserSelectionModal = ({ visible, onClose, onSelectUser }: UserSelectionModalProps) => {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const users: User[] = [
    {
      id: 1,
      name: 'Thomas Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100',
      role: 'Superviseur',
      online: true
    },
    // ... other users ...
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSelectUser(user);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modal.modalOverlayBg }]}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              backgroundColor: colors.modalBg,
              borderTopLeftRadius: colors.modal.borderRadius,
              borderTopRightRadius: colors.modal.borderRadius,
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }]
            }
          ]}
        >
          <View style={styles.dragHandleArea}>
            <View style={[
              styles.dragHandle, 
              { 
                backgroundColor: colors.modalDragIndicator,
                width: colors.modal.dragHandleHeight,
              }
            ]} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Nouvelle conversation
              </Text>
              <TouchableOpacity 
                onPress={closeModal} 
                style={[styles.closeButton, { backgroundColor: colors.opacity(colors.card, 0.5) }]}
              >
                <X size={wp(20)} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}>
              <Search size={wp(18)} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Rechercher un utilisateur..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearSearch}>
                  <X size={wp(16)} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id.toString()}
              style={styles.userList}
              contentContainerStyle={styles.userListContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <User size={wp(40)} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Aucun utilisateur trouvé
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.userItem, { backgroundColor: colors.card }]}
                  onPress={() => handleSelectUser(item)}
                >
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    {item.online && (
                      <View style={[styles.onlineIndicator, { 
                        backgroundColor: colors.success,
                        borderColor: colors.card
                      }]} />
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.userRole, { 
                      color: colors.primary,
                      backgroundColor: `${colors.primary}15`
                    }]}>
                      {item.role}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '75%',
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? hp(34) : hp(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: wp(16),
  },
  dragHandleArea: {
    width: '100%',
    paddingVertical: hp(12),
    alignItems: 'center',
  },
  dragHandle: {
    height: 5,
    borderRadius: 3,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  modalTitle: {
    fontSize: fp(18),
    fontWeight: '600',
  },
  closeButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(12),
    padding: wp(12),
    marginBottom: hp(16),
  },
  searchIcon: {
    marginRight: wp(8),
  },
  searchInput: {
    flex: 1,
    fontSize: fp(15),
  },
  clearSearch: {
    padding: wp(4),
  },
  userList: {
    flex: 1,
    width: '100%',
  },
  userListContent: {
    paddingBottom: hp(20),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(60),
  },
  emptyText: {
    fontSize: fp(16),
    marginTop: hp(12),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(12),
    borderRadius: wp(10),
    marginBottom: hp(8),
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: wp(46),
    height: wp(46),
    borderRadius: wp(23),
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: wp(12),
  },
  userName: {
    fontSize: fp(16),
    fontWeight: '600',
    marginBottom: hp(4),
  },
  userRole: {
    fontSize: fp(11),
    alignSelf: 'flex-start',
    borderRadius: wp(10),
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
  }
});

export default UserSelectionModal;
