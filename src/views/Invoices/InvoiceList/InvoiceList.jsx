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
// استيراد مكون التعديل
import EditInfo from "../CreateInvoice/EditInfo";

const InvoiceList = () => {
  const [data, setData] = useState([]);
  const [editInvoiceId, setEditInvoiceId] = useState(null); // لتحديد الفاتورة المراد تعديلها

  const getToken = () => localStorage.getItem("token");

  const fetchInvoices = async () => {
    try {
      const token = getToken();
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
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast.error("Failed to load invoices.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await axios.delete(
        `https://accounting.oncallwork.com/api/invoice/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Invoice deleted successfully!");
      fetchInvoices();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this invoice?",
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

  const columns = useMemo(
    () => [
      { Header: "Invoice Number", accessor: "invoice_number" },
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
                pathname: "invoice-preview",
                state: { id: row.original.id },
              }}
              className="btn btn-link p-0 me-2"
            >
              <BsEye size={20} />
            </Link>
            <Button
              variant="link"
              className="p-0 me-2"
              onClick={() => setEditInvoiceId(row.original.id)} // فتح النموذج
            >
              <BsPencil size={20} />
            </Button>
            <Button
              variant="link"
              className="p-0"
              onClick={() => confirmDelete(row.original.id)}
            >
              <BsTrash size={20} />
            </Button>
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
        <Col xs={5} className="text-end">
          <Form.Control
            size="sm"
            type="search"
            placeholder="Search"
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

      {editInvoiceId && (
        <EditInfo
          show={!!editInvoiceId}
          hide={() => setEditInvoiceId(null)}
          invoiceId={editInvoiceId}
          refreshInvoices={fetchInvoices}
        />
      )}
    </>
  );
};

export default InvoiceList;
