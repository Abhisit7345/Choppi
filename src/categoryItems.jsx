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

import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";

export default function CategoryItems() {
  const location = useLocation();
  const [itemList, setItemList] = useState([]);
  const [displayItem, setDisplayItem] = useState();
  const [nameList, setNameList] = useState([]);
  let [params, setParams] = useState(new URLSearchParams(location.search))
  let [category, setCategory] = useState(params.get("category"))
  const [reload, setReload] = useState(false)

  const updateContent = () => {
    console.log('called')
    setReload((prev)=>{
      return !prev
    })
  }

  const fetchData = async () => {
    const q = query(
      collection(db, "store"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setItemList((prev) => {
        const new_prev = [...prev];
        const newData = { ...doc.data(), itemId: doc.id };
        new_prev.push(newData);
        addName(doc.data().uid);
        return new_prev;
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  async function addName(uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setNameList((prev) => {
        const new_prev = [...prev];
        new_prev.push(doc.data().name);
        return new_prev;
      });
    });
  }

  useEffect(()=>{
    params = new URLSearchParams(location.search);
    setCategory(()=>{
      return params.get("category");
    }) 
    console.log('param changed')
  },[reload])

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
        className="d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="content flex-grow-1"
          style={{ margin: "50px 20rem", width: '70%'}}
        >
          {displayItem ? (
            <div
              className="row"
              style={{
                backgroundColor: "aquamarine",
                padding: "50px",
                border: "green 1px solid",
                borderRadius: "20px",
              }}
            >
              {displayItem.map((item, index) => (
                <div className="col-md-12 col-lg-6 col-xl-4 col-xxl-3" style={{ marginBottom: "20px" }}>
                  <Card
                    style={{ width: "12rem", height: "20rem" }}
                    key={item.docId}
                  >
                    <Link
                      to={{
                        pathname: "/itemInfo",
                        search: `itemId=${item.itemId}`,
                      }}
                      style={{ textDecoration: "none", color: "black" }}
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
                            height: "3rem",
                            whiteSpace: "nowrap",
                            borderRadius: "5px",
                            padding: "10px",
                          }}
                        >
                          {item.description}
                        </Card.Text>
                        <Card.Text
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "15px",
                          }}
                        >
                          posted by {nameList[index]}
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign : 'center' }}>No items to display</div>
          )}
        </div>
        <div>
          <Footer onUpdateContent={updateContent} />
        </div>
      </div>
    </div>
  );
}
