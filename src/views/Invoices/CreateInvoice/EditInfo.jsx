import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Alert } from "react-bootstrap";
import axios from "axios";

const EditInfo = ({ show, hide, invoiceId, refreshInvoices }) => {
  const [formData, setFormData] = useState({
    invoice_number: "",
    date: "",
    contact_id: "",
    business_id: "",
    status: "paid",
    activity: "sent",
    amount: "",
  });

  const [contacts, setContacts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // **جلب بيانات الفاتورة وContacts وBusinesses عند فتح النموذج**
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `https://accounting.oncallwork.com/api/invoice/show/${invoiceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const invoiceData = response.data.data;
        setFormData({
          invoice_number: invoiceData.invoice_number,
          date: invoiceData.date,
          contact_id: invoiceData.contact_id || "",
          business_id: invoiceData.business_id || "",
          status: invoiceData.status,
          activity: invoiceData.activity,
          amount: invoiceData.amount,
        });
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        setError("Failed to load invoice data.");
      }
    };

    const fetchData = async () => {
      try {
        const token = getToken();
        const [contactsRes, businessesRes] = await Promise.all([
          axios.get("https://accounting.oncallwork.com/api/contacts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://accounting.oncallwork.com/api/businesses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setContacts(contactsRes.data.data || []);
        setBusinesses(businessesRes.data.data.business || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load contacts or businesses.");
      }
    };

    if (invoiceId) {
      fetchInvoice();
      fetchData();
    }
  }, [invoiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const updatedData = {
        invoice_number: formData.invoice_number,
        date: formData.date,
        contact_id: parseInt(formData.contact_id),
        business_id: parseInt(formData.business_id),
        status: formData.status,
        activity: formData.activity,
        amount: parseFloat(formData.amount),
      };

      const response = await axios.post(
        `https://accounting.oncallwork.com/api/invoice/update/${invoiceId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Invoice updated successfully:", response.data);
      hide();
      refreshInvoices();
    } catch (error) {
      console.error("Failed to update invoice:", error);
      setError("Failed to update invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Body>
        <Button bsPrefix="btn-close" onClick={hide}>
          <span aria-hidden="true">×</span>
        </Button>
        <h5 className="mb-5">Edit Invoice</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Row className="gx-3">
            <Col sm={12} className="mb-3">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
              />
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </Col>

            <Col sm={12} className="mb-3">
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
            </Col>

            <Col sm={12} className="mb-3">
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
            </Col>

            <Col sm={12} className="mb-3">
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

            <Col sm={12} className="mb-3">
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

            <Col sm={12} className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={hide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Invoice"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditInfo;
