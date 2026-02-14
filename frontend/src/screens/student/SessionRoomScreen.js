import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SessionRoomScreen = ({ route, navigation }) => {
  const { roomId, bountyId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Session Room</Text>
        <Text style={styles.roomId}>Room ID: {roomId}</Text>
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
        onPress={() => navigation.goBack()}
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
