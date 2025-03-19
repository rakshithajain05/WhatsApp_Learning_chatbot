import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SubjectSelector } from '../components/SubjectSelector';
import { ChatMessage } from '../components/ChatMessage';
import { toast } from 'sonner-native';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const VideoLecture = ({ title, thumbnail, videoUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.videoCard} onPress={onPress}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDuration}>20:15</Text>
      </View>
    </TouchableOpacity>
  );
};

const videoLectures = [
  {
    id: '1',
    title: 'Introduction to Basic Mathematics',
    thumbnail: 'https://api.a0.dev/assets/image?text=math%20teacher%20explaining%20equations%20on%20blackboard&aspect=16:9',
    videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
  },
  {
    id: '2',
    title: 'Understanding Science Fundamentals',
    thumbnail: 'https://api.a0.dev/assets/image?text=science%20experiment%20in%20classroom&aspect=16:9',
    videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
  },
  {
    id: '3',
    title: 'English Language Basics',
    thumbnail: 'https://api.a0.dev/assets/image?text=english%20teacher%20teaching%20in%20classroom&aspect=16:9',
    videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
  }
];

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your educational assistant. I can help you learn any subject. What would you like to study today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);  const [currentSubject, setCurrentSubject] = useState('General');
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a helpful educational assistant specialized in ${currentSubject}. 
                       Provide clear, simple explanations suitable for students with limited educational background.
                       Keep responses concise and use simple language.`,
            },
            {
              role: 'user',
              content: inputText,
            },
          ],
        }),
        videoSection: {
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  videoCard: {
    width: width * 0.7,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  videoDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  videoHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: '#000',
  },
});

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const handleVideoPress = useCallback((video) => {
    setSelectedVideo(video);
    setShowVideo(true);
  }, []);

  if (showVideo && selectedVideo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.videoHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setShowVideo(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.videoHeaderTitle}>{selectedVideo.title}</Text>
        </View>
        <Video
          ref={videoRef}
          style={styles.videoPlayer}
          source={{ uri: selectedVideo.videoUrl }}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=friendly%20ai%20teacher%20avatar&aspect=1:1' }} 
            style={styles.profileImage} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Educational Assistant</Text>
            <Text style={styles.headerStatus}>Always available to help</Text>
          </View>
        </View>
        <Text style={styles.subjectText}>Current Subject: {currentSubject}</Text>
      </View>

      <SubjectSelector
        currentSubject={currentSubject}
        onSelectSubject={setCurrentSubject}
      />      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Video Lectures</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {videoLectures.map((video) => (
              <VideoLecture
                key={video.id}
                {...video}
                onPress={() => handleVideoPress(video)}
              />
            ))}
          </ScrollView>
        </View>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0084ff" />
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your question..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() ? '#0084ff' : '#ccc'}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },  header: {
    padding: 16,
    backgroundColor: '#075E54',
    borderBottomWidth: 1,
    borderBottomColor: '#054C44',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 13,
    color: '#B5B5B5',
    marginTop: 2,
  },
  subjectText: {
    color: '#e0e0e0',
    fontSize: 14,
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
    padding: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSection: {
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  videoCard: {
    width: width * 0.7,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  videoDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  videoHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: '#000',
  },
});