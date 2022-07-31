import {
    StyleSheet, Text, View, TouchableOpacity,
    SafeAreaView, KeyboardAvoidingView,
    ScrollView, TextInput, Platform, Keyboard, TouchableWithoutFeedback
} from 'react-native'
import { useLayoutEffect, useState } from 'react'
import { Avatar } from '@rneui/base'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import firebase from "firebase/compat";
import { db, auth } from '../firebase';

const ChatScreen = ({ navigation, route }) => {
    const DEFAULT_IMAGE = 'https://i.pravatar.cc/100'
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: 'black',
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View
                    style={styles.headerTitleContainer}
                >
                    <Avatar rounded source={{ uri: messages[0]?.data.photoURL || DEFAULT_IMAGE }} />
                    <Text style={styles.headerTitleText}>{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={styles.headerRightContainer}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <FontAwesome5 name='video' size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <FontAwesome5 name='phone' size={20} color="black" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation , messages])

    useLayoutEffect(() => {
        const unsubscribe = db.collection("chats")
            .doc(route.params.id).collection("messages")
            .orderBy("timestamp", "asc").onSnapshot((snapshot) => setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            ));
        return unsubscribe
    }, [route])

    // send message
    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id)
            .collection('messages').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: messageInput,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            })
        setMessageInput('')
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                            {messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                            size={30}
                                            rounded
                                            source={{
                                                uri: data.photoURL
                                            }} />
                                        <Text style={styles.recieverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                            size={30}
                                            rounded
                                            source={{
                                                uri: data.photoURL
                                            }} />

                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                placeholder='Type Here'
                                style={styles.textinput}
                                value={messageInput}
                                onChangeText={text => setMessageInput(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#2b68e6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitleText: {
        marginLeft: 10,
        fontWeight: "800",
        fontSize: 18
    },
    headerRightContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 70,
        marginRight: 20
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    textinput: {
        bottom: 0,
        height: 40,
        flex: 1,
        borderColor: "transparent",
        borderWidth: 1,
        padding: 10,
        color: "gray",
        backgroundColor: "#ECECEC",
        borderRadius: 30
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    },
    recieverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "white"
    },
    reciever: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    }
})