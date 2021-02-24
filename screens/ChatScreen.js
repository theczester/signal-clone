import React, { useLayoutEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as firebase from "firebase";
import { auth, db } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Avatar
            rounded
            source={{
              uri:
                messages[messages.length - 1]?.data.photoURL ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={styles.headerText}>{route.params.chatName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const handleSendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.chatContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView
              contentContainerStyle={{ paddingTop: 15 }}
              scrollsToTop="false"
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: false })
              }
            >
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.myMessage}>
                    <Avatar
                      rounded
                      right={-5}
                      bottom={-15}
                      size={30}
                      source={{ uri: data.photoURL }}
                      position="absolute"
                    />
                    <Text style={styles.myMessageText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.recievedMessage}>
                    <Avatar
                      rounded
                      size={30}
                      source={{ uri: data.photoURL }}
                      rounded
                      left={-5}
                      bottom={-15}
                      size={30}
                      source={{ uri: data.photoURL }}
                      position="absolute"
                    />
                    <Text style={styles.recievedMessageText}>
                      {data.message}
                    </Text>
                    <Text style={styles.recievedMessageName}>
                      {data.displayName}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Signal Message"
                value={input}
                onChangeText={(text) => setInput(text)}
                style={styles.textInput}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chatContainer: {
    flex: 1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  recievedMessage: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  myMessage: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-end",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  recievedMessageText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  myMessageText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
  },
  recievedMessageName: {
    left: 10,
    color: "black",
    fontSize: 12,
    paddingRight: 10,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 75,
    marginRight: 20,
  },
});
