import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { useDispatch } from "react-redux";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import { logInAction } from "../redux/ducks/blogAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android


export default function SignInSignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [isLogIn, setIsLogIn] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();

    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      console.log(response.data.access_token);
      dispatch({ ...logInAction(), payload: response.data.access_token });
      setLoading(false);
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.data.description);
    }
  }

  async function signUp() {
    if (password != confirmPassword) {
      setErrorText("Your passwords don't match. Check and try again.");
    } else {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
        });
        if (response.data.Error) {
          // We have an error message for if the user already exists
          setErrorText(response.data.Error);
          setLoading(false);
        } else {
          console.log("Success signing up!");
          setLoading(false);
          login();
        }
      } catch (error) {
        setLoading(false);
        console.log("Error logging in!");
        console.log(error.response);
        setErrorText(error.response.data.description);
      }
    }
  }

  return (
    
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
       
       <Image
        style={styles.logo}
        source={{
          uri: 'https://i.ibb.co/B4Xp8zb/rm381-17a.png',
        }}
      />
      <Text style={styles.title}>{isLogIn ? "Log In" : "Sign Up"}</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>

      {isLogIn ? (
        <View />
      ) : (
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password:"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(pw) => setConfirmPassword(pw)}
          />
        </View>
      )}

      <View />
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={isLogIn ? login : signUp}
          >
            <Text style={styles.buttonText}>
              {" "}
              {isLogIn ? "Log In" : "Sign Up"}{" "}
            </Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 10 }} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <Text style={styles.errorText}>{errorText}</Text>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 200,
            create: { type: "linear", property: "opacity" },
            update: { type: "spring", springDamping: 0.6 },
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}
      >
        <Text style={styles.switchText}>
          {" "}
          {isLogIn
            ? "No account? Sign up now."
            : "Already have an account? Log in here."}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5DAD0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "normal",
    fontSize: 30,
    margin: 20,
    color: "#3F5362",
  },
  switchText: {
    fontWeight: "400",
    fontSize: 20,
    marginTop: 20,
    color: "#3F5362",
  },
  inputView: {
    backgroundColor: "#e5e5e5",
    borderColor: "#D6C6B8",
    borderWidth: 1,
    borderRadius: 2,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#3F5362",
    borderRadius: 2,
    width: 150,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "400",
    fontSize: 20,
    margin: 15,
    color: "white",
  },
  errorText: {
    fontSize: 15,
    color: "tomato",
    marginTop: 20,
  },
  logo: {
    justifyContent: "center",
    width: 200,
    height: 200,
  },
});