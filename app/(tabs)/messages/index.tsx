
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { MessageSquare, Search, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useThemeColors } from '../../../src/hooks/useThemeColors';
import { wp, hp, fp } from '../../../src/utils/responsive';
import ThemedStatusBar from '../../../src/components/ThemedStatusBar';
import UserSelectionModal from '../../../src/components/modals/UserSelectionModal';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colors = useThemeColors();

  const conversations = [
    {
      id: 1,
      name: 'Thomas Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=100&h=100',
      lastMessage: 'Nouvelle ronde à effectuer sur le secteur B',
      time: '10:30',
      unread: 2,
      online: true,
      role: 'Superviseur'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=100&h=100',
      lastMessage: 'Rapport de la ronde terminé',
      time: '09:45',
      unread: 0,
      online: true,
      role: 'Agent'
    },
    {
      id: 3,
      name: 'Lucas Martin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100',
      lastMessage: 'Incident résolu au secteur C',
      time: 'Hier',
      unread: 0,
      online: false,
      role: 'Agent'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: any) => {
    setIsModalVisible(false);
    router.push(`/messages/1`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedStatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: 0 }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text, fontSize: fp(22) }]}>Messages</Text>
          
          <TouchableOpacity 
            style={[
              styles.newMessageButton, 
              { backgroundColor: colors.primary }
            ]}
            accessibilityLabel="Nouveau message"
            onPress={() => setIsModalVisible(true)}
          >
            <Plus size={wp(18)} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}>
          <Search size={wp(18)} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontSize: fp(15) }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Rechercher des conversations"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.map((conv) => (
          <TouchableOpacity 
            key={conv.id} 
            style={[styles.conversationItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            onPress={() => router.push(`/messages/${conv.id}`)}
            accessibilityLabel={`Conversation avec ${conv.name}`}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: conv.avatar }} style={styles.avatar} />
              {conv.online && <View style={[styles.onlineIndicator, { borderColor: colors.card }]} />}
            </View>
            <View style={styles.conversationInfo}>
              <View style={styles.nameTimeRow}>
                <Text style={[styles.userName, { color: colors.text, fontSize: fp(16) }]}>{conv.name}</Text>
                <Text style={[styles.messageTime, { color: colors.textSecondary, fontSize: fp(12) }]}>
                  {conv.time}
                </Text>
              </View>
              
              <View style={styles.roleMessageRow}>
                <Text style={[
                  styles.userRole, 
                  { 
                    color: colors.primary, 
                    backgroundColor: `${colors.primary}15`,
                    fontSize: fp(11)
                  }
                ]}>
                  {conv.role}
                </Text>
                
                <Text 
                  style={[
                    styles.lastMessage, 
                    { 
                      color: conv.unread > 0 ? colors.text : colors.textSecondary, 
                      fontSize: fp(14),
                      fontWeight: conv.unread > 0 ? '500' : 'normal'
                    }
                  ]} 
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
                
                {conv.unread > 0 && (
                  <View style={[
                    styles.unreadBadge, 
                    { backgroundColor: colors.primary }
                  ]}>
                    <Text style={[styles.unreadCount, { color: colors.card, fontSize: fp(12) }]}>
                      {conv.unread}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredConversations.length === 0 && (
        <View style={styles.noResults}>
          <MessageSquare size={wp(40)} color={colors.textSecondary} />
          <Text style={[styles.noResultsText, { color: colors.textSecondary, fontSize: fp(16) }]}>
            Aucune conversation trouvée
          </Text>
        </View>
      )}

      <UserSelectionModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectUser={handleSelectUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp(16),
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  newMessageButton: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(12),
    padding: wp(12),
    marginTop: hp(12),
  },
  searchIcon: {
    marginRight: wp(8),
  },
  searchInput: {
    flex: 1,
  },
  chatList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: wp(15),
    borderBottomWidth: 0.5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: wp(12),
    justifyContent: 'center',
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(4),
  },
  roleMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative',
  },
  userName: {
    fontWeight: '600',
  },
  userRole: {
    borderRadius: wp(10),
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
    marginRight: wp(8),
  },
  lastMessage: {
    flex: 1,
    lineHeight: fp(20),
  },
  messageTime: {
    marginLeft: wp(4),
  },
  unreadBadge: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(8),
  },
  unreadCount: {
    fontWeight: 'bold',
  },
  noResults: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(20),
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: hp(16),
  },
});
