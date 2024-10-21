import React, { useState, useCallback } from "react";
import ContactAppSidebar from "../ContactAppSidebar";
import ContactAppHeader from "../ContactAppHeader";
import ContactAppBody from "./ContactAppBody";
import CreateNewContact from "../CreateNewContact"; // استيراد الفورم
import classNames from "classnames";
import axios from "axios";

const ContactList = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]); // حالة لتخزين بيانات الجدول

  // **دالة لجلب التوكن المخزن في localStorage**
  const getToken = () => localStorage.getItem("token");

  // **دالة جلب بيانات جهات الاتصال من الـ API**
  const fetchContacts = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "https://accounting.oncallwork.com/api/contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data); // تحديث البيانات في الحالة
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, []);

  // فتح وإغلاق الفورم
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <div className="hk-pg-body py-0">
      <div
        className={classNames("contactapp-wrap", {
          "contactapp-sidebar-toggle": showSidebar,
        })}
      >
        <ContactAppSidebar />
        <div className="contactapp-content">
          <div className="contactapp-detail-wrap">
            <ContactAppHeader
              toggleSidebar={() => setShowSidebar(!showSidebar)}
              show={showSidebar}
              openForm={openForm}
            />
            <ContactAppBody data={data} fetchContacts={fetchContacts} />{" "}
            {/* تمرير البيانات ودالة التحديث */}
            <CreateNewContact
              show={showForm}
              close={closeForm}
              onContactAdded={fetchContacts} // استدعاء التحديث بعد الإضافة
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
