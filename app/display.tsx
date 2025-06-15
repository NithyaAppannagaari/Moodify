import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function Display() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  if (!uri) {
    return <Text>No image selected.</Text>;
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Image source={{ uri }} style={{ width: 300, height: 300 }} />
    </View>
  );
}
