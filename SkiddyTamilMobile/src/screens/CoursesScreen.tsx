import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { courseService, Course } from '../lib/pocketbase';

type CoursesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Courses'>;

export function CoursesScreen() {
  const navigation = useNavigation<CoursesScreenNavigationProp>();
  const theme = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderCourseCard = ({ item }: { item: Course }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
    >
      {item.thumbnail && (
        <Card.Cover source={{ uri: item.thumbnail }} />
      )}
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.courseTitle}>
          {item.course_title}
        </Text>
        <Text variant="bodyMedium" style={styles.courseDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.courseInfo}>
          {item.duration && (
            <Text variant="bodySmall" style={styles.courseMetadata}>
              Duration: {item.duration}
            </Text>
          )}
          {item.level && (
            <Text variant="bodySmall" style={styles.courseMetadata}>
              Level: {item.level}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      
      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No courses available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f2e',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#2a2f3e',
  },
  cardContent: {
    padding: 16,
  },
  courseTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  courseDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseMetadata: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 32,
  },
});
