import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// DEFINE CLIENT-SIDE CONSTANTS APPLICABLE TO ENTIRE APP
const API_URL = 'http://192.168.2.59'; // this is your computer's IP address (the localhost of the server)
const CLIENT_ID = '2e327947bec246929a9c902ab76e5172';
const REDIRECT_URI = AuthSession.makeRedirectUri();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token', // not used directly
};
const router = useRouter();

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['ugc-image-upload','app-remote-control', 'user-modify-playback-state','user-read-email', 'user-read-private', 'user-top-read', 'user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'],
      redirectUri: REDIRECT_URI,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code, request?.codeVerifier!);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
    setLoading(true);

    try {  
      const res = await fetch(`${API_URL}:3000/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: codeVerifier }),
      });

      const userData = await res.json();

      router.navigate({
        pathname: '/upload',
        params: { userName: userData["display_name"], apiURL: API_URL},
      });
    } finally {
      setLoading(false);
    }

  };

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

      {loading ? (
        <>
          <Text style={styles.labelText}>
            loading...
          </Text>
          <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 20 }} />
        </>
      ) : (
        <Pressable style={styles.button} onPress={() => promptAsync()}>
          <Text style={styles.buttonText}>Log in with Spotify</Text>
        </Pressable>
      )}
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