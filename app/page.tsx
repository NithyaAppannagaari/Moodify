import { Link, useLocalSearchParams } from 'expo-router';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PlaylistPlayer from './songs';

export default function Page() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { userName } = useLocalSearchParams();
  const { playlistUrl } = useLocalSearchParams();
  const { playlistId } = useLocalSearchParams();
  const { apiURL } = useLocalSearchParams();

  const playlistIdStr = Array.isArray(playlistId) ? playlistId[0] : playlistId || "";
  const apiURLStr = Array.isArray(apiURL) ? apiURL[0] : apiURL || "";

  if (!uri) {
    return <Text>No image selected.</Text>;
  }

  const openSpotifyPlaylist = () => {
    if (playlistUrl) {
      const urlStr = Array.isArray(playlistUrl) ? playlistUrl[0] : playlistUrl;
      Linking.openURL(urlStr);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top: username + new image button */}
        <View style={styles.generateNewContainer}>
          <Text style={styles.subtitle}>@{userName}'s page</Text>
          <Link 
            href={{ pathname: '/upload', params: { userName, apiURL } }} 
            asChild
          >
            <TouchableOpacity style={styles.newButton}>
              <Text style={styles.buttonText}>new image</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
        </View>

        {/* Playlist */}
        <View style={styles.playlistContainer}>
          <PlaylistPlayer playlistId={playlistIdStr} apiURL={apiURLStr} />
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.finishContainer}>
        <TouchableOpacity style={styles.newButton} onPress={openSpotifyPlaylist}>
          <Text style={styles.buttonText}>view my playlist →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  generateNewContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  newButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 400,
    borderRadius: 12,
  },
  playlistContainer: {
    width: '100%',
    flexGrow: 1,
  },
  finishContainer: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
