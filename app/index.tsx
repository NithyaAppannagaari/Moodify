import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const router = useRouter();

export default function HomeScreen() {
  const navigate = () => {
    router.push({
      pathname: '/upload'
  });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <View style={styles.topTitleContainer}>
          <Text style={styles.topTitle}>Welcome</Text>
        </View>
        <View style={styles.bottomTitleContainer}>
          <Text style={styles.smallTitle}>to </Text>
          <Text style={styles.title}>Moodify</Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={() => navigate()}>
          <Text style={styles.buttonText}>Log in with Spotify</Text> // We'll add the log-in functionality next week!!
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    justifyContent: 'center',
  },
  topTitleContainer: {
    alignItems: 'flex-start',          
  },
  topTitle: {
    fontSize: 50,
    fontWeight: '500',
    color: '#000000',
    transform: [{ translateY:  15}],
  },
  smallTitle: {
    fontSize: 40,
    fontWeight: '500',
    color: '#000000',
    transform: [{ translateY:  16}],
  },
  bottomTitleContainer: {
    flexDirection: 'row',
    transform: [{ translateX: 18}]
  },
  title: {
    fontSize: 70,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#000000',
  },
  button: {
    backgroundColor: '#BDBDBD', 
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30, 
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'regular',
  },
  labelText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'regular',
  },
  
});