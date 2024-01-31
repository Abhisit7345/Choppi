import { useEffect, useState, useRef } from "react";
import "./css/content.css";
import "./css/footer.css";
import Navbar from "./navbar";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CommonStyles from "./commonStyles";
import Footer from "./footer";
import Signin from "./auth/Signin";
import {
  QuerySnapshot,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./css/app.css";
import { Link } from "react-router-dom";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function App() {
  const clothingRef = useRef();
  const electronicsRef = useRef();
  const homeRef = useRef();
  const otherRef = useRef();
  const searchRef = useRef();
  const categoryRef = useRef();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [allItems, setAllItems] = useState([]);
  const [chunkArray, setChunkArray] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const storeRef = collection(db, "store");
  const [displaySearch, setDisplaySearch] = useState([]);
  const [displayCategory, setDisplayCategory] = useState(false);
  const [display, setDisplay] = useState(false);
  const filterOptions = useRef();

  function chunkArrayFn(array) {
    console.log(array);
    array = array.slice(0, array.length / 2);
    if (array.length % 2 != 0) {
      array.push({ pictureUrl: "", name: "", price: "", description: "" });
    }
    const new_array = [];
    for (let i = 0; i < array.length; i += 2) {
      const temp_array = [];
      temp_array.push(array[i]);
      temp_array.push(array[i + 1]);
      new_array.push(temp_array);
    }
    return new_array;
  }

  useEffect(() => {
    const handleDisplayClose = (event) => {
      if (
        !searchRef.current.contains(event.target) &&
        !categoryRef.current.contains(event.target) &&
        !filterOptions.current.contains(event.target)
      ) {
        setDisplay(false);
      }
    };
    window.addEventListener("click", handleDisplayClose);

    return () => {
      window.removeEventListener("click", handleDisplayClose);
    };
  });

  useEffect(() => {
    const q = query(storeRef);
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const docId = doc.id;
        const new_object = { ...doc.data(), docId };
        setAllItems((prev) => {
          return [...prev, new_object];
        });
        setNewItems((prev) => {
          const oneDaySeconds = 24 * 60 * 60 * 1000;
          if (oneDaySeconds > Date.now() - doc.data().createdAt.toDate()) {
            return [...prev, new_object];
          } else {
            return prev;
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setChunkArray(chunkArrayFn(newItems));
  }, [newItems]);

  function goToSearch() {
    searchRef.current.focus();
  }

  function handleCheckBox() {
    let skipCheck = true;
    if (homeRef.current) {
      skipCheck =
        !homeRef.current.checked &&
        !electronicsRef.current.checked &&
        !otherRef.current.checked &&
        !clothingRef.current.checked;
    }
    let newItems = allItems.slice();
    newItems = newItems.slice(0, newItems.length / 2);
    let itemDisplay = [];
    for (let i = 0; i < newItems.length; i++) {
      if (!skipCheck) {
        if (
          allItems[i].category == "home" &&
          homeRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "other" &&
          otherRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "electronics" &&
          electronicsRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "clothing" &&
          clothingRef.current.checked == false
        ) {
          continue;
        }
      }
      let itemName = newItems[i].name.toLowerCase();
      if (
        itemName.startsWith(searchRef.current.value.toLowerCase()) &&
        searchRef.current.value != ""
      ) {
        itemDisplay.push(allItems[i]);
      }
    }
    setDisplaySearch(itemDisplay);
  }

  function filterSearch() {
    let skipCheck = true;
    if (homeRef.current) {
      skipCheck =
        !homeRef.current.checked &&
        !electronicsRef.current.checked &&
        !otherRef.current.checked &&
        !clothingRef.current.checked;
    }
    let newItems = allItems.slice();
    newItems = newItems.slice(0, newItems.length / 2);
    let itemDisplay = [];
    for (let i = 0; i < newItems.length; i++) {
      if (!skipCheck) {
        if (
          allItems[i].category == "home" &&
          homeRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "other" &&
          otherRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "electronics" &&
          electronicsRef.current.checked == false
        ) {
          continue;
        }
        if (
          allItems[i].category == "clothing" &&
          clothingRef.current.checked == false
        ) {
          continue;
        }
      }
      let itemName = newItems[i].name.toLowerCase();
      if (
        itemName.startsWith(searchRef.current.value.toLowerCase()) &&
        searchRef.current.value != ""
      ) {
        itemDisplay.push(allItems[i]);
      }
    }
    setDisplaySearch(itemDisplay);
    setDisplay(true);
  }

  function handleFilter() {
    setDisplayCategory((prev) => !prev);
  }

  return (
    <div>
      {currentUser ? (
        <div>
          <CommonStyles />
          <div>
            <div className="nav">
              <Navbar />
            </div>
            <div className="content py-2">
              <div className="d-flex justify-content-center">
                <div className="search-bar" style={{ width: "50%" }}>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">
                      <span
                        onClick={goToSearch}
                        className="material-symbols-outlined"
                      >
                        <span>search</span>
                      </span>
                    </InputGroup.Text>

                    <Form.Control
                      style={{ boxShadow: "none" }}
                      placeholder="search"
                      aria-label="search"
                      aria-describedby="basic-addon1"
                      ref={searchRef}
                      onChange={filterSearch}
                      onClick={filterSearch}
                      id="form-search-bar"
                    />
                    <InputGroup.Text id="basic-addon1">
                      <span
                        className="material-symbols-outlined"
                        onClick={handleFilter}
                        ref={categoryRef}
                      >
                        page_info
                      </span>
                    </InputGroup.Text>
                  </InputGroup>
                  <div style={{ position: "relative" }}>
                    {displayCategory ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "20px",
                          width: "300px",
                          height: "170px",
                          border: "red 1px solid",
                          padding: "20px",
                          zIndex: "5",
                        }}
                        ref={filterOptions}
                      >
                        <Form>
                          <Form.Check
                            type="checkbox"
                            label="clothing"
                            ref={clothingRef}
                            onClick={handleCheckBox}
                          />
                          <Form.Check
                            type="checkbox"
                            label="electronics"
                            ref={electronicsRef}
                            onClick={handleCheckBox}
                          />
                          <Form.Check
                            type="checkbox"
                            label="home"
                            ref={homeRef}
                            onClick={handleCheckBox}
                          />
                          <Form.Check
                            type="checkbox"
                            label="other"
                            ref={otherRef}
                            onClick={handleCheckBox}
                          />
                        </Form>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {displaySearch.length > 0 && display ? (
                      <div className="display-search row">
                        {displaySearch.map((item, index) => {
                          return (
                            <div className={`display-item col-12`} style={{ borderBottom : '0.5px solid black', marginTop : '20px' }}>
                              <Link
                                to={{
                                  pathname: "/iteminfo",
                                  search: `itemId=${item.docId}`,
                                }}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                <div className="search-items">
                                  <img
                                    src={item.pictureUrl}
                                    style={{ height: "100px", width: "100px", marginBottom : '20px' }}
                                    alt=""
                                  />
                                  <div
                                    className="mx-2"
                                    style={{ fontSize: "25px" }}
                                  >
                                    {item.name}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="new-items mx-5 my-5">
                <h2>What's new</h2>
                <div>
                  {chunkArray.length > 0 ? (
                    <OwlCarousel className="owl-theme" rewind margin={0} nav>
                      {chunkArray.map((array, index) => (
                        <>
                          {array.map((item) => {
                            return item.name ? (
                              <div className="item">
                                <Link
                                  to={{
                                    pathname: "/itemInfo",
                                    search: `itemId=${item.docId}`,
                                  }}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
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
                                  </Card>
                                </Link>
                              </div>
                            ) : (
                              <span key=""></span>
                            );
                          })}
                        </>
                      ))}
                    </OwlCarousel>
                  ) : (
                    <h4
                      style={{ width: "100%" }}
                      className="d-flex justify-content-center"
                    >
                      Nothing new at the moment
                    </h4>
                  )}
                </div>
                <div className="my-5">
                  <h4>What would you like to find?</h4>
                  <div className="row" >
                    <Link
                      to={{
                        pathname: "/categoryItems",
                        search: "category=home",
                      }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        width: "200px",
                      }}
                      className="mx-2"
                    >
                      <div
                        className="product-item"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <div>home</div>
                        <div className="my-3">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "5rem" }}
                          >
                            cottage
                          </span>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to={{
                        pathname: "/categoryItems",
                        search: "category=clothing",
                      }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        width: "200px",
                      }}
                      className="mx-2"
                    >
                      <div
                        className="product-item"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <div>clothing</div>
                        <div className="my-3">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "5rem" }}
                          >
                            apparel
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={{
                        pathname: "/categoryItems",
                        search: "category=electronics",
                      }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        width: "200px",
                      }}
                      className="mx-2"
                    >
                      <div
                        className="product-item"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <div>electronics</div>
                        <div className="my-3">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "5rem" }}
                          >
                            cable
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={{
                        pathname: "/categoryItems",
                        search: "category=other",
                      }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        width: "200px",
                      }}
                      className="mx-2"
                    >
                      <div
                        className="product-item"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <div>others</div>
                        <div className="my-3">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "5rem" }}
                          >
                            more_horiz
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
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
    </div>
  );
}

export default App;
