// https://chat-app-server-kc0e.onrender.com

import React, { useState, useEffect } from "react";
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
  const [username, setUsername] = useState("");
  const [tempUser, setTempUser] = useState("");
  const [room, setRoom] = useState("");
  const [tempRoom, setTempRoom] = useState("");

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

  if (!username || !room) {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="enter username"
          value={tempUser}
          onChangeText={setTempUser}
          style={styles.input}
        ></TextInput>

        <TextInput
          placeholder="enter room name"
          value={tempRoom}
          onChangeText={setTempRoom}
          style={styles.input}
        ></TextInput>

        <Button
          title="join chat"
          onPress={() => {
            setUsername(tempUser);
            setRoom(tempRoom);
            socket.emit("joinRoom", { username: tempUser, room: tempRoom });
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => (
          <Text>
            <Text style={{ fontWeight: "bold" }}>{item.user} </Text>
            {item.text}
          </Text>
        )}
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
