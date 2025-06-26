import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

interface Recommendation {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPopular: boolean;
  score: number;
  reason: string;
}

const RecommendationCard = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = user?.token;
      const res = await fetch("/api/recommendations/collaborative?limit=6", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecommendations(data.data);
      else setError("Öneriler yüklenemedi.");
    } catch (e) {
      setError("Öneriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading) return <ActivityIndicator size="large" color="#8b5cf6" style={{ marginVertical: 24 }} />;
  if (error) return <Text style={{ color: "#b91c1c", textAlign: "center", marginVertical: 16 }}>{error}</Text>;
  if (recommendations.length === 0) return null;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.header}>AI Barista'dan Sana Özel Kahve Önerileri</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {recommendations.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.recommendationCard}
            onPress={() => navigation.navigate("MenuDetailScreen", { itemId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.price}>{item.price} ₺</Text>
            <Text style={styles.reason}>{item.reason}</Text>
            {item.isPopular && <Text style={styles.popular}>Popüler</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6d28d9",
    marginBottom: 12,
    textAlign: "center",
  },
  scrollRow: {
    flexDirection: "row",
  },
  recommendationCard: {
    backgroundColor: "#f3f0ff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: "#8b5cf6",
    fontWeight: "bold",
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: "#6d28d9",
    marginBottom: 4,
  },
  popular: {
    fontSize: 11,
    color: "#f59e42",
    fontWeight: "bold",
  },
});

export default RecommendationCard; 