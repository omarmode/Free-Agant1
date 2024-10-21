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
import { Link, useHistory } from "react-router-dom";
import CommanFooter1 from "../../CommanFooter1";
import logo from "../../../../assets/img/logo-light.png";

const SignupClassic = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/register",
        {
          name: formData.name,
          email: formData.email,
          business_name: formData.businessName,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Registration successful:", response.data);
      setMessage("Account created successfully!");

      // إعادة التوجيه إلى صفحة تسجيل الدخول بعد النجاح
      setTimeout(() => {
        history.push("login-classic");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage(
        `Error: ${error.response?.data?.message || "Registration failed"}`
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
                <Form className="w-100" onSubmit={handleSubmit}>
                  <Row>
                    <Col xxl={5} xl={7} lg={8} sm={10} className="mx-auto">
                      <div className="text-center mb-7">
                        <Link className="navbar-brand me-0" to="/">
                          <img
                            className="brand-img d-inline-block"
                            src={logo}
                            alt="brand"
                          />
                        </Link>
                      </div>
                      <Card className="card-border">
                        <Card.Body>
                          <h4 className="text-center mb-0">
                            Sign Up to Jampack
                          </h4>
                          <p className="p-xs mt-2 mb-4 text-center">
                            Already a member?{" "}
                            <Link to="login-classic">
                              <u>Sign In</u>
                            </Link>
                          </p>

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
                            <Col lg={6} as={Form.Group} className="mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                name="name"
                                placeholder="Enter your name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                              />
                            </Col>
                            <Col lg={6} as={Form.Group} className="mb-3">
                              <Form.Label>Business Name</Form.Label>
                              <Form.Control
                                name="businessName"
                                placeholder="Enter your business name"
                                type="text"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                              />
                            </Col>
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </Col>
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>Password</Form.Label>
                              <InputGroup className="password-check">
                                <Form.Control
                                  name="password"
                                  placeholder="6+ characters"
                                  type={showPassword ? "text" : "password"}
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                                <Link
                                  to="#"
                                  className="input-suffix text-primary text-uppercase fs-8 fw-medium"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? "Hide" : "Show"}
                                </Link>
                              </InputGroup>
                            </Col>
                            <Col lg={12} as={Form.Group} className="mb-3">
                              <Form.Label>Confirm Password</Form.Label>
                              <InputGroup className="password-check">
                                <Form.Control
                                  name="passwordConfirmation"
                                  placeholder="Confirm your password"
                                  type={showPassword ? "text" : "password"}
                                  value={formData.passwordConfirmation}
                                  onChange={handleChange}
                                  required
                                />
                                <Link
                                  to="#"
                                  className="input-suffix text-primary text-uppercase fs-8 fw-medium"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? "Hide" : "Show"}
                                </Link>
                              </InputGroup>
                            </Col>
                          </Row>

                          <Form.Check
                            id="logged_in"
                            className="form-check-sm mb-3"
                          >
                            <Form.Check.Input type="checkbox" defaultChecked />
                            <Form.Check.Label className="text-muted fs-7">
                              By creating an account you agree with our{" "}
                              <Link to="#">Terms of use</Link> and{" "}
                              <Link to="#">Privacy policy</Link>.
                            </Form.Check.Label>
                          </Form.Check>

                          <Button
                            variant="primary"
                            className="btn-rounded btn-uppercase btn-block"
                            type="submit"
                          >
                            Create account
                          </Button>
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

export default SignupClassic;
