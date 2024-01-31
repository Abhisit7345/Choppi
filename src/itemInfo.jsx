import React from "react";
import { doc, query, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import CommonStyles from "./commonStyles";
import "./css/content.css";
import "./css/itemInfo.css";
import Footer from "./footer";

export default function ItemInfo() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const docId = params.get("itemId");
  const itemRef = doc(db, "store", docId);
  const [itemInfo, setItemInfo] = useState();

  useEffect(() => {
    const q = query(itemRef);
    getDoc(q).then((item) => {
      setItemInfo(item.data());
    });
  });
  return (
    <>
      <CommonStyles />
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <div style={{ height: "1px" }}></div>
        <div className="main-item">
          {itemInfo ? (
            <div className="row">
              <div className="col-md-12 col-xl-6">
                <img
                  src={itemInfo.pictureUrl}
                  style= {{ width: '100%'}}
                  alt=""
                />
              </div>
              <div className="col-md-12 col-xl-6">
                <h2>{itemInfo.name}</h2>
                <p>{itemInfo.description}</p>
                <div>$ {itemInfo.price}</div>
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )}
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
