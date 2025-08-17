import { Link, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { userName } = useLocalSearchParams();
  const { songs } = useLocalSearchParams();

  if (!uri) {
    return <Text>No image selected.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.generateNewContainer}>
        <Text style={styles.subtitle}>@{userName}'s page</Text>
          <Link 
            href={{ 
              pathname: '/upload',
              params: {userName: userName}
            }} 
            asChild >
            <TouchableOpacity style={styles.newButton}>
              <Text style={styles.buttonText}>new image</Text>
            </TouchableOpacity>
          </Link>
          {/* <Link 
            href={{ pathname: '/'}} 
            asChild >
            <TouchableOpacity style={styles.newButton}>
              <Text style={styles.buttonText}>new song list</Text>
            </TouchableOpacity>
          </Link> */}
      </View>
      <View>
        <Image
            source={{uri}}
            style={styles.image}
        />
      </View>

      <View>
        <Image
            source={require('../assets/images/song 1.png')}
            style={styles.music}
        />
      </View>

      <View style={styles.finishContainer}>
        <Link 
            href={{ pathname: '/final', params: {userName: userName, songList: songs}}} 
            asChild >
            <TouchableOpacity style={styles.newButton}>
              <Text style={styles.buttonText}>generate my playlist →</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:80,
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
    //marginBottom: 5,
    marginLeft: 15,
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  generateNewContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  finishContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
    marginRight: 45,
  },
  newButton: {
    alignItems: 'center',
    margin: 12,
    marginHorizontal: -10,
    marginLeft: 15,
    //borderColor: 'gray',
    //borderWidth: 1,
    borderRadius: 20,
    padding: 6,
    paddingHorizontal: 12,
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  image: {
    justifyContent: 'center',
    //marginLeft: 15,
    width: 320, 
    height: 400,
  },
  music: {
    justifyContent: 'center',
    marginTop: 15,
    width: 320, 
    height: 108,
  }
});
