import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AdmissionsGuide() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const stepRefs = Array.from({ length: 7 }, () => useRef(null));

  const scrollToStep = (index) => {
    stepRefs[index]?.current?.measureLayout(
      scrollRef.current,
      (x, y) => scrollRef.current.scrollTo({ y, animated: true }),
      () => {}
    );
  };

  const scrollToTop = () => {
    scrollRef.current.scrollTo({ y: 0, animated: true });
  };

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#003366" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Admissions Journey with KOEDU Bridge</Text>
      <Text style={styles.subtitle}>A step-by-step guide to help you from start to finish.</Text>

      <View style={styles.introWrapper}>
        <Text style={styles.intro}>
          <Text style={{ fontWeight: 'bold' }}>Studying in Korea</Text>
          {'\n'}
          Navigating your way through the process of coming to Korea can seem overwhelming at first.
          We've created a step-by-step guide to help you understand what to do, when to do it,
          and where to find the right information. With KOEDU Bridge, you're never alone in the process.
        </Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require('../../assets/images/student-travel.webp')}
          style={styles.image}
        />
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>📘 Content Overview</Text>
        {[
          'Inspiration',
          'Learn more about the university',
          'The admissions application',
          'Scholarships',
          'After applying',
          'Admissions results!',
          'Preparing to move to Korea',
        ].map((label, index) => (
          <Pressable
            key={index}
            onPress={() => scrollToStep(index)}
            style={({ pressed }) => [
              styles.contentLinkWrapper,
              pressed && { backgroundColor: '#e0eaf5' }
            ]}
          >
            <Text style={styles.contentLink}>• Step {index + 1} - {label}</Text>
          </Pressable>
        ))}
      </View>

      {[
        {
          title: "Step 1 - Inspiration",
          description:
            "Start your journey by exploring what it means to study in Korea: student life, types of universities, education system, and fields of study. Use KOEDU Bridge or StudyinKorea.go.kr for more insights.",
        },
        {
          title: "Step 2 - Learn more about the university",
          description:
            "Once inspired, check university websites or use KOEDU Bridge to find verified programs. Understand the courses, requirements, tuition fees, and location.",
        },
        {
          title: "Step 3 - The admissions application",
          description:
            "Start your application directly on KOEDU Bridge. Submit your personal info, documents, and pay application fees as required. We guide you through every step.",
        },
        {
          title: "Step 4 - Scholarships",
          description:
            "Explore scholarship opportunities from Korean universities or government sources. We help you identify available options based on your profile.",
        },
        {
          title: "Step 5 - After applying",
          description:
            "Once your application is submitted, you can track your status on your KOEDU dashboard. Meanwhile, prepare for your visa, translations, or additional steps.",
        },
        {
          title: "Step 6 - Admissions results!",
          description:
            "You’ll be notified directly by KOEDU once the results are available. If admitted, congratulations! You’ll proceed to the next administrative steps.",
        },
        {
          title: "Step 7 - Preparing to move to Korea",
          description:
            "Time to pack! KOEDU provides checklists, visa support, and pre-departure guidance so you're ready to begin your academic life in Korea.",
        },
      ].map((step, index) => (
        <View key={index} ref={stepRefs[index]}>
          <Step title={step.title} description={step.description} />
        </View>
      ))}

      <TouchableOpacity style={styles.topBtn} onPress={scrollToTop}>
        <Ionicons name="arrow-up" size={20} color="#003366" />
        <Text style={styles.topText}>Back to Top</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Step({ title, description }) {
  return (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  backText: {
    fontSize: 16,
    color: '#003366',
    marginLeft: 8,
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },

  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    alignSelf: 'center',
  },

  introWrapper: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 24,
    maxWidth: 1200,
  },

  intro: {
    fontSize: 25,
    color: '#444',
    lineHeight: 35,
    textAlign: 'left',
  },

  imageWrapper: {
    width: '65%',
    aspectRatio: 1.5,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  contentBox: {
    backgroundColor: '#f1f4f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 1200,
  },

  contentTitle: {
    fontSize: 40,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 12,
    textAlign: 'left',
  },

  contentLinkWrapper: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  contentLink: {
    fontSize: 25,
    color: '#003366',
    textAlign: 'left',
  },

  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    backgroundColor: '#f1f4f8',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  topText: {
    marginLeft: 6,
    color: '#003366',
    fontSize: 15,
    fontWeight: '500',
  },

  step: {
    marginBottom: 28,
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 1200,
    backgroundColor: '#f9fbfd',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  stepTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 6,
    textAlign: 'left',
  },

  stepDesc: {
    fontSize: 20,
    color: '#444',
    lineHeight: 30,
    textAlign: 'left',
  },
});
