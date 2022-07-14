import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { API, API_POSTS } from "../constants/API";
import { commonStyles, lightStyles, darkStyles } from "../styles/commonStyles";

export default function ShowScreen({ navigation, route }) {
  const [post, setPost] = useState({ title: "", body: "" });
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={editPost} style={{ marginRight: 10 }}>
          <FontAwesome
            name="pencil-square-o"
            size={30}
            color={styles.headerTint}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    getPost();
  }, []);

  async function getPost() {
    const id = route.params.id;
    console.log(id);
    try {
      const response = await axios.get(API + API_POSTS + "/" + id, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPost(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  function editPost() {
    navigation.navigate("Edit", { post: post });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[additionalStyles.header, styles.text]}>
        {post.title}
      </Text>
      <Image style={{ width: 350, height: 350, alignSelf: "center", borderRadius: 10 }}
             source={{ uri: post.image }} />
      <Text style={[additionalStyles.header, styles.text]}>
        {post.content}
      </Text>
      <Text style={[additionalStyles.paragraph, styles.text]}>
        {post.comment}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ justifyContent:"flex-start", marginRight: 30 }}>
          <FontAwesome
            name="coffee"
            size={20}
            color={"#3F5362"}
            style={{ marginLeft: 20, marginTop: 15 }}
          />
          <Text style={[additionalStyles.label, styles.text]}>Type</Text>
          <Text style={[additionalStyles.input, styles.text]}>
            {post.coffeeType}
          </Text>
        </View>
        <View style={{ justifyContent:"flex-end", marginRight: 30 }}>
        <FontAwesome
            name="fire"
            size={20}
            color={"#3F5362"}
            style={{ marginLeft: 20, marginTop: 15 }}
          />
          <Text style={[additionalStyles.label, styles.text]}>Roast</Text>
          <Text style={[additionalStyles.input, styles.text]}>
          {post.roast}
          </Text>
        </View>
        <View style={{ justifyContent:"flex-end" }}>
        <FontAwesome
            name="star"
            size={20}
            color={"#3F5362"}
            style={{ marginLeft: 20, marginTop: 15 }}
          />
          <Text style={[additionalStyles.label, styles.text]}>Rating</Text>
          <Text style={[additionalStyles.input, styles.text]}>
            {post.rating}/5
          </Text>
        </View>
      </View>
      
    </ScrollView>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 25,
    borderWidth: 0,
    borderColor: "black",
    marginVertical: 10,
    marginLeft: 20,
  },
  header: {
    fontSize: 30,
    marginVertical: 20,
    marginLeft: 20,
    
  },
  label: {
    fontSize: 20,
    marginTop: 5,
    marginLeft: 20,
    fontWeight: "bold",
    
  },
  paragraph: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
    
  },
});
