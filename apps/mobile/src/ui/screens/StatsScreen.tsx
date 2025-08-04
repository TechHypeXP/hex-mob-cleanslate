import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container} testID="stats-screen">
      <View style={styles.content}>
        <Text style={styles.title}>Stats Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
});
