import React from "react";

import Navbar from "./navbar.jsx";
import CommonStyles from "./commonStyles.jsx";
import "./css/content.css";
import Footer from "./footer.jsx";

import { collection, where, query, getDocs } from "firebase/firestore";

import { auth, db } from "./firebase.js";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";

export default function CategoryItems() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const [itemList, setItemList] = useState([]);
  const [displayItem, setDisplayItem] = useState();
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "store"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setItemList((prev) => {
          const new_prev = [...prev];
          new_prev.push(doc.data());
          addName(doc.data().uid)
          return new_prev;
        });
      });
    };
    fetchData();
  }, []);

  async function addName(uid){
    const q = query(
      collection(db, "users"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setNameList((prev) => {
        const new_prev = [...prev];
        new_prev.push(doc.data().name);
        return new_prev;
      });
    });
  }

  useEffect(() => {
    const newList = [];
    for (let i = 0; i < itemList.length / 2; i++) {
      newList.push(itemList[i]);
    }
    setDisplayItem(newList);
  }, [itemList]);
  return (
    <div>
      <CommonStyles />
      <div className="nav">
        <Navbar />
      </div>
      <div
        className="d-flex flex-column align-items-between"
        style={{ minHeight: "100vh" }}
      >
        <div className="content flex-grow-1">
          {displayItem ? (
            <div>
              {console.log(itemList)}
              {displayItem.map((item, index) => (
                <div><Card
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
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "4rem",
                      whiteSpace: "nowrap",
                      border : "red 1px solid",
                    }}
                  >
                    {item.description} fdsfasfsdfasf
                  </Card.Text>
                  <Card.Text style={{ overflow : 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '15px' }}>
                    posted by { nameList[index] }
                  </Card.Text>
                </Card.Body>
              </Card></div>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

