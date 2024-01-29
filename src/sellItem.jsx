import React from "react";

import Navbar from "./navbar";
import CommonStyles from "./commonStyles";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import { useRef, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { Transition } from "react-transition-group";
import { useLocation } from "react-router-dom";

import { Form, Button } from "react-bootstrap";

import "./css/sellitem.css";
import "./css/content.css";
import "./css/navbar.css";

export default function SellItem() {
  const addImage = useRef("");
  const itemName = useRef("");
  const itemDescription = useRef("");
  const itemPrice = useRef("");
  const itemCategory = useRef("");
  const alertRef = useRef(null);
  const [displayImage, setDisplayImage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { currentUser } = useAuth();
  const storeRef = collection(db, "store");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");

  //get data when if came from modify item
  useEffect(() => {
    if (itemId != null) {
      const fetchData = async () => {
        const docRef = doc(db, "store", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const item = docSnap.data();
          itemPrice.current.value = item.price;
          itemCategory.current.value = item.category;
          itemName.current.value = item.name;
          itemDescription.current.value = item.description;
          setDisplayImage(item.pictureUrl);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, [showAlert]);

  function addImageToSell() {
    const inputElement = addImage.current;
    addImage.current.click();
  }

  function handleFileChange() {
    const file = addImage.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setIsClicking(false);
      setDisplayImage(reader.result);
    };
  }

  function removeImage() {
    setDisplayImage("");
  }

  async function addItemForSale(e) {
    e.preventDefault();

    if (
      itemName.current.value == "" ||
      itemDescription.current.value == "" ||
      displayImage == "" ||
      itemPrice.current.value == "" ||
      itemCategory.current.value == ""
    ) {
      alert("add all fields");
      return;
    }
    
    if(itemId == null){
      try {
        const docRef = await addDoc(storeRef, {
          uid: currentUser.uid,
          pictureUrl: displayImage,
          name: itemName.current.value,
          description: itemDescription.current.value,
          price: itemPrice.current.value,
          createdAt: serverTimestamp(),
          category: itemCategory.current.value,
        });
        console.log("item has been added");
      } catch (e) {
        console.log(e);
      }
    }
    else{
      try {
        const storeDB = doc(db,"store", itemId)
        await updateDoc(storeDB, {
          uid: currentUser.uid,
          pictureUrl: displayImage,
          name: itemName.current.value,
          description: itemDescription.current.value,
          price: itemPrice.current.value,
          createdAt: serverTimestamp(),
          category: itemCategory.current.value,
        });
        console.log("item has been modified");
      } catch (e) {
        console.log(e);
      }
    }

    setDisplayImage("");
    addImage.current.value = "";
    itemDescription.current.value = "";
    itemPrice.current.value = "";
    itemName.current.value = "";
    setShowAlert(true);
  }

  return (
    <>
      <CommonStyles />
      <div className="contain">
        <div className="nav">
          <Navbar />
        </div>
        <div className="content">
          <div className="main">
            <Transition
              in={showAlert}
              timeout={300}
              unmountOnExit
              nodeRef={alertRef}
            >
              {(state) => {
                console.log(state);
                return (
                  <div
                    ref={alertRef}
                    className={`alert`}
                    style={{
                      transition: "opacity 300ms ease-in-out",
                      opacity: state === "entered" ? 1 : 0,
                    }}
                  >
                    {itemId? (<div>Item modified</div>):(<div>Item added for sale</div>)}

                  </div>
                );
              }}
            </Transition>
            <div className="form">
              <div className="picture">
                {!displayImage ? (
                  <div className="addImage" onClick={addImageToSell}>
                    add image
                    <input
                      type="file"
                      id="addImage"
                      style={{ display: "none" }}
                      ref={addImage}
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="confirmImage d-flex justify-content-center align-items-center">
                      <img
                        style={{
                          width: "90%",
                          height: "90%",
                          objectFit: "contain",
                        }}
                        src={displayImage}
                        alt=""
                      />
                    </div>
                    <input
                      type="file"
                      id="confirmImage"
                      style={{ display: "none" }}
                      ref={addImage}
                      onChange={handleFileChange}
                    />
                    <div className="d-flex my-3 justify-content-center">
                      <Button
                        className="mx-5"
                        variant="info"
                        onClick={addImageToSell}
                      >
                        change image
                      </Button>
                      <Button
                        className="mx-5"
                        variant="danger"
                        onClick={removeImage}
                      >
                        remove image
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-fill">
                <Form>
                  <Form.Group className="mb-3" controlId="itemName">
                    <Form.Label>Item name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="item name"
                      ref={itemName}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="itemDescription">
                    <Form.Label>Item description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="item description"
                      ref={itemDescription}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="itemPrice">
                    <Form.Label>Price</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="item price"
                        ref={itemPrice}
                        style={{ width: "1000px" }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="itemPrice">
                    <Form.Label>Category</Form.Label>
                    <div className="d-flex">
                      <Form.Select ref={itemCategory}>
                        <option value=""></option>
                        <option value="clothing">clothing</option>
                        <option value="electronics">electronics</option>
                        <option value="home">home</option>
                        <option value="other">other</option>
                      </Form.Select>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={addItemForSale}
                  >
                    {!itemId ? <div>Add item</div> : <div>Modify item</div>}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
