import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useApi } from "../hooks/useApi";

const ImagesPage = () => {
  const [input, setInput] = useState("");
  const { generateImage } = useApi();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerateImage = async () => {
    setLoading(true);
    const image = await generateImage(input);
    console.log(image);

    setImage(image || "");
    setLoading(false);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.input}
        placeholder="Enter your prompt here"
        editable={!loading}
        autoCorrect={false}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={onGenerateImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Generate image</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ marginTop: 10 }} size="large" />}
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#18191a",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 20,
    resizeMode: "contain",
  },
});

export default ImagesPage;
