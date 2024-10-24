import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import { MoreVertical } from "react-feather";
import HkBadge from "../../components/@hk-badge/@hk-badge";
import ReturningCustomerChart from "./ChartData/ReturningCustomerChart"; // استيراد الرسم البياني

const ReturningCustomersCard = () => {
  const [incoming, setIncoming] = useState(0); // حالة للقيمة المحاكية الواردة
  const [outgoing, setOutgoing] = useState(0); // حالة للقيمة المحاكية للمصروفات

  // جلب القيم من البيانات المحاكية (مثل Incoming و Outgoing من الرسم البياني)
  useEffect(() => {
    // محاكاة البيانات التي يتم استخدامها في الرسم البياني
    const mockData = {
      incoming: 243.5, // نفس القيمة المحاكية لبطاقة "Organic"
      outgoing: 1469.0, // نفس القيمة المحاكية لبطاقة "Marketing"
    };

    // تعيين القيم في الحالة
    setIncoming(mockData.incoming);
    setOutgoing(mockData.outgoing);
  }, []);

  return (
    <Card className="card-border mb-0 h-100">
      <Card.Header className="card-header-action">
        <h6>Returning Customers</h6>
        <div className="card-action-wrap">
          <Dropdown className="inline-block">
            <Dropdown.Toggle
              variant="transparent"
              className="btn-icon btn-rounded btn-flush-dark flush-soft-hover no-caret"
              id="dropdown-basic1"
            >
              <span className="icon">
                <span className="feather-icon">
                  <MoreVertical />
                </span>
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Something else here
              </Dropdown.Item>
              <Dropdown.Divider as="div" />
              <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body className="text-center">
        <ReturningCustomerChart /> {/* عرض الرسم البياني */}
        <div className="d-inline-block mt-4">
          <div className="mb-4">
            <span className="d-block badge-status lh-1">
              <HkBadge
                bg="primary"
                className="badge-indicator badge-indicator-nobdr d-inline-block"
              />
              <span className="badge-label d-inline-block">Organic</span>
            </span>
            {/* عرض قيمة Incoming المحاكية */}
            <span className="d-block text-dark fs-5 fw-medium mb-0 mt-1">
              {incoming} EGP
            </span>
          </div>
          <div>
            <span className="badge-status lh-1">
              <HkBadge
                bg="primary-light-2"
                className="badge-indicator badge-indicator-nobdr"
              />
              <span className="badge-label">Marketing</span>
            </span>
            {/* عرض قيمة Outgoing المحاكية */}
            <span className="d-block text-dark fs-5 fw-medium mb-0 mt-1">
              {outgoing} EGP
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReturningCustomersCard;
