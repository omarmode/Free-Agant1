import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // استيراد useLocation لجلب id الفاتورة
import axios from "axios";
import SimpleBar from "simplebar-react";
import { Col, Container, Row, Table, Alert, Spinner } from "react-bootstrap";

// استيراد الشعار
import logo from "../../../assets/img/logo-light.png";

const BillsPreview = () => {
  const location = useLocation(); // استخراج state القادم من صفحة InvoiceList
  const { id } = location.state || {}; // استخراج ID الفاتورة
  const [bill, setBill] = useState(null); // حالة بيانات الفاتورة
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  // **جلب التوكن الديناميكي من `localStorage`**
  const getToken = () => localStorage.getItem("token");

  // **جلب بيانات الفاتورة من API**
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const token = getToken(); // استخدام التوكن الديناميكي
        const response = await axios.get(
          `https://accounting.oncallwork.com/api/bill/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBill(response.data.data); // تخزين بيانات الفاتورة
      } catch (err) {
        console.error("Failed to load bill:", err);
        setError("Failed to load bill data. Please try again.");
      } finally {
        setLoading(false); // إيقاف حالة التحميل
      }
    };

    if (id) fetchBill(); // جلب البيانات فقط إذا كان هناك ID
  }, [id]);

  // **عرض حالة التحميل أو الخطأ إن وجد**
  if (loading)
    return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="invoice-body">
      <SimpleBar className="nicescroll-bar">
        <Container>
          <div className="template-invoice-wrap mt-xxl-5 p-md-5 p-3">
            {/* Header */}
            <Row>
              <Col lg={3} md={5} className="order-md-0 order-1">
                <img src={logo} alt="logo" />
              </Col>
              <Col
                lg={4}
                md={4}
                className="offset-lg-5 offset-md-3 mb-md-0 mb-2"
              >
                <h2 className="d-flex justify-content-md-end mb-0">
                  Bill Details
                </h2>
              </Col>
            </Row>

            {/* Bill Information */}
            <Row className="mt-4">
              <Col md={4}>
                <div className="address-wrap">
                  <h6>Billed From</h6>
                  <p>Hencework</p>
                  <p>4747, Pearl Street</p>
                  <p>Washington DC 42341</p>
                  <p>jampack_01@hencework.com</p>
                </div>
              </Col>
              <Col md={5} className="offset-md-3">
                <div className="d-flex justify-content-md-end">
                  <div className="text-md-end me-3">
                    <div className="mb-1">Bill No:</div>
                    <div className="mb-1">Date:</div>
                    <div className="mb-1">Status:</div>
                    <div>Amount:</div>
                  </div>
                  <div className="text-dark">
                    <div className="mb-1">{bill.bill_number}</div>
                    <div className="mb-1">{bill.date}</div>
                    <div className="mb-1">{bill.status}</div>
                    <div>${bill.amount}</div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="separator separator-light mt-4" />

            {/* Billed To */}
            <Row className="mt-4">
              <Col md={4}>
                <h6 className="text-uppercase fs-7 mb-2">Billed To</h6>
                <div className="Billto-wrap">
                  <h6>{bill.contact_name}</h6>
                  <p>Customer Address Line 1</p>
                  <p>Customer Address Line 2</p>
                  <p>Customer Email: example@mail.com</p>
                </div>
              </Col>
            </Row>

            {/* Activity Table */}
            <div className="table-wrap mt-6">
              <Table bordered responsive>
                <thead className="thead-primary">
                  <tr>
                    <th>Activity</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{bill.activity}</td>
                    <td className="text-end">${bill.amount}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            {/* Footer */}
            <Row className="mt-3">
              <Col lg={5}>
                <h6>Note to Client</h6>
                <p>
                  Thank you for your business. Please make the payment within 15
                  days to avoid any late fees.
                </p>
              </Col>
              <Col lg={7} className="text-lg-end">
                <h5>Katherine Zeta Jones</h5>
                <p>Co-founder, Hencework</p>
              </Col>
            </Row>

            <div className="separator separator-light mt-7" />

            {/* Terms and Conditions */}
            <Row>
              <Col md={12}>
                <h6>Terms & Conditions</h6>
                <ol className="ps-3">
                  <li>
                    Please pay within 15 days from the bill date. Overdue
                    interest @ 14% will be charged.
                  </li>
                  <li>Please quote the bill number when remitting funds.</li>
                </ol>
              </Col>
            </Row>
          </div>
        </Container>
      </SimpleBar>
    </div>
  );
};

export default BillsPreview;
