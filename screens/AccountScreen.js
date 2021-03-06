import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { API, API_WHOAMI } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { lightModeAction, darkModeAction } from "../redux/ducks/accountPref";
import { logOutAction } from "../redux/ducks/blogAuth";
import { changeModeAction, deletePicAction } from "../redux/ducks/accountPref";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);

  const token = useSelector((state) => state.auth.token);

  const isDark = useSelector((state) => state.accountPrefs.isDark);

  const profilePicture = useSelector(
    (state) => state.accountPrefs.profilePicture
  );

  const picSize = new Animated.Value(100);

  const dispatch = useDispatch();

  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  async function getUsername() {
    console.log("---- Getting user name ----");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    dispatch(logOutAction());
    navigation.navigate("SignInSignUp");
  }

  function switchMode() {
    //dispatch(isDark ? lightModeAction() : darkModeAction());
    dispatch(changeModeAction());
  }

  function changePicSize() {
    //dispatch(isDark ? lightModeAction() : darkModeAction());
    Animated.loop(
      Animated.sequence([
        Animated.spring(picSize, {
          toValue: 200,
          duration: 2500,
          useNativeDriver: false
        }),
        Animated.timing(picSize, {
          toValue: 200,
          duration: 2500,
          useNativeDriver: false
        })
    ]) 
    ).start()
    
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, styles.text, { margin: 30 }]}>
        {" "}
        Hello {username} !
      </Text>
      
      {/* <Animated.Image
        source={{ uri: profilePicture }}
        style={{ width: 250, height: 250, borderRadius: 200 }}
      /> */}

      {profilePicture == null? <View/> :
        <TouchableWithoutFeedback onPress={changePicSize}>
          <Animated.Image style={{ width: picSize, height: picSize, borderRadius: 200 }}
                          source={{ uri: profilePicture }} />
        </TouchableWithoutFeedback>
      }
      <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
        <Text style={{ marginTop: 10, fontSize: 20, color: "#0000EE" }}>
          {profilePicture
          ? "Delete this photo. Take another one."
          : "No profile picture. Click to take one."} 
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={[styles.content, styles.text]}> Dark Mode? </Text>
        <Switch value={isDark} onChange={switchMode} />
      </View>
      <TouchableOpacity style={[styles.button]} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}