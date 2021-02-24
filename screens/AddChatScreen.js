import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const handleCreateChat = () => {
    if (input.length > 10) {
      alert("Chat name can't be longer than 10 characters!");
    } else {
      db.collection("chats")
        .add({
          chatName: input,
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        }
        onSubmitEditing={handleCreateChat}
      />
      <Button
        disabled={!input}
        onPress={handleCreateChat}
        title="Create new chat"
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
