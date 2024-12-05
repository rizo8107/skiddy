import { pb } from './pocketbase';

export interface Settings {
  id?: string;
  privacy_policy?: string;
  privacy_policy_last_updated?: string;
}

class SettingsService {
  private collection = 'settings';

  async get(): Promise<Settings | null> {
    try {
      const records = await pb.collection(this.collection).getList(1, 1);
      return records.items[0] as Settings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  }

  async update(id: string, data: Partial<Settings>): Promise<Settings> {
    return await pb.collection(this.collection).update(id, data);
  }

  async create(data: Partial<Settings>): Promise<Settings> {
    return await pb.collection(this.collection).create(data);
  }
}

export const settingsService = new SettingsService();
