import PocketBase, { Record, ClientResponseError } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PocketBaseClient extends PocketBase {
    constructor(url: string) {
        super(url);
        
        // Load auth store data from AsyncStorage
        this.autoCancellation(false);
        this.loadAuthFromStorage();
    }

    private async loadAuthFromStorage() {
        try {
            const authData = await AsyncStorage.getItem('pb_auth');
            if (authData) {
                const { token, model } = JSON.parse(authData);
                this.authStore.save(token, model);
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        }
    }

    private async saveAuthToStorage() {
        try {
            const data = {
                token: this.authStore.token,
                model: this.authStore.model
            };
            await AsyncStorage.setItem('pb_auth', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving auth data:', error);
        }
    }

    // Override authStore.save to persist data to AsyncStorage
    authStore = {
        ...this.authStore,
        save: (token: string, model: Record) => {
            this.authStore.save(token, model);
            this.saveAuthToStorage();
        },
        clear: () => {
            this.authStore.clear();
            AsyncStorage.removeItem('pb_auth');
        }
    };
}

export const pb = new PocketBaseClient('https://skiddy-pocketbase.9dto0s.easypanel.host');

// Collection Types
export interface User extends Record {
    name: string;
    username: string;
    avatar?: string;
    role: 'student' | 'instructor' | 'admin';
    email?: string;
}

export interface Course extends Record {
    course_title: string;
    description: string;
    thumbnail?: string;
    instructor: string;
    duration?: string;
    level?: string;
    prerequisites?: string[];
    skills?: string[];
    expand?: {
        instructor?: User;
    };
}

// Auth functions
export const login = async (email: string, password: string) => {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        // Wait for auth store to be updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!pb.authStore.isValid) {
            throw new Error('Authentication failed');
        }
        
        return authData;
    } catch (error) {
        console.error('Error logging in:', error);
        throw handlePocketbaseError(error);
    }
};

export const logout = () => {
    pb.authStore.clear();
};

export const isAuthenticated = () => {
    return pb.authStore.isValid;
};

export const getCurrentUser = (): User | null => {
    return pb.authStore.model as User | null;
};

// Error handling
const handlePocketbaseError = (error: unknown): Error => {
    if (error instanceof ClientResponseError) {
        return new Error(error.message);
    }
    if (error instanceof Error) {
        return error;
    }
    return new Error('An unknown error occurred');
};

// Course services
export const courseService = {
    async getAll(): Promise<Course[]> {
        try {
            const response = await pb.collection('courses').getList(1, 50, {
                sort: '-created',
                expand: 'instructor',
            });
            return response.items as Course[];
        } catch (error) {
            throw handlePocketbaseError(error);
        }
    },

    async getOne(id: string): Promise<Course | null> {
        try {
            const record = await pb.collection('courses').getOne(id, {
                expand: 'instructor',
            });
            return record as Course;
        } catch (error) {
            if (error instanceof ClientResponseError && error.status === 404) {
                return null;
            }
            throw handlePocketbaseError(error);
        }
    },
};
