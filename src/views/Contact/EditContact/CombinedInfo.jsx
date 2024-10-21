import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom"; // استيراد useHistory للتنقل
import axios from "axios";

const CombinedInfo = ({ show, hide, client, updateClientData }) => {
  const history = useHistory(); // للتنقل إلى صفحة contact-list بعد النجاح

  // إدارة الحقول المدخلة
  const [firstName, setFirstName] = useState(client.name || "");
  const [organisation, setOrganisation] = useState(client.organisation || "");
  const [email, setEmail] = useState(client.email || "");
  const [billingEmail, setBillingEmail] = useState(client.billing_email || "");
  const [phone, setPhone] = useState(client.telephone || "");
  const [mobileNumber, setMobileNumber] = useState(client.mobile_number || "");
  const [address, setAddress] = useState(client.address || "");
  const [town, setTown] = useState(client.town || "");
  const [region, setRegion] = useState(client.region || "");
  const [zipCode, setZipCode] = useState(client.zip_code || "");
  const [country, setCountry] = useState(client.country || "");
  const [paymentTerms, setPaymentTerms] = useState(
    client.default_payment_terms || ""
  );
  const [taxNumber, setTaxNumber] = useState(
    client.sales_tax_registration_number || ""
  );
  const [language, setLanguage] = useState(client.invoice_language || "");
  const [tenantId, setTenantId] = useState(client.tenant_id || "");

  // إدارة حالة الخطأ والتحميل
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلب التوكن من `localStorage`
  const getToken = () => localStorage.getItem("token");

  // دالة التحديث باستخدام API
  const handleUpdate = async () => {
    setError(null); // إعادة تعيين الخطأ عند المحاولة مرة أخرى
    setLoading(true); // بدء حالة التحميل

    try {
      const token = getToken();
      const data = {
        name: firstName,
        organisation: organisation || null,
        email,
        billing_email: billingEmail || null,
        telephone: phone,
        mobile_number: mobileNumber,
        address,
        town,
        region,
        zip_code: zipCode,
        country,
        default_payment_terms: paymentTerms,
        sales_tax_registration_number: taxNumber,
        invoice_language: language,
        tenant_id: tenantId || 1,
      };

      console.log("Data being sent:", data); // طباعة البيانات في الـ console

      const response = await axios.post(
        `https://accounting.oncallwork.com/api/contact/update/${client.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update successful:", response.data);
      updateClientData(response.data); // تحديث بيانات العميل في الواجهة

      // الانتقال إلى صفحة contact-list بعد نجاح التحديث
      history.push("contact-list");
    } catch (error) {
      console.error("Error updating client:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to update contact.");
    } finally {
      setLoading(false); // إيقاف حالة التحميل
    }
  };

  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header>
        <Modal.Title as="h6">Edit Contact Information</Modal.Title>
        <Button bsPrefix="btn-close" onClick={hide}>
          <span aria-hidden="true">×</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        {/* عرض رسالة الخطأ إن وجدت */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Name"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Organisation</Form.Label>
                <Form.Control
                  type="text"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Organisation"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Billing Email</Form.Label>
                <Form.Control
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="Billing Email"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Mobile Number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Town</Form.Label>
                <Form.Control
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="Town"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* باقي الحقول */}
          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Region</Form.Label>
                <Form.Control
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Region"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="ZIP Code"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Discard
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CombinedInfo;
