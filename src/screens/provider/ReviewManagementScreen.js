
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  FlatList,
  TextInput,
  Modal,
  Platform
} from 'react-native';
import { 
  ArrowLeft,
  User,
  MessageSquare,
  Flag,
  Star,
  Calendar,
  Send,
  X
} from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { FONT_SIZE } from '../../theme/typography';
import * as Animatable from 'react-native-animatable';

const ReviewManagementScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      name: 'Ahmed Mehdi', 
      date: '10/03/2025', 
      rating: 4, 
      comment: 'Très bon service, nourriture délicieuse et accueil chaleureux.',
      replied: false,
      reply: '',
      reported: false
    },
    { 
      id: 2, 
      name: 'Fatima Jouini', 
      date: '08/03/2025', 
      rating: 5, 
      comment: 'Excellent! Le meilleur restaurant de cuisine traditionnelle à Jendouba!',
      replied: false,
      reply: '',
      reported: false
    },
    { 
      id: 3, 
      name: 'Karim Bennour', 
      date: '05/03/2025', 
      rating: 3, 
      comment: 'Service correct mais temps d\'attente un peu long.',
      replied: true,
      reply: 'Merci pour votre retour, nous travaillons à améliorer notre temps de service.',
      reported: false
    },
    { 
      id: 4, 
      name: 'Nadia Khaled', 
      date: '02/03/2025', 
      rating: 2, 
      comment: 'Déçu par la qualité des plats. Trop chers pour ce que c\'est.',
      replied: true,
      reply: 'Nous sommes désolés de votre expérience. Pourriez-vous nous donner plus de détails afin que nous puissions améliorer notre service?',
      reported: false
    },
  ]);

  const [replyText, setReplyText] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        color={i < rating ? '#FFC107' : COLORS.gray_light}
        fill={i < rating ? '#FFC107' : 'none'}
      />
    ));
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply);
    setReplyModalVisible(true);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    
    setReviews(reviews.map(review => 
      review.id === selectedReview.id 
        ? { ...review, replied: true, reply: replyText } 
        : review
    ));
    
    setReplyModalVisible(false);
    setReplyText('');
  };

  const handleReport = (review) => {
    setSelectedReview(review);
    setReportModalVisible(true);
  };

  const submitReport = () => {
    if (!reportReason.trim()) return;
    
    setReviews(reviews.map(review => 
      review.id === selectedReview.id 
        ? { ...review, reported: true } 
        : review
    ));
    
    setReportModalVisible(false);
    setReportReason('');
  };

  const renderReviewItem = ({ item }) => (
    <Animatable.View 
      animation="fadeIn" 
      duration={500} 
      style={styles.reviewCard}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <User size={18} color={COLORS.primary} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={COLORS.gray} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          {renderStars(item.rating)}
        </View>
      </View>
      
      <Text style={styles.commentText}>{item.comment}</Text>
      
      {item.replied && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Votre réponse:</Text>
          <Text style={styles.replyText}>{item.reply}</Text>
        </View>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.replyButton]}
          onPress={() => handleReply(item)}
        >
          <MessageSquare size={18} color={COLORS.white} />
          <Text style={styles.actionButtonText}>
            {item.replied ? 'Modifier' : 'Répondre'}
          </Text>
        </TouchableOpacity>
        
        {!item.reported && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.reportButton]}
            onPress={() => handleReport(item)}
          >
            <Flag size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Signaler</Text>
          </TouchableOpacity>
        )}
        
        {item.reported && (
          <View style={styles.reportedBadge}>
            <Flag size={14} color={COLORS.error} />
            <Text style={styles.reportedText}>Signalé</Text>
          </View>
        )}
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestion des avis</Text>
        <Text style={styles.subtitle}>Répondez aux avis de vos clients</Text>
      </Animatable.View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reviews.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length}
          </Text>
          <Text style={styles.statLabel}>Moyenne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {reviews.filter(r => r.replied).length}
          </Text>
          <Text style={styles.statLabel}>Réponses</Text>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Reply Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={replyModalVisible}
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp" 
            duration={300} 
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Répondre à l'avis</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setReplyModalVisible(false)}
              >
                <X size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            
            {selectedReview && (
              <View style={styles.selectedReview}>
                <Text style={styles.selectedReviewName}>{selectedReview.name}</Text>
                <View style={styles.selectedReviewRating}>
                  {renderStars(selectedReview.rating)}
                </View>
                <Text style={styles.selectedReviewComment}>{selectedReview.comment}</Text>
              </View>
            )}
            
            <TextInput
              style={styles.replyInput}
              placeholder="Écrivez votre réponse..."
              multiline
              value={replyText}
              onChangeText={setReplyText}
            />
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={submitReply}
            >
              <Send size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp" 
            duration={300} 
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Signaler l'avis</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setReportModalVisible(false)}
              >
                <X size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            
            {selectedReview && (
              <View style={styles.selectedReview}>
                <Text style={styles.selectedReviewName}>{selectedReview.name}</Text>
                <Text style={styles.selectedReviewComment}>{selectedReview.comment}</Text>
              </View>
            )}
            
            <Text style={styles.reasonLabel}>Motif du signalement:</Text>
            
            <TextInput
              style={styles.replyInput}
              placeholder="Précisez le motif du signalement..."
              multiline
              value={reportReason}
              onChangeText={setReportReason}
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, styles.reportSubmitButton]}
              onPress={submitReport}
            >
              <Flag size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>Signaler</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? SPACING.xl * 2 : SPACING.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: -SPACING.lg,
    borderRadius: 12,
    padding: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
    color: COLORS.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginLeft: 4,
  },
  ratingContainer: {
    marginBottom: SPACING.sm,
  },
  stars: {
    flexDirection: 'row',
  },
  commentText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  replyContainer: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  replyLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  replyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flex: 1,
    marginHorizontal: 4,
  },
  replyButton: {
    backgroundColor: COLORS.info,
  },
  reportButton: {
    backgroundColor: COLORS.warning,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reportedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 16,
  },
  reportedText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    padding: 4,
  },
  selectedReview: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  selectedReviewName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  selectedReviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  selectedReviewComment: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
  },
  reasonLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  replyInput: {
    backgroundColor: COLORS.light_gray,
    borderRadius: 12,
    padding: SPACING.md,
    maxHeight: 150,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  reportSubmitButton: {
    backgroundColor: COLORS.error,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
    marginLeft: 8,
  },
});

export default ReviewManagementScreen;
