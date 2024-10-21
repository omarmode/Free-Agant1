import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom"; // استخدم useLocation للوصول إلى الرابط
import axios from "axios";
import CommanFooter1 from "../CommanFooter1";

// Image
import logo from "../../../assets/img/logo-light.png";

const ResetPassword = () => {
  const [email, setEmail] = useState(""); // البريد الإلكتروني
  const [password, setPassword] = useState(""); // كلمة المرور الجديدة
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // تأكيد كلمة المرور
  const [token, setToken] = useState(""); // التوكن الخاص بإعادة التعيين
  const [message, setMessage] = useState(""); // لإظهار الرسائل
  const history = useHistory();
  const location = useLocation(); // للوصول إلى الرابط الحالي

  // استخراج التوكن من الرابط عند تحميل الصفحة
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token"); // استخراج التوكن
    if (resetToken) {
      setToken(resetToken);
    } else {
      setMessage("Invalid or missing reset token.");
    }
  }, [location]);

  // إرسال طلب إعادة تعيين كلمة المرور
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/reset-password",
        {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Password reset successful:", response.data);
      setMessage("Password reset successful! Redirecting to login...");

      // التوجيه إلى صفحة تسجيل الدخول بعد 3 ثوانٍ
      setTimeout(() => {
        history.push("/login-classic");
      }, 3000);
    } catch (error) {
      console.error("Password reset failed:", error.response?.data);
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to reset password."}`
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
                <Form className="w-100" onSubmit={handleResetPassword}>
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
                          <h4>Reset your Password</h4>
                          {message && (
                            <p
                              className={`text-${
                                message.includes("Error") ? "danger" : "success"
                              }`}
                            >
                              {message}
                            </p>
                          )}
                          <Row className="gx-3">
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </Col>
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>New Password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                            </Col>
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>Confirm New Password</Form.Label>
                              <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                  setPasswordConfirmation(e.target.value)
                                }
                                required
                              />
                            </Col>
                          </Row>
                          <Button
                            variant="primary"
                            type="submit"
                            className="btn-uppercase btn-block"
                          >
                            Reset Password
                          </Button>
                          <p className="p-xs mt-2 text-center">
                            <Link to="/login-classic">Back to Login</Link>
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

export default ResetPassword;
