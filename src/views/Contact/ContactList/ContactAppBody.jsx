import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table";
import axios from "axios";
import {
  Button,
  Col,
  Form,
  Row,
  Dropdown,
  Modal,
  Spinner,
} from "react-bootstrap";
import { BsThreeDotsVertical, BsEye, BsPencil, BsTrash } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";

const ContactAppBody = ({ fetchContacts, data }) => {
  const [searchTerm, setSearchTerm] = useState(""); // إدارة البحث
  const [showModal, setShowModal] = useState(false); // نافذة التأكيد
  const [selectedContact, setSelectedContact] = useState(null); // جهة الاتصال المحددة
  const [loading, setLoading] = useState(false); // حالة التحميل
  const history = useHistory(); // للتنقل بين الصفحات

  // **دالة لجلب التوكن المخزن في localStorage**
  const getToken = () => localStorage.getItem("token");

  // **دالة حذف جهة الاتصال**
  const deleteContact = async (id) => {
    setLoading(true); // تفعيل حالة التحميل
    try {
      const token = getToken();
      await axios.delete(
        `https://accounting.oncallwork.com/api/contact/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchContacts(); // تحديث البيانات بعد الحذف
      setShowModal(false); // إغلاق النافذة
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setLoading(false); // إيقاف حالة التحميل
    }
  };

  // **فتح نافذة التأكيد للحذف**
  const handleDeleteClick = (contact) => {
    setSelectedContact(contact); // تخزين جهة الاتصال
    setShowModal(true); // فتح النافذة
  };

  // **إعادة جلب البيانات عند تحميل الصفحة والتنقل**
  useEffect(() => {
    fetchContacts(); // جلب البيانات عند التحميل

    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        fetchContacts(); // إعادة الجلب عند العودة
      }
    });

    return () => unlisten(); // تنظيف عند إلغاء المكون
  }, [fetchContacts, history]);

  // **تعريف أعمدة الجدول**
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Organisation", accessor: "organisation" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "telephone" },
      { Header: "Address", accessor: "address" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <Button variant="link" className="p-0 me-2">
              <BsEye size={20} />
            </Button>
            <Link
              to={{
                pathname: "edit-contact",
                state: { client: row.original },
              }}
              className="btn btn-link p-0 me-2"
            >
              <BsPencil size={20} />
            </Link>
            <Button
              variant="link"
              className="p-0"
              onClick={() => handleDeleteClick(row.original)}
            >
              <BsTrash size={20} />
            </Button>
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="link" className="p-0 ms-2">
                <BsThreeDotsVertical size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/view/${row.original.id}`}>
                  View
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={{
                    pathname: "edit-contact",
                    state: { client: row.original },
                  }}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeleteClick(row.original)}>
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
    <div className="contact-body">
      <Row className="mb-3">
        <Col xs={7}>
          <Form.Control
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Col>
        <Col xs={5} className="text-end">
          <Button variant="primary">Export to CSV</Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : (
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
      )}

      {/* نافذة التأكيد للحذف */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteContact(selectedContact.id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactAppBody;
