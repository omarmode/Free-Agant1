import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table";
import axios from "axios";
import { Button, Col, Form, Row, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical, BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import EditInfo from "../CreateInvoice/EditInfo"; // استيراد نموذج التعديل

const InvoiceList = () => {
  const [data, setData] = useState([]); // حالة البيانات
  const [searchTerm, setSearchTerm] = useState(""); // حالة البحث
  const [editBillId, setEditBillId] = useState(null); // حالة ID الفاتورة المراد تعديلها
  const [showEditModal, setShowEditModal] = useState(false); // حالة عرض النافذة

  // **جلب التوكن من `localStorage`**
  const getToken = () => localStorage.getItem("token");

  // **جلب الفواتير من API**
  const fetchInvoices = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "https://accounting.oncallwork.com/api/bills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
      toast.error("Failed to load bills.");
    }
  };

  useEffect(() => {
    fetchInvoices(); // جلب الفواتير عند تحميل الصفحة
  }, []);

  // **حذف الفاتورة**
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await axios.delete(
        `https://accounting.oncallwork.com/api/bill/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Bill deleted successfully!");
      fetchInvoices();
    } catch (error) {
      console.error("Failed to delete bill:", error);
      toast.error("Failed to delete bill. Please try again.");
    }
  };

  // **تأكيد الحذف**
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this bill?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion cancelled."),
        },
      ],
    });
  };

  // **تعريف الأعمدة**
  const columns = useMemo(
    () => [
      { Header: "Bill Number", accessor: "bill_number" },
      { Header: "Date", accessor: "date" },
      { Header: "Contact Name", accessor: "contact_name" },
      { Header: "Business Name", accessor: "business_name" },
      { Header: "Status", accessor: "status" },
      { Header: "Activity", accessor: "activity" },
      { Header: "Amount", accessor: "amount" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Link
              to={{
                pathname: "bills-preview",
                state: { id: row.original.id },
              }}
              className="btn btn-link p-0 me-2"
            >
              <BsEye size={20} /> {/* عرض */}
            </Link>
            <Button
              variant="link"
              className="p-0 me-2"
              onClick={() => {
                setEditBillId(row.original.id);
                setShowEditModal(true); // فتح نافذة التعديل
              }}
            >
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
                <Dropdown.Item
                  onClick={() => {
                    setEditBillId(row.original.id);
                    setShowEditModal(true); // فتح نافذة التعديل
                  }}
                >
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
      <ToastContainer />
      <Row className="mb-3">
        <Col xs={7}>
          <Form.Select size="sm">
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

      {/* مكون تعديل الفاتورة */}
      <EditInfo
        show={showEditModal}
        hide={() => setShowEditModal(false)}
        billId={editBillId}
        refreshBills={fetchInvoices}
      />
    </>
  );
};

export default InvoiceList;
