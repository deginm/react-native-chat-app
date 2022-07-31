import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Input, Button, Image, Text } from '@rneui/themed';
import { useState, useLayoutEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {
    const DEFAULT_IMAGE = 'https://i.pravatar.cc/300'
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setimageUrl] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "back"
        })
    }, [navigation])

    const registerUser = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: fullname,
                    photoURL: imageUrl || DEFAULT_IMAGE
                })
            }).catch((error) => {
                alert(error.message)
            })
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <Text h3 style={{ marginBottom: 50 }}>
                Create An Account
            </Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="full name"
                    autoFocus type='text'
                    onChangeText={(text) => setFullName(text)}
                    value={fullname}
                />
                <Input placeholder="Email"
                    type='email'
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <Input placeholder="Password"
                    type='password'
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Input placeholder="Profile Picture URL (option)"
                    type='text'
                    onChangeText={(text) => setimageUrl(text)}
                    value={imageUrl}
                    onEndEditing={registerUser}
                />
            </View>
            <Button onPress={registerUser} title="Register" />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginTop: 10
    }
})