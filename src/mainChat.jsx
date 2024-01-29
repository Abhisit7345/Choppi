import React from "react";
import { query, where, collection, getDocs } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { getTotalChatNumber } from "./getTotalChatNumber";
import Signin from "./auth/Signin";
import Footer from "./footer";
import { Form } from "react-bootstrap";

import "./css/content.css";
import CommonStyles from "./commonStyles";
import "./css/mainChat.css"

export default function MainChat() {
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [displayUser, setDisplayUser] = useState([]);
  const searchRef = useRef();
  const userRef = collection(db, "users");

  let getChatArray = getTotalChatNumber(currentUser.uid);

  function handleSearch() {
    if (!searchRef.current.value) {
      setDisplayUser(allUsers);
    } else {
      let curDisplay = [];
      allUsers.forEach((document) => {
        let name = document.name.toLowerCase();
        if (name.startsWith(searchRef.current.value.toLowerCase())) {
          curDisplay.push(document);
        }
      });
      setDisplayUser(curDisplay);
    }
  }

  function handleChat() {}

  useEffect(() => {
    getDocs(userRef)
      .then((querySnapshot) => {
        // Iterate over the documents in the collection
        querySnapshot.forEach((doc) => {
          // Access the data of each document
          const documentData = doc.data();
          setAllUsers((prev) => {
            let isDocPresent = true;
            isDocPresent = prev.some(
              (document) => document.name == documentData.name
            );
            if (!isDocPresent && documentData.uid != currentUser.uid) {
              return [...prev, documentData];
            } else {
              return prev;
            }
          });

          setDisplayUser((prev) => {
            let isDocPresent = true;
            isDocPresent = prev.some(
              (document) =>
                document.name == documentData.name ||
                documentData.uid == currentUser.uid
            );
            if (!isDocPresent && documentData.uid != currentUser.uid) {
              return [...prev, documentData];
            } else {
              return prev;
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error getting documents:", error);
      });
  }, []);

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
            <div className="flex-grow-1 d-flex justify-content-center">
              <div style={{ width: "80%" }}>
                <div>
                  <Form.Control
                    type="text"
                    placeholder="search user"
                    ref={searchRef}
                    onChange={handleSearch}
                  />
                </div>
                <div>
                  {displayUser.map((document) => (
                    <Link
                      key={document.uid}
                      to={{
                        pathname: "/chat",
                        search: `userId=${document.uid}`,
                      }}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <div
                        className="d-flex justify-content-between chat-item px-2"
                        onClick={handleChat}
                      >
                        <div className="d-flex align-items-center">
                          <div>
                            <img
                              src={`${document.pictureUrl}`}
                              alt={`${document.name}'s Profile`}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="mx-3" key={document.name}>{document.name}</div>
                        </div>
                        <div className="d-flex align-items-center">
                          {document.uid in getChatArray ? (
                            <div className="text-number">{getChatArray[document.uid]}</div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </div>
      ) : (
        <Signin />
      )}
    </>
  );
}
