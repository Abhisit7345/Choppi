import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./navbar";
import "./css/content.css";
import styled from "styled-components";
import CommonStyles from "./commonStyles.jsx";
import "./css/profile.css";
import Footer from "./footer.jsx";

import { Button } from "react-bootstrap";

import {
  query,
  where,
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase.js";

const FontLink = styled.link`
preconnect: https://fonts.googleapis.com;
preconnect: https://fonts.gstatic.com;
cross-origin: true;
`;

export default function Profile() {
  useEffect(() => {
    const userRef = collection(db, "users");
    const queryUser = query(userRef, where("uid", "==", currentUser.uid));
    getDocs(queryUser).then((querySnapshot) => {
      const document = querySnapshot.docs[0].data();
      setProfileImage(document.pictureUrl);
      setDisplayImage(document.pictureUrl);
      setDisplayName(document.name);
    });
  }, []);

  const { currentUser } = useAuth();

  const newImage = useRef("");
  const [profileImage, setProfileImage] = useState();
  const [displayImage, setDisplayImage] = useState();
  const [displayName, setDisplayName] = useState();
  const [submit, setSubmit] = useState(false);

  function handleProfileChange() {
    setSubmit(true);
    const file = newImage.current.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setDisplayImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleReject() {
    setDisplayImage(profileImage);
    setSubmit(false);
  }

  function handleAccept() {
    setSubmit(false);
    // Remove the data:image/png;base64 prefix
    const base64Image = displayImage.replace("data:image/png;base64,", "");

    // Create a data URL
    const imageUrl = `data:image/png;base64,${base64Image}`;

    setDisplayImage(imageUrl);
    setProfileImage(imageUrl);

    const userRef = collection(db, "users");
    const queryUser = query(userRef, where("uid", "==", currentUser.uid));
    getDocs(queryUser)
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          // If there is at least one matching document
          const userDoc = querySnapshot.docs[0];
          // Access the data and update as needed
          const userData = userDoc.data();
          console.log("Current data:", userData);

          // Update the data, for example, update a field
          const updatedData = { ...userData, pictureUrl: imageUrl };

          // Update the document in Firestore
          const docRef = doc(userRef, userDoc.id);
          updateDoc(docRef, updatedData)
            .then(() => {
              console.log("Document updated successfully");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        } else {
          console.log("No matching documents found for the given user ID.");
        }
      })
      .catch((error) => {
        console.error("Firestore Query Error:", error);
      });
  }
  return (
    <>
      <CommonStyles />
      <div>
        <div className="nav">
          <Navbar />
        </div>
        <div className="content">
          <div className="d-flex align-items-center py-3 flex-column">
            <div className="d-flex justify-content-center w-100">
              <div
                style={{ width: "300px", height: "300px", overflow: "hidden" }}
                className="d-flex justify-content-center rounded-circle border border-primary"
              >
                <img
                  src={displayImage}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            {submit == true && (
              <div className="my-3 d-flex flex-column">
                <div className="d-flex justify-content-center">
                  confirm profile?
                </div>
                <div className="d-flex my-3">
                  <Button
                    className="mx-3"
                    variant="success"
                    onClick={handleAccept}
                  >
                    &#x2713;
                  </Button>
                  <Button
                    className="mx-3"
                    variant="danger"
                    onClick={handleReject}
                  >
                    &#x2715;
                  </Button>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center align-items-center my-3 w-100">
              <label
                htmlFor="profileImage"
                style={{ backgroundColor: "#ADD8E6" }}
                className="p-2 rounded"
                id="profile_button"
              >
                choose profile image
              </label>
              <input
                type="file"
                id="profileImage"
                style={{ display: "none" }}
                onChange={handleProfileChange}
                ref={newImage}
              />
            </div>
            <div>{currentUser.email}</div>
            <div>{displayName}</div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
