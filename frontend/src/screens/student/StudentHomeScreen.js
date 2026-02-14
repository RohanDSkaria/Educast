import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import * as bountyService from '../../services/bounty';

const StudentHomeScreen = ({ navigation }) => {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const { messages } = useWebSocket();

  useEffect(() => {
    loadBounties();
  }, []);

  useEffect(() => {
    // Listen for new bids via WebSocket
    const bidMessages = messages.filter(m => m.type === 'bid_created');
    if (bidMessages.length > 0) {
      loadBounties(); // Refresh list
    }
  }, [messages]);

  const loadBounties = async () => {
    setLoading(true);
    try {
      const data = await bountyService.getBounties();
      setBounties(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bounties');
    } finally {
      setLoading(false);
    }
  };

  const renderBounty = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BountyDetail', { bountyId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.budget}>${item.budget}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#4CAF50';
      case 'IN_PROGRESS': return '#FF9800';
      case 'CLOSED': return '#9E9E9E';
      default: return '#000';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PostBounty')}
      >
        <Text style={styles.addButtonText}>+ Post New Bounty</Text>
      </TouchableOpacity>

      <FlatList
        data={bounties}
        renderItem={renderBounty}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadBounties}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bounties yet. Post your first bounty!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budget: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default StudentHomeScreen;
