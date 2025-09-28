import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, Linking } from "react-native";
import { Audio } from "expo-av";

interface PlaylistPlayerProps {
  playlistId: string;
  apiURL: string;
}

export default function PlaylistPlayer({ playlistId, apiURL }: PlaylistPlayerProps) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Fetch playlist tracks
  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch(`${apiURL}:3000/getPlaylistTracks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ PLAYLIST_ID: playlistId }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Server error:", text);
          return;
        }

        const data = await response.json();
        const items = data.items.map((item: any) => item.track);
        setTracks(items);
      } catch (err) {
        console.error("Failed to fetch playlist tracks:", err);
      }
    }

    fetchTracks();
  }, [playlistId, apiURL]);

  // Play a track preview
  async function playPreview(url: string) {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    setSound(newSound);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎵 Playlist Preview</Text>
      {tracks.map((track, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.button, !track.preview_url && styles.disabledButton]}
          onPress={() => {
            if (track.preview_url) {
              playPreview(track.preview_url);
            } else if (track.external_urls?.spotify) {
              Linking.openURL(track.external_urls.spotify);
            }
          }}
          disabled={!track.preview_url && !track.external_urls?.spotify}
        >
          <Text style={styles.buttonText}>
            {track.name} — {track.artists[0].name}
            {!track.preview_url ? ' (open in Spotify)' : ''}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#1DB954",
  },
  disabledButton: {
    backgroundColor: "#888", // gray for tracks without preview
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
