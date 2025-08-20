import { HelloWave } from '@/components/HelloWave';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/** TODO: This page is incomplete. Fill it out so it works as expected! */
export default function Upload() {
  const router = useRouter();
  const { userName } = useLocalSearchParams(); // This is how we can receive data from other pages
 
  const pickImage = async () => {
    /**
     * Add in the image upload functionality
     */
    let result = await ImagePicker.launchImageLibraryAsync({
      /**
       * Fill this in! (After routing -- we'll focus on setting up routing first!)
       */
    }); 

    if(!result.canceled) {
        const imageUri = "exampleUri"; /** Fill this in! */

        /**
         * Replace this comment with the logic to navigate to "page.tsx". 
         * We want to send "page.tsx" the imageUri and the userName.
         * Take a look at "page.tsx" to see what they're naming their search parameters.
         * 
         * Hint: Use "index.tsx" as a reference for how to navigate between pages.
         */
    }
  }

  return (
    <View style={styles.container}>
        <Text style = {styles.moodify}>
              Moodify
        </Text>
        <View style = {styles.centerView}>
            <Text style = {styles.centerText}>Hi <Text style = {styles.spotibopText}>@{userName}!</Text> <HelloWave/></Text>
            
            <Pressable style = {styles.button} onPress = {pickImage}>
              <Text style = {styles.buttonText}>Upload Image</Text>
            </Pressable>
        </View>
    </View>
    
  );
}

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
