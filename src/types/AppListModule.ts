import { NativeModules } from 'react-native';

export interface App {
  name: string;
  packageName: string;
  className: string;
  icon: string;
}

interface AppListModuleInterface {
  getInstalledApps(): Promise<App[]>;
  launchApp(packageName: string, className: string): Promise<boolean>;
}

const { AppListModule } = NativeModules;

export default AppListModule as AppListModuleInterface;