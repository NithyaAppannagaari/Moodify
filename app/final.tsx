import { Link, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Final() {
  const { userName } = useLocalSearchParams();
  const { songList } = useLocalSearchParams();

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Thanks @{userName}!</Text>
      <Text style={styles.text}>Check out your curated playlist below:</Text>
      <View>
        <Image
            source={require('../assets/images/explaylist.png')}
            style={styles.playlist}
        />
      </View>

      <View style={styles.refreshContainer}>
        <Link 
            href={{ pathname: '/upload', params: {userName: userName}}} 
            asChild >
            <TouchableOpacity style={styles.newButton}>
              <Text style={styles.buttonText}>upload new image!</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    paddingBottom: 600,
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
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  generateNewContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  refreshContainer: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  newButton: {
    alignItems: 'center',
    margin: 15,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  playlist: {
    justifyContent: 'center',
    width: 320, 
    height: 415,
  },
  music: {
    justifyContent: 'center',
    marginTop: 15,
    width: 320, 
    height: 108,
  }
});
