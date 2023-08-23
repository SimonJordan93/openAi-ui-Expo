// Importing necessary components from React Native library
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

// SafeAreaView is a helpful component to make sure our app content doesn't interfere with the native components (like the notch on some phones).
import { SafeAreaView } from "react-native-safe-area-context";

// React core and useState hook for component-level state management.
import React, { useState } from "react";

// Custom hook and types imported from local files.
import { Creator, useApi } from "../hooks/useApi";

// External component from Shopify for an efficient and flexible list.
import { FlashList } from "@shopify/flash-list";

// Static assets imported for use within the chat.
import botImg from "../../assets/openai-logo.png";
import userImg from "../../assets/simon.jpg";

// Main component definition.
const ChatPage = () => {
  // Using the custom hook to retrieve API function and message data.
  const { getCompletion, messages } = useApi();

  // Local state for managing the user input and loading state.
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler function for when user sends a message.
  const handleSendMessage = async () => {
    // Making sure we're not sending an empty message.
    if (inputMessage.trim().length > 0) {
      const msg = inputMessage;

      // Show a loader/spinner while processing.
      setLoading(true);

      // Clear the input field for next message.
      setInputMessage("");

      // Make the API call to get a completion/response.
      await getCompletion(msg);

      // Hide loader/spinner after processing.
      setLoading(false);
    }
  };

  // Rendering function for individual chat messages in our list.
  const renderMessage = ({ item }: any) => {
    // Determine if the current message is from the user.
    const isUserMessage = item.from === Creator.Me;
    return (
      <View
        style={[
          styles.messageContainer,
          // Conditional styling based on the sender.
          isUserMessage
            ? styles.userMessageContainer
            : styles.botMessageContainer,
        ]}
      >
        {/* Displaying an image based on the sender. */}
        <Image source={isUserMessage ? userImg : botImg} style={styles.img} />

        {/* Displaying the actual message text. */}
        <Text>{item.text}</Text>
      </View>
    );
  };

  // Return statement for the component's rendered JSX.
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Chat list displaying all the messages. */}
      <FlashList
        data={messages}
        renderItem={renderMessage}
        estimatedItemSize={58}
        keyExtractor={(item, index) => index.toString()}
        // Conditional loading spinner display at the bottom of the list.
        ListFooterComponent={
          loading ? <ActivityIndicator /> : <></>
        }
      />

      {/* Input section at the bottom for user to type and send messages. */}
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
          // Disable input when waiting for API response.
          editable={!loading}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          // Disable button when waiting for API response.
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
