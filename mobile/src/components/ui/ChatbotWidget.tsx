import React, { useState, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { CONFIG } from '../../config/environment';

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, token } = useAuth();

  const handleInitialMessage = () => {
    setMessages([
      {
        id: "1",
        type: "bot",
        message:
          "Merhaba! Ben AI Barista. Sana kafe atmosferinde, sıcak ve samimi bir şekilde yardımcı olabilirim. Kahve önerisi, menü, ödüller veya kafe hakkında her şeyi sorabilirsin!",
        timestamp: new Date(),
      },
    ]);
  };

  const openModal = () => {
    setIsOpen(true);
    if (messages.length === 0) handleInitialMessage();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/chatbot/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: userMessage.message }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "bot",
            message: data.data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "bot",
            message: "Üzgünüm, şu anda yardımcı olamıyorum.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          message: "Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>{isOpen ? "✕" : "☕"}</Text>
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>AI Barista</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.messagesContainer}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.type === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{message.message}</Text>
                </View>
              ))}
              {isLoading && <ActivityIndicator size="small" color="#8b5cf6" style={{ marginVertical: 8 }} />}
            </ScrollView>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Bir şey sor..."
                value={inputMessage}
                onChangeText={setInputMessage}
                onSubmitEditing={sendMessage}
                editable={!isLoading}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Text style={styles.sendButtonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#8b5cf6",
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 100,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    minHeight: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  closeButton: {
    fontSize: 22,
    color: "#8b5cf6",
    padding: 4,
  },
  messagesContainer: {
    flexGrow: 1,
    marginBottom: 8,
    maxHeight: 260,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#e0e7ff",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#f3f0ff",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
    color: "#1e293b",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ChatbotWidget; 