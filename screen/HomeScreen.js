import { useLayoutEffect, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native';
// firebase 

import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth';
// components
import CustomListItem from '../components/CustomListItem';
import { Avatar } from '@rneui/base';


const Home = ({ navigation }) => {
  const DEFAULT_IMAGE = 'https://i.pravatar.cc/150?img=64';

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
    return unsubscribe
  }, [])


  const signOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace('Login')
    })
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: 'black',
      headerLeft: () => <View style={{ marginRight: 20 }}>
        <TouchableOpacity>
          <Avatar rounded onPress={signOutUser} source={{ uri: auth?.currentUser?.photoURL || DEFAULT_IMAGE }} />
        </TouchableOpacity>
      </View>,
      headerRight: () => <View style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        width: 80,
        marginRight: 20
      }}>
        <TouchableOpacity activeOpacity={0.5}>
          <AntDesign name='camerao' size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('AddChat') }} activeOpacity={0.5}>
          <SimpleLineIcons name='pencil' size={24} color="black" />
        </TouchableOpacity>
      </View>
    })
  }, [navigation]);
  
  // open chat page
  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName
    })
  }

  return (
    <SafeAreaView>
      <StatusBar style='dark' />
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    height: "100%"
  }
})