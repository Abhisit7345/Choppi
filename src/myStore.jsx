import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

import { query, collection, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Footer from "./footer";

import "./css/content.css";

import Navbar from "./navbar";
import CommonStyles from "./commonStyles";

export default function MyStore() {
  const { currentUser } = useAuth();
  const storeRef = collection(db, "store");
  const [curItem, setCurItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalId, setModalId] = useState("");

  const handleClose = () => setShowModal(false);
  function handleShow(name, id) {
    setModalId(id);
    setModalName(name);
    setShowModal(true);
  }

  async function handleDelete() {
    await deleteDoc(doc(db, "store", modalId));
    window.location.reload();
  }

  useEffect(() => {
    const q = query(storeRef, where("uid", "==", currentUser.uid));
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          if (!curItem.some((item) => item.uid === doc.data().uid)) {
            setCurItem((prev) => {
              const new_array = prev.slice();
              const new_item = doc.data();
              new_item.id = docId;
              new_array.push(new_item);
              return new_array;
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Are you sure you want to delete {modalName}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            no
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleClose();
              handleDelete();
            }}
          >
            yes
          </Button>
        </Modal.Footer>
      </Modal>
      <CommonStyles />
      <div className="nav">
        <Navbar />
      </div>
      <div className="content d-flex flex-column" style={{ height: "100vh" }}>
        <div
          className="flex-grow-1"
          style={{ marginTop: "20px", padding: "20px" }}
        >
          {curItem.length > 0 ? (
            <div className="row">
              {curItem
                .filter(
                  (item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                )
                .map((item) => {
                  return (
                    <div
                      className="col-md-12 col-lg-6 col-xl-4 col-xxl-3"
                      style={{ marginBottom: "20px" }}
                      key={item.docId}
                    >
                      <Card style={{ width: "12rem", height: "20rem" }}>
                        <Card.Img
                          src={item.pictureUrl}
                          style={{
                            height: "10rem",
                            objectFit: "cover",
                          }}
                        />
                        <Card.Body style={{ height: "9rem" }}>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxHeight: "7rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.description}
                          </Card.Text>
                        </Card.Body>
                        <div style={{ width: "100%" }}>
                          <Link
                            to={{
                              pathname: "/sellItem",
                              search: `itemId=${item.id}`,
                            }}
                            style={{ width: "100%" }}
                          >
                            <Button variant="primary" style={{ width: "100%" }}>
                              Modify item
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            style={{ width: "100%" }}
                            onClick={() => handleShow(item.name, item.id)}
                          >
                            Delete item
                          </Button>
                        </div>
                      </Card>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div>you do not have any items!</div>
          )}
          <div>
            <Link to="/sellitem">
              <Button variant="primary">List item</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
