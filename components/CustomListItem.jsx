import { View, Text, StyleSheet } from 'react-native'
import { ListItem, Avatar } from '@rneui/themed'
import { useEffect, useState } from 'react'
import { db } from '../firebase'


const CustomListItem = ({ id, chatName, enterChat }) => {
    const DEFAULT_IMAGE = 'https://i.pravatar.cc/300'
    const [chatMessage, setChatMessage] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection("chats")
            .doc(id).collection("messages")
            .orderBy("timestamp", 'desc').onSnapshot((snapshot) => setChatMessage(
                snapshot.docs.map(doc => ({ data: doc.data() }))
            ));
        return unsubscribe
    })

    return (
        <ListItem key={id} bottomDivider onPress={() => { enterChat(id, chatName) }}>
            <Avatar
                rounded
                source={{
                    uri: chatMessage?.[0]?.data.photoURL || DEFAULT_IMAGE
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: '800' }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMessage?.[0]?.data.displayName || <Text style={{color:"red"}}>No Message</Text>} : {chatMessage?.[0]?.data.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem;

const style = StyleSheet.create({})