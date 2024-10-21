import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Eye, EyeOff } from "react-feather";
import { Link, useHistory } from "react-router-dom";
import CommanFooter1 from "../../CommanFooter1";
import logo from "../../../../assets/img/logo-light.png";

const LoginClassic = () => {
  const [email, setEmail] = useState(""); // البريد
  const [password, setPassword] = useState(""); // كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); // لإظهار الرسائل
  const history = useHistory(); // للتوجيه إلى صفحة أخرى

  // دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    try {
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Login successful:", response.data);

      // تخزين التوكن في localStorage
      const token = response.data.data.token;
      setToken(token); // استدعاء الدالة لتخزين التوكن
      setMessage("Login successful!");

      // التوجيه إلى صفحة لوحة التحكم
      setTimeout(() => {
        history.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(
        `Error: ${
          error.response?.data?.message || "Login failed. Please try again."
        }`
      );
    }
  };

  // دالة لتخزين التوكن في localStorage
  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  return (
    <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
      <div className="hk-pg-body pt-0 pb-xl-0">
        <Container>
          <Row>
            <Col sm={10} className="position-relative mx-auto">
              <div className="auth-content py-8">
                <Form className="w-100" onSubmit={handleLogin}>
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
                      <Card className="card-lg card-border">
                        <Card.Body>
                          <h4 className="mb-4 text-center">
                            Sign in to your account
                          </h4>

                          {message && (
                            <p
                              className={`text-center ${
                                message.includes("Error")
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                            >
                              {message}
                            </p>
                          )}

                          <Row className="gx-3">
                            <Col as={Form.Group} lg={12} className="mb-3">
                              <div className="form-label-group">
                                <Form.Label>Email</Form.Label>
                              </div>
                              <Form.Control
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </Col>
                            <Col as={Form.Group} lg={12} className="mb-3">
                              <div className="form-label-group">
                                <Form.Label>Password</Form.Label>
                                <Link
                                  to="/auth/forgot-password"
                                  className="fs-7 fw-medium"
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                              <InputGroup className="password-check">
                                <span className="input-affix-wrapper">
                                  <Form.Control
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                    type={showPassword ? "text" : "password"}
                                    required
                                  />
                                  <Link
                                    to="#"
                                    className="input-suffix text-muted"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    <span className="feather-icon">
                                      {showPassword ? (
                                        <EyeOff className="form-icon" />
                                      ) : (
                                        <Eye className="form-icon" />
                                      )}
                                    </span>
                                  </Link>
                                </span>
                              </InputGroup>
                            </Col>
                          </Row>

                          <div className="d-flex justify-content-center">
                            <Form.Check
                              id="logged_in"
                              className="form-check-sm mb-3"
                            >
                              <Form.Check.Input
                                type="checkbox"
                                defaultChecked
                              />
                              <Form.Check.Label className="text-muted fs-7">
                                Keep me logged in
                              </Form.Check.Label>
                            </Form.Check>
                          </div>

                          <Button
                            variant="primary"
                            type="submit"
                            className="btn-uppercase btn-block"
                          >
                            Login
                          </Button>

                          <p className="p-xs mt-2 text-center">
                            New to Jmapack?{" "}
                            <Link to="signup-classic">
                              <u>Create new account</u>
                            </Link>
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
    </div>
  );
};

export default LoginClassic;
