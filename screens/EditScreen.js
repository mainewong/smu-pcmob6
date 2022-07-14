import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { API, API_POSTS } from "../constants/API";
import axios from "axios";
import { useSelector } from "react-redux";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import SelectDropdown from "react-native-select-dropdown";
import UploadImage from '../components/UploadImage';

export default function EditScreen({ navigation, route }) {

  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const uploadImg = useSelector((state) => state.image.image);

  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [coffeeType, setCoffeeType] = useState("");
  const [roast, setRoast] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const post = route.params.post
    setTitle(post.title);
    setContent(post.content);
    setComment(post.comment);
    setCoffeeType(post.coffeeType);
    setRoast(post.roast);
    setRating(post.rating);
  }, [])

  async function editPost() {
    const post = {
      "title": title,
      "content": content,
      "comment": comment,
      "coffeeType": coffeeType,
      "roast": roast,
      "rating": rating,
      "image": uploadImg,
    }

    const id = route.params.post.id

    try {
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data)
      navigation.navigate("Index")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
       <UploadImage/>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Shop</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Coffee</Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={text => setContent(text)}
        />
         <Text style={[additionalStyles.label, styles.text]}>Review</Text>
        <TextInput
          style={additionalStyles.input}
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Type</Text>
        <SelectDropdown
          data={["Espresso", "Filter", "Cold Brew"]}
          onSelect={(selectedItem, index) => {
            setCoffeeType(selectedItem)
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
        <Text style={[additionalStyles.label, styles.text]}>Roast</Text>
        <SelectDropdown
          data={["Light", "Medium", "Dark"]}
          onSelect={(selectedItem, index) => {
            setRoast(selectedItem)
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
        <Text style={[additionalStyles.label, styles.text]}>Ratings</Text>
        <TextInput
          style={additionalStyles.input}
          value={rating}
          onChangeText={(text) => setRating(text)}
        />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={editPost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5
  }
});