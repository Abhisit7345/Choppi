import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link, redirect, useNavigate } from "react-router-dom"; // Import Link and useHistory

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const cpasswordRef = useRef();
  const nameRef = useRef();
  const [displayError, setDisplayError] = useState("");
  const { signup, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const loadingStyle = {
    backgroundColor: loading ? "grey" : "#0D6EFD",
  };
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    let error = "";
    setFirstVisit(false);

    if (passwordRef.current.value != cpasswordRef.current.value) {
      error += "Passwords do not match";
    }

    if (
      !passwordRef.current.value ||
      !cpasswordRef.current.value ||
      !emailRef.current.value ||
      !nameRef.current.value
    ) {
      error = error ? error + "|| Do not leave empty fields" : "Do not leave empty fields";
    }

    setLoading(true);
    await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value).then(
      (value) => {
        if (value) {
          error = error? error + `|| ${value}` : `${value}`
        }
      }
    );
    setLoading(false);
    console.log(error);
    if (!error) {
      navigate("/");
    } else {
      setDisplayError(error);
    }
  }

  useEffect(()=>{
    if(currentUser){
      navigate('/')
    }
  },[currentUser])

  return (
    <>
      <Card className="w-75 mx-auto my-2">
        <Card.Body>
          <h2 className="text-center mb-4">Sign up</h2>
          {!firstVisit && displayError && (
            <Alert variant="danger">
              {" "}
              {displayError.split("||").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
              ></Form.Control>
            </Form.Group>

            <Form.Group id="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                ref={nameRef}
              ></Form.Control>
            </Form.Group>

            <Form.Group id="password" className="my-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                ref={passwordRef}
              ></Form.Control>
            </Form.Group>

            <Form.Group id="cpassword" className="my-2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                ref={cpasswordRef}
              ></Form.Control>
            </Form.Group>
            <Button
              style={loadingStyle}
              disabled={loading}
              type="submit"
              className="w-100"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/signin">Log In</Link>
      </div>
    </>
  );
}
