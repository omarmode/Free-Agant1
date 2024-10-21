import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table";
import axios from "axios";
import { Button, Col, Form, Row, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical, BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // استيراد أنماط Toast
import { confirmAlert } from "react-confirm-alert"; // استيراد نافذة التأكيد
import "react-confirm-alert/src/react-confirm-alert.css"; // استيراد أنماط نافذة التأكيد

const InvoiceList = () => {
  const [data, setData] = useState([]); // حالة البيانات
  const [searchTerm, setSearchTerm] = useState(""); // حالة البحث

  // **جلب التوكن من `localStorage` بعد تسجيل الدخول**
  const getToken = () => localStorage.getItem("token");

  // **جلب الفواتير من API**
  const fetchInvoices = async () => {
    try {
      const token = getToken(); // استخدام التوكن المخزن
      const response = await axios.get(
        "https://accounting.oncallwork.com/api/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setData(response.data.data); // تحديث حالة البيانات
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast.error("Failed to load invoices.");
    }
  };

  useEffect(() => {
    fetchInvoices(); // جلب الفواتير عند تحميل الصفحة
  }, []);

  // **حذف الفاتورة**
  const handleDelete = async (id) => {
    try {
      const token = getToken(); // جلب التوكن الديناميكي
      await axios.delete(
        `https://accounting.oncallwork.com/api/invoice/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Invoice deleted successfully!"); // رسالة نجاح
      fetchInvoices(); // تحديث البيانات بعد الحذف
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  // **تأكيد الحذف باستخدام نافذة تأكيد**
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this invoice?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id), // تنفيذ الحذف عند التأكيد
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion cancelled."), // إلغاء الحذف
        },
      ],
    });
  };

  // **تعريف الأعمدة لعرض البيانات في الجدول**
  const columns = useMemo(
    () => [
      { Header: "Invoice Number", accessor: "invoice_number" },
      { Header: "Date", accessor: "date" },
      { Header: "Contact Name", accessor: "contact_name" },
      { Header: "Status", accessor: "status" },
      { Header: "Activity", accessor: "activity" },
      { Header: "Amount", accessor: "amount" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Link
              to={{
                pathname: "invoice-preview",
                state: { id: row.original.id },
              }}
              className="btn btn-link p-0 me-2"
            >
              <BsEye size={20} /> {/* عرض */}
            </Link>
            <Button variant="link" className="p-0 me-2">
              <BsPencil size={20} /> {/* تعديل */}
            </Button>
            <Button
              variant="link"
              className="p-0"
              onClick={() => confirmDelete(row.original.id)}
            >
              <BsTrash size={20} /> {/* حذف */}
            </Button>
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="link" className="p-0 ms-2">
                <BsThreeDotsVertical size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href={`/edit/${row.original.id}`}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => confirmDelete(row.original.id)}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ),
      },
    ],
    []
  );

  // **إعدادات الجدول باستخدام react-table**
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination);

  return (
    <>
      <ToastContainer /> {/* مكون Toast لعرض الإشعارات */}
      <Row className="mb-3">
        <Col xs={7}>
          <Form.Select size="sm" className="d-flex align-items-center w-130p">
            <option value={1}>Export to CSV</option>
            <option value={2}>Export to PDF</option>
            <option value={3}>Send Message</option>
            <option value={4}>Delegate Access</option>
          </Form.Select>
        </Col>
        <Col xs={5} className="text-end">
          <Form.Control
            size="sm"
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Col>
      </Row>
      <table
        {...getTableProps()}
        className="table table-striped table-bordered"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="dataTables_paginate paging_simple_numbers">
        <ul className="pagination custom-pagination pagination-simple m-0">
          <li className="paginate_button page-item previous disabled">
            <Link to="#" className="page-link">
              <i className="ri-arrow-left-s-line" />
            </Link>
          </li>
          <li className="paginate_button page-item next disabled">
            <Link to="#" className="page-link">
              <i className="ri-arrow-right-s-line" />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default InvoiceList;
