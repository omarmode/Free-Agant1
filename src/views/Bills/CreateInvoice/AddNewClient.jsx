import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Alert } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom"; // استيراد Redirect

const AddNewClient = ({ show, hide }) => {
  // **إدارة حالة الحقول**
  const [formData, setFormData] = useState({
    bill_number: "",
    date: "",
    contact_id: "",
    business_id: "", // إضافة business_id
    status: "paid",
    activity: "sent",
    amount: "",
  });

  const [contacts, setContacts] = useState([]); // حالة Contacts
  const [businesses, setBusinesses] = useState([]); // حالة Businesses
  const [loading, setLoading] = useState(false); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const [redirect, setRedirect] = useState(false); // حالة التنقل

  // **جلب التوكن من `localStorage`**
  const getToken = () => localStorage.getItem("token");

  // **جلب Contacts و Businesses من API عند فتح الـ Modal**
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        // جلب Contacts
        const contactsResponse = await axios.get(
          "https://accounting.oncallwork.com/api/contacts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContacts(contactsResponse.data.data || []);

        // جلب Businesses
        const businessesResponse = await axios.get(
          "https://accounting.oncallwork.com/api/businesses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBusinesses(businessesResponse.data.data.business || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load contacts or businesses.");
      }
    };

    if (show) fetchData(); // جلب البيانات عند فتح الـ Modal
  }, [show]);

  // **التعامل مع تغيير المدخلات**
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // **إرسال البيانات إلى API**
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      await axios.post(
        "https://accounting.oncallwork.com/api/bill/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Bill created successfully");
      hide();
      setRedirect(true); // التبديل إلى true للتنقل
    } catch (error) {
      console.error("Error creating bill:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to create bill.");
    } finally {
      setLoading(false);
    }
  };

  // **التحقق من حالة التنقل**
  if (redirect) {
    return <Redirect to="bills-list" />; // نقل المستخدم بعد الإضافة الناجحة
  }

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Body>
        <Button bsPrefix="btn-close" onClick={hide}>
          <span aria-hidden="true">×</span>
        </Button>
        <h5 className="mb-5">Create New Bill</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Row className="gx-3">
            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Bill Number</Form.Label>
                <Form.Control
                  type="text"
                  name="bill_number"
                  value={formData.bill_number}
                  onChange={handleChange}
                  placeholder="Enter Bill Number"
                />
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* قائمة Contacts */}
            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  as="select"
                  name="contact_id"
                  value={formData.contact_id}
                  onChange={handleChange}
                >
                  <option value="">-- Select Contact --</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            {/* قائمة Businesses */}
            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Business</Form.Label>
                <Form.Control
                  as="select"
                  name="business_id"
                  value={formData.business_id}
                  onChange={handleChange}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="draft">Draft</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Activity</Form.Label>
                <Form.Control
                  as="select"
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                >
                  <option value="sent">Sent</option>
                  <option value="done">Done</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hide} disabled={loading}>
          Discard
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Bill"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewClient;
