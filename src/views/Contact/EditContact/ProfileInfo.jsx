import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";

const ProfileInfo = ({ show, hide, client, updateClientData }) => {
  // إدارة الحالة لكل حقل بيانات
  const [firstName, setFirstName] = useState(client.name || "");
  const [email, setEmail] = useState(client.email || "");
  const [phone, setPhone] = useState(client.telephone || "");
  const [address, setAddress] = useState(client.address || "");
  const [town, setTown] = useState(client.town || "");

  const token = `Bearer 2|scZqU5WtRRITVOPRkl15INi2xGWZOWHzMIHPgvlxb841da64`;

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `https://accounting.oncallwork.com/api/contact/update/${client.id}`,
        {
          name: firstName,
          email,
          telephone: phone,
          address,
          town,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update successful:", response.data);
      updateClientData(response.data); // تحديث البيانات في المكون الرئيسي
      hide(); // إغلاق المودال
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header>
        <Modal.Title as="h6">Profile Information</Modal.Title>
        <Button bsPrefix="btn-close" onClick={hide}>
          <span aria-hidden="true">×</span>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="gx-3">
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </Form.Group>
            </Col>
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
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="gx-3">
            <Col sm={12}>
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
        </Form>
      </Modal.Body>
      <Modal.Footer className="align-items-center">
        <Button variant="secondary" onClick={hide}>
          Discard
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileInfo;
