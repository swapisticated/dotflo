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
import AppListModule, { App as AppType } from './src/types/AppListModule';
import HomeScreen from './src/components/HomeScreen';
import AppDrawer from './src/components/AppDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


  const FAVORITES_KEY = 'FAVORITE_APPS';


  useEffect(() => {
    loadApps();
    loadFavorites();
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

  useEffect(() => {
    saveFavorites(favoriteApps);
  }, [favoriteApps]);

  
  const saveFavorites = async (favorites: AppType[]) => {
    try {
      const jsonValue = JSON.stringify(favorites);
      await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };


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

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
      if (jsonValue != null) {
        const savedFavorites: AppType[] = JSON.parse(jsonValue);
        setFavoriteApps(savedFavorites);
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };



  const isFavApp = (app: AppType) => {
    //check if app with package name already in favourate apps array
    //if yes -> return true, if no, return false
    // Use array.some() to check if any favorite matches the package name, returns true if found, flase if not
    return favoriteApps.some(favApp => favApp.packageName === app.packageName)
  }

  const addToFavorites = (app: AppType) => {
    //check if fav array length is >= 5 
    //if yes, max 5 fav
    //check if already in fav, isFavApp(package_name), if yes -> alert
    //add package name to favourate Apps array
    //save to phone storage to persist
    //render ui

    if (favoriteApps.length >= 5) {
      Alert.alert("MAX!")
      return;
    }
    if (isFavApp(app)) {
      Alert.alert('Its already there bro')
      return;
    }

    setFavoriteApps([...favoriteApps, app]);
  }


  const removeFromFavourite = (app: AppType) => {
    // Filter creates new array without the removed app
    const updatedFavorites = favoriteApps.filter(
      favApp => favApp.packageName !== app.packageName
    );

    setFavoriteApps(updatedFavorites);

    // TODO: Save to storage
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <HomeScreen
        onSwipeUp={openDrawer}
        favoriteApps={favoriteApps}
        onAppPress={launchApp}
      />

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
            onAddToFavorites={addToFavorites}
            onRemoveFromFavorites={removeFromFavourite}
            isFavorite={isFavApp}


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
