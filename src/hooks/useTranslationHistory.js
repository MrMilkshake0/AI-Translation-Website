// src/hooks/useTranslationHistory.js
import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import {
  collection, query, where, orderBy, onSnapshot
} from "firebase/firestore";
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "firebase/auth";

const useTranslationHistory = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "translations"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || null,
          };
        });
        setHistory(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load translations:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    user, history, loading, selectedItem, setSelectedItem,
    email, setEmail, password, setPassword, isLogin, setIsLogin,
    handleAuth
  };
};

export default useTranslationHistory;
