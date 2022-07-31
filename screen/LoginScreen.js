import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Input, Button, Image } from '@rneui/themed';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('Home')
            }
        })
        return () => unsubscribe();
    }, [])

    const signin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert(error))
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Image source={{
                uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png'
            }}
                style={{ width: 200, height: 200 }}
            />
            <View style={styles.inputContainer}>
                <Input
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChangeText={(email) => setEmail(email)} />
                <Input
                    placeholder='Password'
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(password) => setPassword(password)} />
            </View>
            <View>
                <Button containerStyle={styles.button} title="Login" onPress={signin} />
                <Button
                    containerStyle={styles.button}
                    type="outline"
                    title="Register"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        padding: 10
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginTop: 10
    }
})
export default LoginScreen