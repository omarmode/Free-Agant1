import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import HkBadge from "../../components/@hk-badge/@hk-badge";
import AudienceReviewChart from "./ChartData/AudienceReviewChart"; // استيراد الرسم البياني

const AudienceReviewCard = () => {
  // حالة لتخزين البيانات المستخرجة من الرسم البياني
  const [chartData, setChartData] = useState({
    users: 0,
    sessions: 0,
    bounceRate: 0,
    sessionDuration: "0m 0s",
  });

  // جلب البيانات من الرسم البياني عند تحميل المكون
  useEffect(() => {
    // بيانات محاكية مطابقة للرسم البياني
    const mockChartData = {
      users: 8800,
      sessions: 18200,
      bounceRate: 46.2,
      sessionDuration: "4m 24s",
    };

    // تحديث حالة البطاقة بالبيانات المحاكية
    setChartData(mockChartData);

    // لضبط تخطيط الرسم البياني بشكل صحيح
    window.dispatchEvent(new Event("resize"));
  }, []);

  return (
    <Card className="card-border mb-0 h-100">
      <Card.Header className="card-header-action">
        <h6>Audience Overview</h6>
        <div className="card-action-wrap">
          <ButtonGroup
            className="d-lg-flex d-none"
            aria-label="Basic outlined example"
          >
            <Button variant="outline-light" className="active">
              All
            </Button>
            <Button variant="outline-light">Sessions</Button>
            <Button variant="outline-light">Source</Button>
            <Button variant="outline-light">Referrals</Button>
          </ButtonGroup>
          <Form.Select className="d-lg-none d-flex">
            <option value={1}>All</option>
            <option value={2}>Sessions</option>
            <option value={3}>Source</option>
            <option value={4}>Referrals</option>
          </Form.Select>
        </div>
      </Card.Header>
      <Card.Body>
        <AudienceReviewChart /> {/* عرض الرسم البياني */}
        <div className="separator-full mt-5" />
        <div className="flex-grow-1 ms-lg-3">
          <Row>
            <Col xxl={3} sm={6} className="mb-3">
              <span className="d-block fw-medium fs-7">Users</span>
              <div className="d-flex align-items-center">
                <span className="d-block fs-4 fw-medium text-dark mb-0">
                  {chartData.users.toLocaleString()} {/* عرض عدد المستخدمين */}
                </span>
                <HkBadge bg="success" size="sm" soft className="ms-1">
                  <i className="bi bi-arrow-up" /> 7.5%
                </HkBadge>
              </div>
            </Col>
            <Col xxl={3} sm={6} className="mb-3">
              <span className="d-block fw-medium fs-7">Sessions</span>
              <div className="d-flex align-items-center">
                <span className="d-block fs-4 fw-medium text-dark mb-0">
                  {chartData.sessions.toLocaleString()} {/* عرض عدد الجلسات */}
                </span>
                <HkBadge bg="success" size="sm" soft className="ms-1">
                  <i className="bi bi-arrow-up" /> 7.2%
                </HkBadge>
              </div>
            </Col>
            <Col xxl={3} sm={6} className="mb-3">
              <span className="d-block fw-medium fs-7">Bounce rate</span>
              <div className="d-flex align-items-center">
                <span className="d-block fs-4 fw-medium text-dark mb-0">
                  {chartData.bounceRate}%
                </span>
                <HkBadge bg="danger" size="sm" soft className="ms-1">
                  <i className="bi bi-arrow-down" /> 0.2%
                </HkBadge>
              </div>
            </Col>
            <Col xxl={3} sm={6}>
              <span className="d-block fw-medium fs-7">Session duration</span>
              <div className="d-flex align-items-center">
                <span className="d-block fs-4 fw-medium text-dark mb-0">
                  {chartData.sessionDuration}
                </span>
                <HkBadge bg="success" size="sm" soft className="ms-1">
                  <i className="bi bi-arrow-up" /> 10.8%
                </HkBadge>
              </div>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AudienceReviewCard;
