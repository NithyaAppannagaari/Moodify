import { HelloWave } from '@/components/HelloWave';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';


export default function Upload() {
  const router = useRouter();
  const { userName } = useLocalSearchParams();
  const { apiUrl } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
    });

    if(!result.canceled) {
        
        const imageUri = result.assets[0].uri;

        //const labels = await sendImageToModel(imageUri);

        //console.log("labels detected: ", labels);

        const tempLabels = ["plant", "person", "book"];
        setLoading(true);

        // have ollama choose songs
        const matchingSongs = await fetch('http://192.168.2.59:3000/chooseSongs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({labels: tempLabels}),
        });

        const songsResult = await matchingSongs.json();
        console.log(songsResult);

        // get the song urls
        const songUrls = await fetch('http://192.168.2.59:3000/chosenSongUrls', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        });

        const songUrlsResult = await songUrls.json();

        // make playlist from song urls
        const createdPlaylist = await fetch('http://192.168.2.59:3000/createPlaylist', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(songUrlsResult)
        });

        const createdPlaylistResult = await createdPlaylist.json();
        console.log(createdPlaylistResult);

        const createdPlaylistName = createdPlaylistResult.name;
        const createdPlaylistId = createdPlaylistResult.id;

        setLoading(false);

        router.push({
            pathname: '/page',
            params: { uri: imageUri, songs: songsResult, userName: userName, playlistName: createdPlaylistName, playlistId: createdPlaylistId },
        });
    }
  }

  return (
    <View style={styles.container}>
        <Text style = {styles.moodify}>
              Moodify
        </Text>
        <View style = {styles.centerView}>
            <Text style = {styles.centerText}>Hi <Text style = {styles.spotibopText}>@{userName}!</Text> <HelloWave/></Text>
                
            {loading ? (
            <>
              <Text style = {styles.labelText}>this might take a while...</Text>
              <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 20 }} />
            </>
            ) : (<Pressable style = {styles.button} onPress = {pickImage}>
                  <Text style = {styles.buttonText}>Upload Image</Text>
                </Pressable>
            )}
        </View>
      
    </View>
    
  );
}

const sendImageToModel = async (uri: string) => {
  const formData = new FormData();
  formData.append("file", {uri, name: "image.jpg", type: "image/jpeg"} as any);

  try {
    const response = await fetch("http://YOUR_IP:8000/detect", { // need to change this to proper ip address
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    const data = await response.json();
    return data.labels; //api returns { labels: [...] }
  } catch (err) {
    console.error("error sending image: ", err);
    return [];
  }
};

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20
  },
  moodify: {
    fontWeight: '800',
    fontStyle: 'italic',
    fontSize: 20,                  
    marginBottom: 20, 
    marginTop: 30
  },
  centerView: {
    width: '100%',   
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 26,
  },
  spotibopText: {
    fontWeight: '600',
    fontStyle: 'italic'
  },
  spotify: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  spotifyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
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
    fontSize: 18,
    paddingTop: 10,
    fontWeight: 'regular',
    textAlign: 'center'
  },
});
