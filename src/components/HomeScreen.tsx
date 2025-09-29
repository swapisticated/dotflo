import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { type App as AppType } from '../types/AppListModule';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onSwipeUp: () => void;
  favoriteApps: AppType[];
  onAppPress: (app: AppType) => void;
}

export default function HomeScreen({ onSwipeUp, favoriteApps, onAppPress }: HomeScreenProps) {
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

        {favoriteApps.length > 0 && (
          <View style={styles.favoritesContainer}>
            <View style={styles.favoritesRow}>
              {favoriteApps.map((app) => (
                <TouchableOpacity
                  key={app.packageName}
                  style={styles.favoriteApp}
                  onPress={() => onAppPress(app)}
                >
                  <Image
                    source={{ uri: `data:image/png;base64,${app.icon}` }}
                    style={styles.favoriteIcon}
                  />
                  <Text style={styles.favoriteLabel}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
  favoritesContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  favoritesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  favoriteApp: {
    alignItems: 'center',
    margin: 15,
    width: 60,
  },
  favoriteIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  favoriteLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});