import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { API, API_POSTS } from "../constants/API";
import { darkStyles, lightStyles } from "../styles/commonStyles";

export default function IndexScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome
            name="plus"
            size={20}
            style={[styles.icon, { marginRight: 25 }]}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

  async function getPosts() {
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPosts(response.data);
      return "completed";
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }

  function addPost() {
    navigation.navigate("Add");
  }

  async function deletePost(id) {
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      //.filter is to refresh to show updated posts (eg, after delete and refresh automatically)
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#D6C6B8",
            borderBottomWidth: 1,
            alignItems: 'center',
            //justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',        
            marginHorizontal: 15,
          }}
        >
           <View style= {{ width: "28%"}}>
            <Image
              style={{ width: 100, height: 100, borderRadius: 100 }}
              source={{ uri: item.image }}
            />
          </View>
          <View style= {{ marginHorizontal: 25 , width: "57%"}}>
            <Text style={styles.headerTitle}>{item.title}</Text>
            <View style={{flexDirection:"row", width: "15%"}}>
              <FontAwesome
              name="star"
              size={18}
              style={[styles.icon, { marginTop: 11, marginRight: 5 }]}
              />
              <Text style={[styles.text, {marginTop: 11, fontSize: 18 }]}>{item.rating}/5</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => deletePost(item.id)}>
              <FontAwesome style={[styles.icon, { position: 'absolute', right: 0 }]} name="trash" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      />
    </View>
  );
}
