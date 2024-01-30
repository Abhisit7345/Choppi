import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Row, Col } from "react-bootstrap";

import "./css/content.css";

import Navbar from "./navbar";
import CommonStyles from "./commonStyles";

export default function MyStore() {
  const { currentUser } = useAuth();
  const storeRef = collection(db, "store");
  const [curItem, setCurItem] = useState([]);

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
    <div>
      <CommonStyles />
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <Row sm={12} lg={12}>
          {curItem.length > 0 ? (
            curItem
              .filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.id === item.id)
              )
              .map((item) => {
                console.log(item);
                return (
                  <div>
                    <Card
                      style={{ width: "12rem", height: "20rem" }}
                      key={item.docId}
                    >
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
                      <Button variant="primary">Modify item</Button>
                    </Card>
                  </div>
                );
              })
          ) : (
            <div>you do not have any items!</div>
          )}
        </Row>
        <div>
          <Link to="/sellitem">
            <button>start listing</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
