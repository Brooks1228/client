// https://chat-app-server-kc0e.onrender.com

import React, { useState, useEffect } from "react";
import Fireworks from "react-native-fireworks";
import {
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { io } from "socket.io-client";

const socket = io("https://chat-app-server-kc0e.onrender.com");

export default function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (showFireworks) {
      const time = setTimeout;
    }
  });

  useEffect(() => {
    socket.on("message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    socket.on("lastMessages", (messages) => {
      console.log(messages);
      setChatMessages((prev) => [...prev, ...messages]);
    });
    console.log("emitting");
    socket.emit("getLastMessages");
    return () => {
      socket.off("message");
      socket.off("lastMessages");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      // we will send to server
      socket.emit("message", message);
      setMessage("");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.entryArea}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        ></TextInput>
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    marginTop: 20,
    marginBottom: 60,
  },

  entryArea: {
    flexDirection: "row",
    padding: 10,
  },

  input: {
    borderWidth: 1,
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});
