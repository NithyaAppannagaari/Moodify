import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/** Here, we want to integrate with Spotify API to log in and get credentials to be able to make query searches */
const API_URL = 'http://192.168.2.59:3000'; // this is your computer's IP address (the localhost of the server)
const CLIENT_ID = '2e327947bec246929a9c902ab76e5172';
const REDIRECT_URI = AuthSession.makeRedirectUri();
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token', // not used directly
};
const router = useRouter();

const loadingMessages = [
  "loading...",
  "finding the best playlists...",
  "getting your fav songs...",
  "almost there...",
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateMessage = () => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Wait and fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        });
      }, 18000); // 18 visible, 1s fade in, 1s fade out = 20s
    });
  };

  useEffect(() => {
    if (loading) {
      animateMessage();
      const interval = setInterval(() => {
        animateMessage();
      }, 20000); // Change message every 20 seconds

      return () => clearInterval(interval);
    }
  }, [loading]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['user-read-email', 'user-read-private', 'user-top-read', 'user-library-read', 'playlist-read-private', 'playlist-read-collaborative'],
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
      const res = await fetch(`${API_URL}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: codeVerifier }),
      });

      const userData = await res.json();

      router.navigate({
        pathname: '/upload',
        params: { userName: userData["display_name"]},
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
          <Animated.Text
            style={styles.smallTitle}
          >
            {loadingMessages[messageIndex]}
          </Animated.Text>
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
  
});