import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_API_KEY } from "../constants/constants";
import Toast from "react-native-root-toast";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadApiKey();
    });
    return unsubscribe;
  }, [navigation]);

  const loadApiKey = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_API_KEY);

      if (value !== null) {
        setApiKey(value);
        setHasKey(true);
      } else {
        setHasKey(false);
        setApiKey("");
      }
    } catch (e) {
      Alert.alert("Error", "Could not load API key from storage");
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_API_KEY, apiKey);
      setHasKey(true);
      Toast.show("API key saved", {
        duration: Toast.durations.SHORT,
      });
    } catch (e) {
      Alert.alert("Error", "Could not save API key to storage");
    }
  };

  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY);
      setHasKey(false);
      setApiKey("");

      Toast.show("API key saved", {
        duration: Toast.durations.SHORT,
      });
    } catch (e) {
      Alert.alert("Error", "Could not remove API key from storage");
    }
  };

  return (
    <View style={styles.container}>
      {hasKey && (
        <>
          <Text style={styles.label}>You are all set !</Text>
          <TouchableOpacity onPress={removeApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}

      {!hasKey && (
        <>
          <Text style={styles.label}>API Key:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            placeholder="Enter your API Key"
          ></TextInput>
          <TouchableOpacity onPress={saveApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
});

export default SettingsPage;
function useLayoutEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
