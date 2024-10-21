import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios"; // استيراد axios

const AddNewClient = ({ show, hide }) => {
  const [formData, setFormData] = useState({
    invoice_number: "",
    date: "",
    contact_id: "",
    status: "pending", // القيمة الافتراضية
    activity: "consultation", // القيمة الافتراضية
    amount: "",
  });

  const TOKEN = "2|scZqU5WtRRITVOPRkl15INi2xGWZOWHzMIHPgvlxb841da64"; // التوكن

  // تحديث القيم عند التغيير في المدخلات
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // دالة إرسال البيانات إلى API باستخدام axios
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع التحديث الافتراضي للنموذج

    console.log("Form Data Being Sent:", formData); // طباعة بيانات النموذج

    try {
      const response = await axios.post(
        "https://accounting.oncallwork.com/api/invoice/create",
        formData, // يتم إرسال formData مباشرة
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`, // إضافة التوكن في الترويسة
          },
        }
      );

      console.log("Response from API:", response.data); // طباعة استجابة الـ API
      alert("Invoice created successfully!"); // رسالة النجاح
      hide(); // إخفاء الـ Modal عند النجاح
    } catch (error) {
      if (error.response) {
        // إذا كان هناك استجابة خطأ من الخادم
        console.error("API Error:", error.response.data);
        alert(`Error: ${error.response.status} ${error.response.statusText}`);
      } else {
        console.error("Network Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Body>
        <Button bsPrefix="btn-close" onClick={hide}>
          <span aria-hidden="true">×</span>
        </Button>
        <h5 className="mb-5">Billed To</h5>
        <Form onSubmit={handleSubmit}>
          <Row className="gx-3">
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                required
              />
            </Col>
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Col>
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Contact ID</Form.Label>
              <Form.Control
                type="text"
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                required
              />
            </Col>
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="cancelled">unpaid</option>
              </Form.Control>
            </Col>
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                required
              />
            </Col>
            <Col sm={12} as={Form.Group} className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Modal.Footer>
            <Button variant="secondary" onClick={hide}>
              Discard
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewClient;
