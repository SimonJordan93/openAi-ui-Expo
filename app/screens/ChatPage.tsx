import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Creator, useApi } from "../hooks/useApi";

import { FlashList } from "@shopify/flash-list";

import botImg from "../../assets/openai-logo.png";
import userImg from "../../assets/simon.jpg";

const ChatPage = () => {
  const { getCompletion, messages } = useApi();
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim().length > 0) {
      const msg = inputMessage;
      setLoading(true);
      setInputMessage("");
      await getCompletion(msg);
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isUserMessage = item.from === Creator.Me;
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.userMessageContainer
            : styles.botMessageContainer,
        ]}
      >
        <Image source={isUserMessage ? userImg : botImg} style={styles.img} />
        <Text style={{ flexShrink: 1 }}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlashList
        data={messages}
        renderItem={renderMessage}
        estimatedItemSize={58}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : <></>
        }
      />

      {/* <View style={styles.container} /> */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message"
          autoCapitalize="none"
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          editable={!loading}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    // backgroundColor: "red",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    minHeight: 50,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#18191a",
    padding: 10,
    borderRadius: 6,
    marginLeft: 10,
    alignSelf: "center",
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  img: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 20,
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  userMessageContainer: {
    backgroundColor: "#fff",
  },
  botMessageContainer: {
    backgroundColor: "#f5f5f6",
  },
});

export default ChatPage;
