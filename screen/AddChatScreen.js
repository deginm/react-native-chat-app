import { Button, Input } from '@rneui/themed';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// firebase
import { db } from '../firebase';


const AddChatScreen = ({ navigation }) => {
    const [chatName, setChatName] = useState('');
    const [isDisaled, setisDisabled] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add new chat",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const handleTextChange = (text) => {
        setChatName(text)
        if (text === '' || text.length < 4) {
            setisDisabled(true)
        } else { 
            setisDisabled(false)
        }
    }

    const createChat = async () => {
        await db.collection('chats').add({
            chatName: chatName
        }).then(() => {
            navigation.goBack()
        }).catch((error) => {
            alert(error.message)
        })
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder="Enter a chat name"
                value={chatName}
                onChangeText={handleTextChange}
                leftIcon={
                    <Icon name='wechat' type="antdesign" size={24} color="black" />
                }
                onSubmitEditing={createChat}
            />
            <Button disabled={isDisaled} onPress={createChat} title="Create new chat" />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10
    }
})