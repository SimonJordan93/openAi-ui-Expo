import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { OpenAI } from "openai";
import { STORAGE_API_KEY } from "../constants/constants";
import { Alert } from "react-native";

export enum Creator {
  Me = 0,
  Bot = 1,
}

export interface Message {
  text: string;
  from: Creator;
}

let messageSubject: BehaviorSubject<Message[]>;

export const useApi = () => {
  const dummyMessages = [
    {
      text: "Hello, how can i help you today?",
      from: Creator.Bot,
    },
  ];
  const [messages, setMessages] = useState<Message[]>();

  if (!messageSubject) {
    messageSubject = new BehaviorSubject<Message[]>(dummyMessages);
  }

  useEffect(() => {
    const subscription = messageSubject.subscribe((messages) => {
      console.log("NEW MESSAGE");

      setMessages(messages);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getCompletion = async (prompt: string) => {
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    // Add our own message
    const newMessage = {
      text: prompt,
      from: Creator.Me,
    };

    messageSubject.next([...messageSubject.value, newMessage]);

    // Setup OpenAI
    const openai = new OpenAI({ apiKey });

    // Get completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(completion.choices[0].message);

    const response =
      completion.choices[0].message?.content?.trim() ||
      "Sorry we have an issue !";

    // Add bot message
    const botMessage = {
      text: response,
      from: Creator.Bot,
    };

    messageSubject.next([...messageSubject.value, botMessage]);
    return true;
  };

  // Generate Images
  const generateImage = async (prompt: string) => {
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return completion.data[0].url;
  };

  // Record speech

  const speechToText = async (audioUri: string) => {
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

    if (!apiKey) {
      Alert.alert("Error", "Could not load API key from storage");
      return;
    }

    const formData = new FormData();
    const imageData = {
      uri: audioUri,
      type: "audio/x-m4a",
      name: "audio.m4a",
    };

    formData.append("file", imageData as unknown as Blob);
    formData.append("model", "whisper-1");

    return fetch(`https://api.openai.com/v1/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }).then((response) => response.json());
  };

  return {
    messages,
    getCompletion,
    generateImage,
    speechToText,
  };
};
