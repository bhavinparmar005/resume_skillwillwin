import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Modal } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import AdminNavbar from "../components/AdminNavbar";
import { Pencil, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import Swal from "sweetalert2";
import BlogImage from "../components/BlogImage"; // <-- import memoized image

const Home = () => {
  const nav = useNavigate();
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const buttons = [
    "Skill Will Win",
    "બહાદુર બેટી",
    "તૈયારી જીત કી",
    "મેં ભી ગાંધી",
    "લાઈફ લેશન ફ્રોમ લિજેન્ડ",
    "શાળા એક્ટિવિટી કેલેન્ડર",
  ];

  const getblogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allblog`);
      setBlog(res.data.data || []);
    } catch (error) {
      console.error("❌ Backend not running:", error.message);
      setBlog([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getblogs();
    const token = localStorage.getItem("adminToken");
    const admin = JSON.parse(localStorage.getItem("name"));
    if (!token && !admin) nav("/");
  }, []);

  const activeCategory = buttons[activeIndex];

const filteredBlogs = blog.filter((b) => {
  const title = b.title.normalize("NFC"); // Gujarati characters normalize karo
  const search = searchTerm.normalize("NFC");

  return (
    b.category === activeCategory &&
    title.toLocaleLowerCase("gu-IN").includes(search.toLocaleLowerCase("gu-IN"))
  );
});

  const handleReadMore = (blogItem) => {
    setSelectedBlog(blogItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const handledelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2c7864",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the blog.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/deleteblog/${id}`);
        getblogs();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: res.data.message || "Blog deleted successfully.",
          showConfirmButton: false,
          timer: 2000,
        });

        setShowModal(false);
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <>
      <AdminNavbar />

      {/* Header: Title + Search + Add Blog */}
      <Container className="mt-4">
        <Row className="align-items-center">
          <Col xs={12} lg={2} className="d-flex justify-content-start align-items-center mb-2 mb-lg-0">
            <h3 className="fw-semibold m-0">Blogs</h3>
          </Col>

          <Col xs={12} lg={7} className="d-flex justify-content-center mb-2 mb-lg-0">
            <Form className="w-100" style={{ maxWidth: "500px" }}>
              <Form.Control
                placeholder="Search blog by title..."
                className="shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  outline: "none",
                  border: "1px solid #2c7864",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 0.75rem",
                }}
              />
            </Form>
          </Col>

          <Col xs={12} lg={3} className="d-flex justify-content-center justify-content-lg-end align-items-center gap-2">
            <Button
              className="text-teal fw-semibold d-flex align-items-center justify-content-center"
              style={{
                minWidth: "140px",
                backgroundColor: "#2c7864",
                border: "none",
                color: "#ffffff",
                height: "42px",
                whiteSpace: "nowrap",
              }}
              onClick={() => nav("/addblog")}
            >
              <Plus className="me-2 mb-1" size={25} />
              Add Blog
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Category Buttons */}
      <Container className="mt-4">
        <Row className="g-3 justify-content-start">
          {buttons.map((btnName, idx) => (
            <Col xs={12} sm={6} md={4} lg={2} key={idx} className="d-flex justify-content-center">
              <Button
                className={`custom-btn pt-2 ${activeIndex === idx ? "active-btn" : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                {btnName}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Blog Cards */}
      <Container className="mt-4 mb-4">
        <Row className="g-4">
          {loading
            ? Array.from({ length: 9 }).map((_, idx) => (
              <Col xs={12} sm={6} md={4} key={idx}>
                <Card className="h-100 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden", border: "none" }}>
                  <Skeleton height={233} />
                  <Card.Body className="d-flex flex-column" style={{ backgroundColor: "#f9f9f9" }}>
                    <Skeleton height={20} width="80%" style={{ marginBottom: "10px" }} />
                    <Skeleton count={2} />
                    <Skeleton height={40} width={100} style={{ marginTop: "15px", borderRadius: "8px" }} />
                  </Card.Body>
                </Card>
              </Col>
            ))
            : filteredBlogs.length === 0
              ? (
                <Col xs={12}>
                  <p className="text-center mt-5">No blogs found for this category and search term.</p>
                </Col>
              )
              : filteredBlogs.map((item, idx) => (
                <Col xs={12} sm={6} md={4} key={idx}>
                  <Card
                    className="h-100 shadow-sm position-relative"
                    style={{ borderRadius: "20px", overflow: "hidden", border: "none" }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <BlogImage
                      url={item.image.url}
                      alt={item.title}
                      style={{ width: "100%", height: "233px", aspectRatio: "9 / 16" }}
                    />
                    <Card.Body className="d-flex flex-column" style={{ backgroundColor: "#f9f9f9" }}>
                      <Card.Title className="fw-bold" style={{ color: "#161616" }}>{item.title}</Card.Title>
                      <Card.Text
                        className="flex-grow-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#828282",
                        }}
                      >
                        {item.shortDescription}
                      </Card.Text>
                      <Button
                        className="Read_button"
                        variant="primary"
                        style={{
                          width: "100px",
                          height: "40px",
                          fontWeight: "600",
                          fontSize: "14px",
                          backgroundColor: "transparent",
                          color: "#161616",
                          border: "1px solid #2c7864",
                        }}
                        onClick={() => handleReadMore(item)}
                      >
                        Read More
                      </Button>

                      {hoveredCard === idx && (
                        <div className="position-absolute d-flex gap-2" style={{ top: "10px", right: "10px", zIndex: 10 }}>
                          <Button
                            onClick={() => nav("/editblog", { state: item })}
                            size="sm"
                            variant="warning"
                            style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f9f9f9", border: "none" }}
                          >
                            <Pencil size={14} />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f9f9f9", border: "none", color: "black" }}
                            onClick={() => handledelete(item._id)}
                          >
                            <Trash size={14} />
                            Delete
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
        </Row>
      </Container>

      {/* Modal for full blog */}
      {selectedBlog && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: "bold" }}>{selectedBlog.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BlogImage
              url={selectedBlog.image.url}
              alt={selectedBlog.title}
              style={{ width: "100%", borderRadius: "12px", marginBottom: "15px", height: "400px" }}
            />
            <br />
            {/* <p style={{ fontWeight: "bold" }}>{selectedBlog.shortDescription}</p> */}
            <div className="video-wrapper" dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />


          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              onClick={() => nav("/editblog", { state: selectedBlog })}
              variant="warning"
              style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#2c7864", border: "none", color: "#ffffff" }}
            >
              <Pencil size={14} />
              Edit
            </Button>
            <Button
              onClick={() => handledelete(selectedBlog._id)}
              size="sm"
              variant="danger"
              style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Trash size={14} />
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Home;
