import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom"; // استخدام useLocation و useHistory
import HkAvatarUploader from "../../../components/@hk-avatar-uploader/@hk-avatar-uploader";
import HkTooltip from "../../../components/@hk-tooltip/HkTooltip";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { Rating } from "react-simple-star-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBehance,
  faDropbox,
  faGithub,
  faGoogleDrive,
} from "@fortawesome/free-brands-svg-icons";
import {
  Activity,
  CheckSquare,
  Clock,
  Edit2,
  Edit3,
  Heart,
  Mail,
  Phone,
  Plus,
  Shield,
  Trash,
  Upload,
  Video,
  Zap,
} from "react-feather";

// Internal Components
import ProfileInfo from "./ProfileInfo";
import MoreInfo from "./MoreInfo";
import AddTags from "./AddTags";
import AddBio from "./AddBio";

// Image
import avatar2 from "../../../assets/img/avatar2.jpg";
import CombinedInfo from "./CombinedInfo";

const EditContactBody = () => {
  const location = useLocation(); // استقبال البيانات من الصفحة السابقة
  const history = useHistory(); // للعودة إلى الصفحة السابقة

  // استلام بيانات العميل من state أو عرض رسالة خطأ في حالة عدم وجودها
  const client = location.state?.client;

  if (!client) {
    return <p>No client data found! Please return to the contact list.</p>;
  }

  // إدارة الحالة لكل من المكونات القابلة للفتح (مثل ProfileInfo)
  const [profileInfo, setProfileInfo] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [addTags, setAddTags] = useState(false);
  const [addBio, setAddBio] = useState(false);

  return (
    <>
      <div className="contact-body contact-detail-body">
        <SimpleBar className="nicescroll-bar">
          <div className="d-flex flex-xxl-nowrap flex-wrap">
            <div className="contact-info w-xxl-30 w-100">
              <Dropdown className="action-btn">
                <Dropdown.Toggle variant="light">Action</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => history.push("/")}>
                    Back to List
                  </Dropdown.Item>
                  <Dropdown.Item>Another action</Dropdown.Item>
                  <Dropdown.Item>Something else here</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div className="text-center mt-5">
                <div className="mx-auto" style={{ width: 118 }}>
                  <HkAvatarUploader defaultImg={avatar2} />
                </div>
                <div className="cp-name text-truncate mt-3">{client.name}</div>
                <p>{client.organisation || "No organisation available"}</p>
                <Rating initialValue={3} readonly size="20" />
                <ul className="hk-list hk-list-sm justify-content-center mt-2">
                  <li>
                    <Button
                      variant="soft-primary"
                      className="btn-icon btn-rounded"
                    >
                      <Mail />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="soft-success"
                      className="btn-icon btn-rounded"
                    >
                      <Phone />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="soft-danger"
                      className="btn-icon btn-rounded"
                    >
                      <Video />
                    </Button>
                  </li>
                </ul>
              </div>

              <Card>
                <Card.Header>
                  <h6>Profile Information</h6>
                  <Button
                    variant="light"
                    size="xs"
                    className="btn-icon btn-rounded"
                    onClick={() => setProfileInfo(!profileInfo)}
                  >
                    <HkTooltip placement="top" title="Edit">
                      <Edit2 />
                    </HkTooltip>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <ul className="cp-info">
                    <li>
                      <span>Name</span>
                      <span>{client.name}</span>
                    </li>
                    <li>
                      <span>Email</span>
                      <span>{client.email || "N/A"}</span>
                    </li>
                    <li>
                      <span>Phone</span>
                      <span>{client.telephone}</span>
                    </li>
                    <li>
                      <span>Address</span>
                      <span>{client.address}</span>
                    </li>
                    <li>
                      <span>Country</span>
                      <span>{client.country}</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <div className="separator-full" />

              <Card>
                <Card.Header>
                  <h6>More Info</h6>
                  <Button
                    variant="light"
                    size="xs"
                    className="btn-icon btn-rounded"
                    onClick={() => setMoreInfo(!moreInfo)}
                  >
                    <HkTooltip placement="top" title="Edit">
                      <Edit2 />
                    </HkTooltip>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <ul className="cp-info">
                    <li>
                      <span>Organisation</span>
                      <span>{client.organisation || "N/A"}</span>
                    </li>
                    <li>
                      <span>Region</span>
                      <span>{client.region || "N/A"}</span>
                    </li>
                    <li>
                      <span>ZIP Code</span>
                      <span>{client.zip_code || "N/A"}</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <div className="separator-full" />

              <Card>
                <Card.Header>
                  <h6>Tags</h6>
                  <Button
                    variant="light"
                    size="xs"
                    className="btn-icon btn-rounded"
                    onClick={() => setAddTags(!addTags)}
                  >
                    <HkTooltip placement="top" title="Add Tags">
                      <Plus />
                    </HkTooltip>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Badge bg="soft-violet" className="me-1">
                    Collaboration
                  </Badge>
                  <Badge bg="soft-danger" className="me-1">
                    React Developer
                  </Badge>
                </Card.Body>
              </Card>
            </div>
          </div>
        </SimpleBar>

        {/* Modals */}
        <AddTags show={addTags} hide={() => setAddTags(false)} />
        <CombinedInfo
          show={profileInfo}
          hide={() => setProfileInfo(false)}
          client={client}
          updateClientData={(updatedClient) => console.log(updatedClient)}
        />

        {/* <MoreInfo
          show={moreInfo}
          hide={() => setMoreInfo(false)}
          //   client={client}
          //   updateClientData={(updatedClient) => console.log(updatedClient)}
        /> */}

        <AddBio show={addBio} hide={() => setAddBio(false)} />
      </div>
    </>
  );
};

export default EditContactBody;
