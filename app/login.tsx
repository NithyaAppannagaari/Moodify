import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style = {[styles.spotify, { width: width * 0.9, height: height * 0.5 }]}>
        <Text style = {styles.spotifyText}>Spotify Embed Placeholder</Text>
      </View>
      <Link href="/upload" asChild>
        <Pressable style = {styles.button}>
          <Text style = {styles.buttonText}>Continue</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotify: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spotifyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'regular',
  },
  button: {
    backgroundColor: '#1ED760', 
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30, 
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '800',
  },
});
