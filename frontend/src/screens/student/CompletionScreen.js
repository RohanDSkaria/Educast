import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as bountyService from '../../services/bounty';

const CompletionScreen = ({ route, navigation }) => {
  const { bountyId } = route.params;
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await bountyService.completeBounty(bountyId, rating);
      Alert.alert('Success', 'Bounty completed and mentor rated!');
      navigation.navigate('StudentHome');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to complete bounty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Mentor</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Text style={styles.star}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Completing...' : 'Complete & Submit Rating'}
        </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  star: {
    fontSize: 50,
    marginHorizontal: 5,
    color: '#FFD700',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CompletionScreen;
