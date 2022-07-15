import axios from "axios";
import React, { useState, Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { API, API_CREATE } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import SelectDropdown from "react-native-select-dropdown";
import UploadImage from '../components/UploadImage';
import { uploadImgAction } from "../redux/ducks/uploadImg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateScreen({ navigation }) {
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const uploadImg = useSelector((state) => state.image.image);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [coffeeType, setCoffeeType] = useState("Espresso");
  const [roast, setRoast] = useState("Light");
  const [rating, setRating] = useState("");

  async function savePost() {
    const post = {
      title: title,
      content: content,
      comment: comment,
      coffeeType: coffeeType,
      roast: roast,
      rating: rating,
      image: uploadImg,
    };

    try {
      console.log(token);
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index", { post: post });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
       <UploadImage/>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Shop</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Coffee</Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
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
        <View
        style={{flexDirection:'row',}}>
          <TextInput
            style={[additionalStyles.input, {width: 196, justifyContent:"flex-start"}]}
            value={rating}
            onChangeText={(text) => setRating(text)}
          /><Text style={[additionalStyles.label, styles.text, {justifyContent:"flex-end"} ]}>/5</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={savePost}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 20,
    backgroundColor: "#e5e5e5",
    borderColor: "#D6C6B8",
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: 0,
    height: 40,
    paddingLeft: 10,
    color: "#3F5362",
  },
  label: {
    fontSize: 22,
    marginBottom: 5,
    marginLeft: 5,
    marginTop: 10,
  },
  dropDown: {
    marginBottom: 10,
  }
});
