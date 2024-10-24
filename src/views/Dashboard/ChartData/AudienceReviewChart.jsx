import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Form, Row, Col } from "react-bootstrap"; // استيراد العناصر من Bootstrap
import axios from "axios";

const CashflowChart = () => {
  const [series, setSeries] = useState([]); // بيانات السلاسل
  const [categories, setCategories] = useState([]); // بيانات الأشهر
  const [selectedPeriod, setSelectedPeriod] = useState("12"); // الفترة الافتراضية

  const options = {
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: "#646A71",
      fontFamily: "DM Sans",
    },
    grid: { borderColor: "#F4F5F6" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      labels: {
        style: { fontSize: "12px", fontFamily: "inherit" },
      },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", fontFamily: "inherit" },
        formatter: (value) => `${value} EGP`,
      },
      title: {
        text: "Cashflow (EGP)",
        style: { fontSize: "12px", fontFamily: "inherit" },
      },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "15px",
      labels: { colors: "#6f6f6f" },
      markers: { width: 8, height: 8, radius: 15 },
      itemMargin: { vertical: 5 },
    },
    colors: ["#007D88", "#25cba1", "#ebf3fe"],
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
  };

  // وظيفة لجلب البيانات من الـ API بناءً على الفترة المختارة
  const fetchData = async (period) => {
    try {
      const token = localStorage.getItem("token"); // جلب التوكن من localStorage
      const response = await axios.get(
        `https://accounting.oncallwork.com/api/cashflow/charts/${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data;

      // استخراج الفئات (months) والسلاسل (series) من البيانات
      const categories = data.map((item) => `${item.month} ${item.year}`);
      const incoming = data.map((item) => item.incoming);
      const outgoing = data.map((item) => item.outgoing);
      const balance = data.map((item) => item.balance);

      // تحديث الحالة بالسلاسل والفئات
      setCategories(categories);
      setSeries([
        { name: "Incoming", data: incoming },
        { name: "Outgoing", data: outgoing },
        { name: "Balance", data: balance },
      ]);
    } catch (error) {
      console.error("Failed to fetch cashflow data:", error);
    }
  };

  // استدعاء API عند تغيير الفترة المختارة أو عند التحميل الأولي
  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div>
      {/* اختيار الفترة باستخدام Select */}
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="12">last 12 month</option>
            <option value="6">last 6 month</option>
            <option value="3">last 3 month</option>
          </Form.Select>
        </Col>
      </Row>

      {/* عرض الرسم البياني */}
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={270}
      />
    </div>
  );
};

export default CashflowChart;
