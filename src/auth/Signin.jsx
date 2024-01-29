import React from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/signin.css";

export default function Signin() {
  const { signin, signinUsingGoogle, currentUser } = useAuth();
  const [displayError, setDisplayError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const loadingStyle = {
    backgroundColor: loading ? "grey" : "#0D6EFD",
  };
  const navigate = useNavigate();

  async function googleSignIn() {
    console.log('test')
    const result = await signinUsingGoogle()
    console.log(result)
    
    if(currentUser){
      navigate('/')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let error = "";

    if (!emailRef.current.value || !passwordRef.current.value) {
      error += "Do not leave empty fields";
    }

    setLoading(true);

    await signin(emailRef.current.value, passwordRef.current.value).then(
      (value) => {
        console.log(value);
        if (typeof value === "object") {
          console.log(value);
        } else {
          error = error ? error + ` || ${value}` : `${value}`;
        }
      }
    );
    setLoading(false);
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

  useEffect(() => {
    if (displayError) {
      const timeoutId = setTimeout(() => {
        setDisplayError(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [displayError]);

  return (
    <div>
      <Card className="w-75 mx-auto my-2">
        <Card.Body>
          <h2 className="text-center mb-4">Sign in</h2>
  
          {displayError && <Alert variant="danger" style={{ backgroundColor:'rgb(255, 0, 0)' }}>    {displayError.split('||').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
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

            <Button
              style={loadingStyle}
              type="submit"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-75 text-center mx-auto">
        <div className="google-signin" onClick={googleSignIn}>
          Sign in with google?
        </div>
        Dont have an account yet? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
