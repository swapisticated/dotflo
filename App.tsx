import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Modal,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppListModule, { type App as AppType } from './src/types/AppListModule';
import HomeScreen from './src/components/HomeScreen';
import AppDrawer from './src/components/AppDrawer';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LauncherContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function LauncherContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [apps, setApps] = useState<AppType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<AppType[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [favoriteApps, setFavoriteApps] = useState<AppType[]>([]);
  
  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredApps(apps);
    } else {
      const filtered = apps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApps(filtered);
    }
  }, [searchQuery, apps]);

  const loadApps = async () => {
    try {
      const installedApps = await AppListModule.getInstalledApps();
      console.log('Loaded apps:', installedApps.length);
      console.log('First app icon length:', installedApps[0]?.icon?.length || 'no icon');
      
      const sortedApps = installedApps.sort((a, b) => a.name.localeCompare(b.name));
      setApps(sortedApps);
      setFilteredApps(sortedApps);
    } catch (error) {
      console.log('Error loading apps:', error);
      Alert.alert('Error', 'Failed to load apps');
    }
  };

  const launchApp = async (app: AppType) => {
    try {
      setDrawerVisible(false); // Close drawer when launching app
      await AppListModule.launchApp(app.packageName, app.className);
    } catch (error) {
      Alert.alert('Error', `Failed to launch ${app.name}`);
    }
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    setSearchQuery(''); // Reset search when opening
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <HomeScreen onSwipeUp={openDrawer} />
      
      <Modal
        visible={drawerVisible}
        animationType="slide"
        onRequestClose={closeDrawer}
        statusBarTranslucent={true}
      >
        <View style={[styles.modalContainer, { paddingTop: safeAreaInsets.top }]}>
          <AppDrawer
            apps={apps}
            filteredApps={filteredApps}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAppPress={launchApp}
            onClose={closeDrawer}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;
