import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AddNewClient = ({ show, hide }) => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    invoice_number: "",
    date: "",
    contact_id: "",
    business_id: "", // إضافة business_id هنا
    status: "paid",
    activity: "sent",
    amount: "",
  });

  const [contacts, setContacts] = useState([]); // قائمة Contacts
  const [businesses, setBusinesses] = useState([]); // قائمة Businesses
  const [loading, setLoading] = useState(true); // حالة الانتظار
  const [toast, setToast] = useState({ show: false, message: "" }); // حالة Toast

  const getToken = () => localStorage.getItem("token");

  // جلب Contacts و Businesses عند فتح الـ Modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken(); // احصل على التوكن

        // جلب الـ Contacts
        const contactsResponse = await axios.get(
          "https://accounting.oncallwork.com/api/contacts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContacts(contactsResponse.data.data || []); // تخزين قائمة contacts

        // جلب الـ Businesses
        const businessesResponse = await axios.get(
          "https://accounting.oncallwork.com/api/businesses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Businesses Response:", businessesResponse.data);

        // تخزين قائمة الأعمال من data.business
        setBusinesses(businessesResponse.data.data.business || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setToast({ show: true, message: "Failed to load data!" });
      } finally {
        setLoading(false); // إنهاء حالة الانتظار
      }
    };

    if (show) fetchData(); // جلب البيانات عند فتح الـ Modal
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      await axios.post(
        "https://accounting.oncallwork.com/api/invoice/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast({ show: true, message: "Invoice created successfully!" });
      history.push("invoice-list");
      hide();
    } catch (error) {
      console.error("API Error:", error);
      setToast({ show: true, message: "Failed to create invoice!" });
    }
  };

  return (
    <>
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

              {/* قائمة Contacts */}
              <Col sm={12} as={Form.Group} className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  as="select"
                  name="contact_id"
                  value={formData.contact_id}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">-- Select Contact --</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}
                    </option>
                  ))}
                </Form.Control>
              </Col>

              {/* قائمة Businesses */}
              <Col sm={12} as={Form.Group} className="mb-3">
                <Form.Label>Business</Form.Label>
                <Form.Control
                  as="select"
                  name="business_id"
                  value={formData.business_id}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </Form.Control>
              </Col>

              <Col sm={12} as={Form.Group} className="mb-3">
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
              </Col>

              <Col sm={12} as={Form.Group} className="mb-3">
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ show: false, message: "" })}
        >
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AddNewClient;
