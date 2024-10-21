import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
// import CommanFooter1 from "../../ResetPassword/";

// Image
import logo from "../../../../assets/img/logo-light.png";
import CommanFooter1 from "../../CommanFooter1";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // البريد الإلكتروني
  const [message, setMessage] = useState(""); // لإظهار الرسائل

  // إرسال طلب إعادة كلمة المرور
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Forgot password request successful:", response.data);
      setMessage("Check your email for the reset password link.");
    } catch (error) {
      console.error("Forgot password request failed:", error.response?.data);
      setMessage(
        `Error: ${
          error.response?.data?.message || "Failed to send reset link."
        }`
      );
    }
  };

  return (
    <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
      <div className="hk-pg-body pt-0 pb-xl-0">
        <Container>
          <Row>
            <Col sm={10} className="position-relative mx-auto">
              <div className="auth-content py-8">
                <Form className="w-100" onSubmit={handleForgotPassword}>
                  <Row>
                    <Col lg={5} md={7} sm={10} className="mx-auto">
                      <div className="text-center mb-7">
                        <Link to="/" className="navbar-brand me-0">
                          <img
                            className="brand-img d-inline-block"
                            src={logo}
                            alt="brand"
                          />
                        </Link>
                      </div>
                      <Card className="card-flush">
                        <Card.Body className="text-center">
                          <h4>Forgot your Password?</h4>
                          <p className="mb-4">
                            Enter your email and we will send you a link to
                            reset your password.
                          </p>

                          {message && (
                            <p
                              className={`text-${
                                message.includes("Error") ? "danger" : "success"
                              }`}
                            >
                              {message}
                            </p>
                          )}

                          <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </Form.Group>

                          <Button
                            variant="primary"
                            type="submit"
                            className="btn-uppercase btn-block"
                          >
                            Send Reset Link
                          </Button>

                          <p className="p-xs mt-2 text-center">
                            <Link to="login-classic">Back to Login</Link>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <CommanFooter1 />
      {/* // <CommanFooter1 /> */}
    </div>
  );
};

export default ForgotPassword;
