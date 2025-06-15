import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Moodify</Text>
      <View style={styles.loginContainer}>
          <Link 
            href={{ pathname: '/(tabs)/login'}} 
            asChild >
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginLabel}>Log in with Spotify</Text>
            </TouchableOpacity>
          </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  loginButton: {
    alignItems: 'center',
    margin: 12,
  },
  loginLabel: {
    fontSize: 16,
    color: '#444',
  },
});
