import { useState } from "react";
import { query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect } from "react";

export const getTotalChatNumber = (currentUser) => {
  const messageRef = collection(db, "messages");
  const [messageArray, setMessageArray] = useState({});
  useEffect(() => {
    const fetchTotalNumber = async () => {
        try {
            const q = query(messageRef, where("createdFor", "==", currentUser), where('status', '==', 'unread'));
    
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const updatedCount = {};

              querySnapshot.forEach((doc) => {
                const createdBy = doc.data().createdBy;
    
                updatedCount[createdBy] = (updatedCount[createdBy] || 0) + 1;
              });
              setMessageArray(updatedCount);
            });
    
            return () => {
              // Unsubscribe from the snapshot listener when the component unmounts
              unsubscribe();
            };
        } catch (e) {
        console.log("there is an error"+e);
      }
    };

    fetchTotalNumber();
  }, []);
  return messageArray;
};
