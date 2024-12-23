import { pb } from './pocketbase';

export const SUPER_ADMIN_EMAIL = 'nirmal@lifedemy.in';

export const adminService = {
  /**
   * Login as super admin
   */
  async loginAsSuperAdmin(password: string = 'Life@123') {
    try {
      const authData = await pb.admins.authWithPassword(
        SUPER_ADMIN_EMAIL,
        password
      );
      return authData;
    } catch (error: any) {
      console.error('Super admin login error:', error);
      throw error;
    }
  },

  /**
   * Check if the current user is a super admin
   */
  isSuperAdmin() {
    const user = pb.authStore.model;
    return user?.email === SUPER_ADMIN_EMAIL;
  },

  /**
   * Create a new admin user
   */
  async createAdmin(email: string, password: string) {
    try {
      const admin = await pb.admins.create({
        email,
        password,
        passwordConfirm: password,
      });
      return admin;
    } catch (error: any) {
      console.error('Create admin error:', error);
      throw error;
    }
  },

  /**
   * Update admin settings
   */
  async updateSettings(settings: any) {
    try {
      const updated = await pb.settings.update(settings);
      return updated;
    } catch (error: any) {
      console.error('Update settings error:', error);
      throw error;
    }
  },

  /**
   * Get current admin settings
   */
  async getSettings() {
    try {
      const settings = await pb.settings.getAll();
      return settings;
    } catch (error: any) {
      console.error('Get settings error:', error);
      throw error;
    }
  },
};
