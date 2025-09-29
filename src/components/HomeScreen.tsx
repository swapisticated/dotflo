import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onSwipeUp: () => void;
}

export default function HomeScreen({ onSwipeUp }: HomeScreenProps) {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      // Swipe up detection: negative translationY and sufficient velocity
      if (event.translationY < -50 || event.velocityY < -500) {
        onSwipeUp();
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{currentTime}</Text>
          {/* <Text style={styles.hint}>swipe up for apps</Text> */}
        </View>
        
        <TouchableOpacity 
          style={styles.swipeArea}
          onPress={onSwipeUp}
          activeOpacity={0.7}
        >
          <Text style={styles.swipeIndicator}>⌃</Text>
        </TouchableOpacity>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: height * 0.3,
  },
  time: {
    color: '#ffffff',
    fontSize: 48,
    fontFamily: 'monospace',
    fontWeight: '300',
  },
  hint: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  swipeArea: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeIndicator: {
    color: '#333333',
    fontSize: 24,
    fontFamily: 'monospace',
  },
});