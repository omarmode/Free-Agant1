import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // استيراد useLocation
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const InvoicePreview = () => {
  const location = useLocation(); // استخدام useLocation لجلب الـ state
  const { id } = location.state || {}; // استخراج ID الفاتورة
  const [invoice, setInvoice] = useState(null); // حالة بيانات الفاتورة
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  // **جلب التوكن الديناميكي من `localStorage`**
  const getToken = () => localStorage.getItem("token");

  // **جلب بيانات الفاتورة من API**
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = getToken(); // استخدام التوكن المخزن
        const response = await axios.get(
          `https://accounting.oncallwork.com/api/invoice/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // استخدام التوكن الديناميكي
              "Content-Type": "application/json",
            },
          }
        );
        setInvoice(response.data.data); // تحديث حالة بيانات الفاتورة
      } catch (err) {
        setError("Failed to load invoice data"); // عرض رسالة خطأ عند الفشل
      } finally {
        setLoading(false); // إيقاف التحميل
      }
    };

    if (id) fetchInvoice(); // جلب البيانات فقط إذا كان هناك ID
  }, [id]);

  // **عرض حالة التحميل أو الخطأ إذا لزم الأمر**
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // **عرض تفاصيل الفاتورة إذا تم جلبها بنجاح**
  return (
    <Container>
      <h2>Invoice #{invoice.invoice_number}</h2>
      <p>Date: {invoice.date}</p>
      <p>Contact Name: {invoice.contact_name}</p>
      <p>Business Name: {invoice.business_name}</p> {/* عرض business_name */}
      <p>Status: {invoice.status}</p>
      <Table bordered>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invoice.activity}</td>
            <td>{invoice.amount}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default InvoicePreview;
