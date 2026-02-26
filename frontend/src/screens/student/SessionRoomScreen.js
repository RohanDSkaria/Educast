import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { showAlert } from '../../utils/alert';

const SessionRoomScreen = ({ route, navigation }) => {
  const { roomId, bountyId } = route.params;
  const { user } = useAuth();

  const handleLeaveRoom = () => {
    showAlert(
      'Leave Session',
      'Are you sure you want to leave the session room?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          onPress: () => {
            showAlert('Session Ended', 'You have left the session room');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'User'}</Text>
        </View>
        
        <Text style={styles.title}>Session Room</Text>
        <Text style={styles.roomId}>Room ID: {roomId}</Text>
        
        <View style={styles.participantSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <Text style={styles.participantText}>• You ({user?.role})</Text>
          <Text style={styles.participantText}>
            • {user?.role === 'Student' ? 'Mentor' : 'Student'}
          </Text>
        </View>
        
        <Text style={styles.info}>
          This is a placeholder for the session room. In a full implementation, 
          this would integrate with WebRTC (Agora/Twilio) for video calling.
        </Text>
        <Text style={styles.info}>
          For now, you can use this room ID to communicate via external means.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLeaveRoom}
      >
        <Text style={styles.buttonText}>Leave Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  roomId: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  participantSection: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SessionRoomScreen;
