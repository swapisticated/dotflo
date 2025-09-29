import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { type App as AppType } from '../types/AppListModule';

const { height } = Dimensions.get('window');

interface AppDrawerProps {
  apps: AppType[];
  filteredApps: AppType[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAppPress: (app: AppType) => void;
  onClose: () => void;
}

export default function AppDrawer({
  apps,
  filteredApps,
  searchQuery,
  onSearchChange,
  onAppPress,
  onClose,
}: AppDrawerProps) {
  
  const renderApp = ({ item }: { item: AppType }) => (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() => onAppPress(item)}
    >
      <View style={styles.appRow}>
        {item.icon && item.icon.length > 0 ? (
          <Image
            source={{ uri: `data:image/png;base64,${item.icon}` }}
            style={styles.appIcon}
          />
        ) : (
          <View style={styles.appIconPlaceholder}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <Text style={styles.appName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Text style={styles.prompt}>$ </Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="search apps..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredApps}
        renderItem={renderApp}
        keyExtractor={(item) => item.packageName}
        style={styles.appList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    marginRight: 12,
    padding: 8,
  },
  closeText: {
    color: '#666',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prompt: {
    color: '#00ff00',
    fontSize: 16,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
    paddingVertical: 8,
  },
  appList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  appItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  appIconPlaceholder: {
    width: 24,
    height: 24,
    marginRight: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  appName: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'monospace',
    flex: 1,
  },
});