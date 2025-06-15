import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <View style={styles.topTitleContainer}>
          <Text style={styles.topTitle}>Welcome</Text>
        </View>
        <View style={styles.bottomTitleContainer}>
          <Text style={styles.smallTitle} >to </Text>
          <Text style={styles.title}>Moodify</Text>
        </View>
      </View>
      <Link href="/login" asChild>
        <Pressable style = {styles.button}>
          <Text style = {styles.buttonText}>Login with Spotify</Text>
        </Pressable>
      </Link>
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
