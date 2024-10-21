import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Container } from "react-bootstrap";
import axios from "axios";

const CreateNewContact = ({ show, close, onContactAdded }) => {
  const [contactData, setContactData] = useState({
    name: "",
    organisation: "",
    email: "",
    billing_email: "",
    telephone: "",
    mobile_number: "",
    address: "",
    town: "",
    region: "",
    zip_code: "",
    country: "algeria", // الحقل الافتراضي للدولة
    default_payment_terms: "",
    sales_tax_registration_number: "",
    invoice_language: "english", // بدء اللغة بحرف صغير
  });

  const [loading, setLoading] = useState(false); // حالة التحميل أثناء الإرسال
  const [error, setError] = useState(null); // حالة الخطأ أثناء الإرسال

  // **جلب التوكن المخزن في localStorage**
  const getToken = () => localStorage.getItem("token");

  // **التعامل مع تغيير المدخلات**
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  // **إرسال البيانات إلى API**
  const handleSubmit = async () => {
    setLoading(true); // بدء حالة التحميل
    setError(null); // إعادة تعيين الخطأ

    try {
      const token = getToken(); // جلب التوكن من localStorage
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/contact/create",
        contactData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // استخدام التوكن الديناميكي
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Contact created successfully:", response.data);

      // استدعاء دالة تحديث البيانات بعد الإضافة
      onContactAdded();

      // إغلاق الفورم بعد الإرسال الناجح
      close();
    } catch (error) {
      console.error("Failed to create contact:", error);
      setError("Failed to create contact. Please try again.");
    } finally {
      setLoading(false); // إيقاف حالة التحميل
    }
  };

  return (
    <Modal
      show={show}
      onHide={close}
      centered
      size="lg"
      className="add-new-contact"
    >
      <Modal.Body>
        <Button bsPrefix="btn-close" onClick={close}>
          <span aria-hidden="true">×</span>
        </Button>
        <h5 className="mb-5">Create New Contact</h5>
        {error && <p className="text-danger">{error}</p>}{" "}
        {/* عرض الخطأ عند الفشل */}
        <Form>
          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Contact Details</span>
          </div>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={contactData.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Organisation</Form.Label>
                <Form.Control
                  type="text"
                  name="organisation"
                  value={contactData.organisation}
                  onChange={handleChange}
                />
                <p>
                  Enter a name and/or an organisation name. Both are not
                  required.
                </p>
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Email</Form.Label>
                <Form.Control
                  type="email"
                  name="billing_email"
                  value={contactData.billing_email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telephone</Form.Label>
                <Form.Control
                  type="text"
                  name="telephone"
                  value={contactData.telephone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile_number"
                  value={contactData.mobile_number}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Invoicing Address</span>
          </div>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={contactData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Town</Form.Label>
                <Form.Control
                  type="text"
                  name="town"
                  value={contactData.town}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  name="region"
                  value={contactData.region}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip_code"
                  value={contactData.zip_code}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="country"
                  value={contactData.country}
                  onChange={handleChange}
                >
                  <option value="algeria">Algeria</option>
                  <option value="bahrain">Bahrain</option>
                  <option value="comoros">Comoros</option>
                  <option value="djibouti">Djibouti</option>
                  <option value="egypt">Egypt</option>
                  <option value="iraq">Iraq</option>
                  <option value="jordan">Jordan</option>
                  <option value="kuwait">Kuwait</option>
                  <option value="lebanon">Lebanon</option>
                  <option value="libya">Libya</option>
                  <option value="morocco">Morocco</option>
                  <option value="oman">Oman</option>
                  <option value="palestine">Palestine</option>
                  <option value="qatar">Qatar</option>
                  <option value="saudi arabia">Saudi Arabia</option>
                  <option value="somalia">Somalia</option>
                  <option value="sudan">Sudan</option>
                  <option value="syria">Syria</option>
                  <option value="tunisia">Tunisia</option>
                  <option value="united arab emirates">
                    United Arab Emirates
                  </option>
                  <option value="yemen">Yemen</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Invoice/Estimate Language</Form.Label>
            <Form.Select
              name="invoice_language"
              value={contactData.invoice_language}
              onChange={handleChange}
            >
              <option value="english">english</option>
              <option value="french">french</option>
              <option value="spanish">spanish</option>
              <option value="german">german</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="align-items-center">
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Contact"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateNewContact;
