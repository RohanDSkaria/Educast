import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { WebSocketProvider } from './src/context/WebSocketContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </WebSocketProvider>
    </AuthProvider>
  );
}
