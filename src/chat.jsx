import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  where,
  query,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase.js";
import { useAuth } from "./contexts/AuthContext";
import { useLocation } from "react-router-dom";

import "./css/content.css";
import CommonStyles from "./commonStyles.jsx";
import Navbar from "./navbar.jsx";
import "./css/chat.css";
import Signin from "./auth/Signin.jsx";
import Footer from "./footer.jsx";
import { Form, Button } from "react-bootstrap";

export default function Chat() {
  const chatRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [messageOrderList, setMessageOrderList] = useState([]);
  const { currentUser } = useAuth();
  const room = "test";
  const messageRef = collection(db, "messages");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const messageToUser = params.get("userId");
  const [otherInfo, setOtherInfo] = useState();

  async function getOtherInfo() {
    const q = query(collection(db, "users"), where("uid", "==", messageToUser));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setOtherInfo(doc.data());
    });
  }

  useEffect(() => {
    getOtherInfo();
    try {
      const queryMessages = query(
        messageRef,
        where("createdBy", "in", [currentUser.uid, messageToUser]),
        where("createdFor", "in", [currentUser.uid, messageToUser]),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const tempMessageOrder = [];
        const tempMyMessage = [];
        const tempOtherMessage = [];
        snapshot.forEach((document) => {
          if (document.data().createdBy != currentUser.uid) {
            const data = doc(db, "messages", document.id);
            updateDoc(data, { status: "read" });
          }
          if (document.data().uid == currentUser.uid) {
            tempMyMessage.push({ ...document.data(), id: document.id });
          } else {
            tempOtherMessage.push({ ...document.data(), id: document.id });
          }
          tempMessageOrder.push({ ...document.data(), id: document.id });
          tempMessageOrder.sort((a, b) => {
            const createdAtA = a.createdAt;
            const createdAtB = b.createdAt;

            return createdAtA - createdAtB;
          });
        });
        setMessageOrderList(tempMessageOrder);
      });
      return () => {
        unsubscribe();
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  function handleInputChange() {
    setInputValue(chatRef.current.value);
  }
  async function handleSubmit() {
    if (chatRef.current.value == "") {
      return;
    }
    try {
      const docRef = await addDoc(messageRef, {
        text: inputValue,
        createdAt: serverTimestamp(),
        user: currentUser.displayName,
        createdBy: currentUser.uid,
        createdFor: messageToUser,
        status: "unread",
      });
    } catch (e) {
      console.log(e);
    }
    setInputValue("")
  }

  return (
    <>
      {currentUser ? (
        <div>
          {" "}
          <CommonStyles />
          <div className="nav">
            <Navbar />
          </div>
          <div
            className="content d-flex flex-column"
            style={{ minHeight: "100vh" }}
          >
            <div className="flex-grow-1" style={{ margin: "10px" }}>
              <div className="d-flex other-info">
                {otherInfo ? (
                  <>
                    <img
                      src={otherInfo.pictureUrl}
                      alt=""
                      style={{ height: "30px" }}
                    />
                    <div style={{ marginLeft: "20px" }}>{otherInfo.name}</div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {messageOrderList.map((messages) => (
                  <>
                    {messages.createdBy == currentUser.uid ? (
                      <div
                        style={{ height: "50px", marginTop: "2px" }}
                        className="d-flex align-items-center"
                      >
                        <h3
                          className="chatbox-left"
                          style={{
                            color: "green",
                            textAlign: "left",
                            border: "3px black solid",
                            height: "100%",
                            padding: "0px 10px 0px 10px",
                          }}
                        >
                          {messages.text}
                        </h3>
                      </div>
                    ) : (
                      <div
                        style={{ height: "50px", marginTop: "2px" }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        <h3
                          className="chatbox-right"
                          style={{
                            color: "red",
                            border: "1px black solid",
                            height: "100%",
                            padding: "0px 10px 0px 10px",
                          }}
                        >
                          {messages.text}
                        </h3>
                      </div>
                    )}
                  </>
                ))}
              </div>
              <Form.Control
                type="text"
                placeholder="enter message"
                ref={chatRef}
                onChange={handleInputChange}
                value={inputValue}
              />
              <Button
                variant="outline-success"
                onClick={handleSubmit}
                className="submit-button"
              >
                send
              </Button>{" "}
            </div>

            <div>
              <Footer />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Signin />
        </div>
      )}
    </>
  );
}
