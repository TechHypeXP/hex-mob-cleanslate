/**
 * StatsScreen.tsx - Statistics dashboard component
 * 
 * Displays storage analytics, usage metrics, and performance insights.
 * Visualizes user progress in photo management.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Mock data - would be replaced with real data from a service
const stats = {
  storage: {
    total: '128 GB',
    used: '89.2 GB',
    photos: '45.6 GB',
    available: '38.8 GB',
    percentage: 70,
  },
  photos: {
    total: 12847,
    cleaned: 3421,
    deleted: 1205,
    shared: 892,
    private: 324,
  },
  usage: {
    sessionsThisWeek: 12,
    lastSession: '2 hours ago',
    avgSessionTime: '8 min',
    totalTimeSaved: '4.2 hours',
  },
};

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  delay?: number;
}

const StatsScreen: React.FC = () => {
  // Animation progress value for progress bar
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    // Animate progress bar when component mounts
    setTimeout(() => {
      progressWidth.value = withTiming(stats.storage.percentage / 100, { duration: 1000 });
    }, 500);
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
    };
  });

  const StatCard: React.FC<StatCardProps> = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color = 'blue',
    delay = 0 
  }) => (
    <Animated.View
      style={[styles.card, styles.statCard]}
      entering={FadeInDown.delay(delay).springify()}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColorLight(color) }]}>
        <Ionicons name={icon as any} size={24} color={getColor(color)} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Animated.View>
  );

  // Helper function to get color based on name
  const getColor = (name: string) => {
    switch (name) {
      case 'red': return '#FF3B30';
      case 'green': return '#34C759';
      case 'blue': return '#007AFF';
      case 'purple': return '#AF52DE';
      case 'pink': return '#FF2D55';
      case 'orange': return '#FF9500';
      default: return '#007AFF';
    }
  };

  // Helper function to get light color based on name
  const getColorLight = (name: string) => {
    switch (name) {
      case 'red': return '#FFECEB';
      case 'green': return '#E3F7EA';
      case 'blue': return '#E1F0FF';
      case 'purple': return '#F5E9FF';
      case 'pink': return '#FFE9ED';
      case 'orange': return '#FFF2E3';
      default: return '#E1F0FF';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your photo management insights</Text>
      </View>

      {/* Storage Overview */}
      <Animated.View 
        style={styles.card}
        entering={FadeInDown.delay(100).springify()}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="hardware-chip-outline" size={24} color="#007AFF" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Storage Usage</Text>
            <Text style={styles.sectionSubtitle}>
              {stats.storage.used} of {stats.storage.total} used
            </Text>
          </View>
          <Text style={styles.percentage}>{stats.storage.percentage}%</Text>
        </View>

        <View style={styles.progressContainer}>
          <Animated.View 
            style={[styles.progressBar, progressStyle]} 
          />
        </View>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Photos</Text>
            <Text style={styles.statValue}>{stats.storage.photos}</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={[styles.statValue, styles.available]}>
              {stats.storage.available}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Photo Management Stats */}
      <Text style={styles.sectionHeading}>Photo Management</Text>
      <View style={styles.statCardGrid}>
        <StatCard
          icon="images-outline"
          title="Total Photos"
          value={stats.photos.total.toLocaleString()}
          color="blue"
          delay={200}
        />
        <StatCard
          icon="flash-outline"
          title="Photos Cleaned"
          value={stats.photos.cleaned.toLocaleString()}
          color="green"
          delay={250}
        />
        <StatCard
          icon="trash-outline"
          title="Photos Deleted"
          value={stats.photos.deleted.toLocaleString()}
          color="red"
          delay={300}
        />
        <StatCard
          icon="heart-outline"
          title="Photos Kept"
          value={(stats.photos.cleaned - stats.photos.deleted).toLocaleString()}
          color="pink"
          delay={350}
        />
      </View>

      {/* Actions Taken */}
      <Text style={styles.sectionHeading}>Actions Taken</Text>
      <Animated.View 
        style={styles.card}
        entering={FadeInDown.delay(400).springify()}
      >
        <View style={styles.actionRow}>
          <View style={styles.actionLabel}>
            <Ionicons name="share-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Shared</Text>
          </View>
          <Text style={styles.actionValue}>{stats.photos.shared}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.actionRow}>
          <View style={styles.actionLabel}>
            <Ionicons name="lock-closed-outline" size={20} color="#AF52DE" />
            <Text style={styles.actionText}>Made Private</Text>
          </View>
          <Text style={styles.actionValue}>{stats.photos.private}</Text>
        </View>
      </Animated.View>

      {/* App Usage */}
      <Text style={styles.sectionHeading}>App Usage</Text>
      <View style={styles.statCardGrid}>
        <StatCard
          icon="trending-up"
          title="Sessions This Week"
          value={stats.usage.sessionsThisWeek}
          subtitle="Keep up the great work!"
          color="green"
          delay={450}
        />
        <StatCard
          icon="time-outline"
          title="Time Saved"
          value={stats.usage.totalTimeSaved}
          subtitle="By using CleanSlate efficiently"
          color="blue"
          delay={500}
        />
      </View>

      <Animated.View 
        style={styles.card}
        entering={FadeInDown.delay(550).springify()}
      >
        <View style={styles.usageStatsRow}>
          <View style={styles.usageStat}>
            <Text style={styles.usageLabel}>Last Session</Text>
            <Text style={styles.usageValue}>{stats.usage.lastSession}</Text>
          </View>
          <View style={styles.usageStat}>
            <Text style={styles.usageLabel}>Avg. Session</Text>
            <Text style={styles.usageValue}>{stats.usage.avgSessionTime}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Spacer for bottom tab navigation */}
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e1f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  percentage: {
    marginLeft: 'auto',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e5e5ea',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  available: {
    color: '#34C759',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 12,
    marginTop: 8,
  },
  statCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 40) / 2,
    marginBottom: 8,
    padding: 16,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#1c1c1e',
    marginLeft: 8,
  },
  actionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5ea',
  },
  usageStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  spacer: {
    height: 84, // Height of the tab bar
  },
});

export default StatsScreen;