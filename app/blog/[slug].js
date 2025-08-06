import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Footer from '../../components/Footer'; // ✅ Assure-toi que le chemin est correct
import universities from '../../data/universities';

export default function BlogDetail() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;

  const university = universities.find((u) => u.slug === slug);
  const [modalVisible, setModalVisible] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const scale = useSharedValue(1);

  if (!university) {
    return <Text style={styles.notFound}>University not found.</Text>;
  }

  const handleShare = async () => {
    try {
      const url = `https://yourappdomain.com/blog/${university.slug}`;
      await Share.share({
        message: `Check out ${university.title} – ${url}`,
        url,
        title: university.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSignupPress = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      router.push('/user/consent');
    }, 2000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const galleryImages = university.images.map((img) =>
    typeof img === 'number' ? { props: { source: img } } : { url: img?.uri || img }
  );

  const renderStars = (rating) => {
    const validRating = typeof rating === 'number' && rating >= 0 ? rating : 0;
    const fullStars = Math.floor(validRating);
    const stars = Array.from({ length: fullStars }, () => '⭐');
    return stars.join(' ');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[styles.row, { flexDirection: isWideScreen ? 'row' : 'column' }]}
        >
          <View style={[styles.leftColumn, { width: isWideScreen ? '65%' : '100%' }]}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{university.title}</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => router.push('/user/gallery')}>
                <Ionicons name="arrow-back" size={20} color="#003366" />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

            </View>
            <Text style={styles.date}>{university.date}</Text>

            {university.images?.[0] && (
              <TouchableOpacity onPress={() => { setZoomIndex(0); setZoomVisible(true); }}>
                <Image
                  source={
                    typeof university.images[0] === 'number'
                      ? university.images[0]
                      : { uri: university.images[0]?.uri || university.images[0] }
                  }
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            <Text style={styles.description}>{university.desc}</Text>

            {university.images?.length > 1 && (
              <>
                <Text style={styles.sectionTitle}>📸 Gallery</Text>
                <View style={styles.gallery}>
                  {university.images.slice(1).map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setZoomIndex(idx + 1);
                        setZoomVisible(true);
                      }}
                    >
                      <Image
                        source={typeof img === 'number' ? img : { uri: img?.uri || img }}
                        style={styles.galleryImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.videoButton} onPress={() => Linking.openURL(university.video)}>
              <Text style={styles.videoButtonText}>🎬 Watch Video Tour</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>📤 Share University</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.rightBox, { width: isWideScreen ? '30%' : '100%', marginTop: isWideScreen ? 0 : 20 }]}>
            <Text style={styles.boxTitle}>🎓 Ready to apply?</Text>
            <Text style={styles.boxText}>Sign up now to begin your university journey.</Text>

            <TouchableOpacity
              onPressIn={() => (scale.value = withSpring(0.95))}
              onPressOut={() => (scale.value = withSpring(1))}
              onPress={handleSignupPress}
              activeOpacity={0.9}
            >
              <Animated.View style={[styles.signupButtonEnhanced, animatedStyle]}>
                <Text style={styles.signupButtonTextEnhanced}>🚀 S’inscrire maintenant</Text>
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>{renderStars(university.rating ?? 0)}</Text>
              <Text style={styles.ratingText}>{university.rating} • {university.reviewCount} avis</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(true)} style={styles.reviewsButton}>
                <Text style={styles.reviewsButtonText}>📚 Voir tous les avis</Text>
              </TouchableOpacity>
            </View>

            {university.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {university.tags.map((tag, idx) => (
                  <Text key={idx} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* ✅ Footer en dehors du ScrollView */}
      <Footer />

      {/* Modals */}
      <Modal isVisible={modalVisible} animationIn="zoomIn" animationOut="fadeOut">
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>✅ Redirection vers la page de connexion...</Text>
        </View>
      </Modal>

      <Modal isVisible={zoomVisible} onBackdropPress={() => setZoomVisible(false)} style={{ margin: 0 }}>
        <ImageViewer
          imageUrls={galleryImages}
          index={zoomIndex}
          enableSwipeDown
          onSwipeDown={() => setZoomVisible(false)}
          saveToLocalByLongPress={false}
        />
      </Modal>

      <Modal isVisible={reviewModalVisible} onBackdropPress={() => setReviewModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⭐ Tous les avis</Text>
          <Text style={styles.modalText}>Note moyenne : {university.rating} / 5</Text>
          <Text style={styles.modalText}>Nombre total d’avis : {university.reviewCount}</Text>
          <Text style={{ marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>
            Les avis seront bientôt affichés ici...
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: 16,
  paddingBottom: 100, // pour ne pas masquer le contenu par le footer
  marginTop: 40,      // ✅ Ajout de l’espace au-dessus
  backgroundColor: '#f9f9f9',
},

  row: {
    justifyContent: 'space-between',
  },
  leftColumn: {
    paddingRight: 16,
  },
  rightBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#003366',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  mainImage: {
    width: '100%',
    height: 700,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#003366',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  videoButton: {
    marginTop: 16,
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 6,
  },
  videoButtonText: {
    color: '#0077b6',
    fontWeight: '600',
  },
  shareButton: {
    marginTop: 12,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
  },
  shareButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  boxText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  signupButtonEnhanced: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  signupButtonTextEnhanced: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  ratingContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  stars: {
    fontSize: 20,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  reviewsButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ddeeff',
    borderRadius: 20,
  },
  reviewsButtonText: {
    color: '#003366',
    fontWeight: '600',
    fontSize: 13,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#003366',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    color: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },
});
