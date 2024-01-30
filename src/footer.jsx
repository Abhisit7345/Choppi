import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import linkin from "./assets/linkin.png";
import github from "./assets/github.png";

import { useState } from "react";

export default function Footer({ onUpdateContent }) {
  
  const [reload, setReload] = useState(false)
  function handleReload() {
    setReload((prev)=>{
      return !prev
    })
  }

  const updateParent = () =>{
    onUpdateContent()
  }

  useEffect(()=>{
    console.log('called from footer')
  }, [reload])

  return (
    <div className="footer-item">
      <div className="d-flex justify-content-between footer-content">
        <div>
          <b>Products</b>
          <Link
            to={{
              pathname: "/categoryItems",
              search: "category=home",
            }}
            style={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={updateParent}
          >
            <div>Home</div>
          </Link>
          <Link
            to={{
              pathname: "/categoryItems",
              search: "category=electronics",
            }}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div>Electronics</div>
          </Link>
          <Link
            to={{
              pathname: "/categoryItems",
              search: "category=clothing",
            }}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div>Clothing</div>
          </Link>
          <Link
            to={{
              pathname: "/categoryItems",
              search: "category=other",
            }}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div>Other</div>
          </Link>
        </div>
        <div className="d-flex flex-column">
          <a
            href="https://linkedin.com/in/abhisit-anupapphan-32879b23a"
            target="_blank"
          >
            <img
              src={linkin}
              alt="no image available"
              style={{ height: "30px" }}
            />
          </a>
          <a href="https://github.com/Abhisit7345/Choppi" target="_blank">
            <img
              src={github}
              alt="no image available"
              style={{ height: "30px" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
