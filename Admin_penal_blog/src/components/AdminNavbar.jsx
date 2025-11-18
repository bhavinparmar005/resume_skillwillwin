import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Navbar,
    Nav,
    Container,
    Button,
    Offcanvas,
    NavDropdown,
    Modal,
    Form,
    Spinner,
    InputGroup,
} from "react-bootstrap";


import { PersonCircle, Eye, EyeSlash, Lock } from "react-bootstrap-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminNavbar = () => {
    let nav = useNavigate()
    const location = useLocation();
    const [adminname, setAdminname] = useState("" || "admin")
    const [showModal, setShowModal] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const storedName = JSON.parse(localStorage.getItem("name")); // "name" string key
        setAdminname(storedName);
    }, []);

    // handel Logout 
    const handalLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2c7864",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                // 🔹 Clear localStorage
                localStorage.removeItem("adminToken");
                localStorage.removeItem("name");

                // 🔹 Success alert with progress bar
                Swal.fire({
                    icon: "success",
                    title: "Logged out",
                    timer: 1500,               // 1.5 second
                    showConfirmButton: false,
                    timerProgressBar: true     // 🔹 Progress bar
                }).then(() => {
                    // 🔹 Navigate to login page after alert closes
                    nav("/"); // ya jahan aapka login page ho
                });
            }
        });
    };


    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Password visibility state
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    // Modal open/close handlers
    const handleShow = () => {
        setShowModal(true);
        setShowOffcanvas(false); // 🔹 Offcanvas close when modal opens
    };
    const handleClose = () => {
        setShowModal(false);

        // 🔹 Close hone par input fields reset ho jaye
        setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        // 🔹 Password visibility bhi reset ho jaye
        setShowPassword({
            oldPassword: false,
            newPassword: false,
            confirmPassword: false,
        });
    };


    // Offcanvas open/close handlers
    const handleOffcanvasClose = () => setShowOffcanvas(false);
    const handleOffcanvasShow = () => setShowOffcanvas(true);

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Form submit
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Mismatch",
                text: "New password and confirm password do not match ❌",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            });
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            return;
        }

        setLoading(true);
        try {
            const admintoken = localStorage.getItem("adminToken");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/adminresetpassword`,
                {
                    oldPassword: passwordData.oldPassword,   // ✅ fix here
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }
            );

            setLoading(false);

            Swal.fire({
                icon: "success",
                title: "Password Changed ✅",
                text: res.data.message || "Password updated successfully",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {

                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                 // 🔹 Clear localStorage
                localStorage.removeItem("adminToken");
                localStorage.removeItem("name");

                nav("/")
            })
         

        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong ❌",
                timer: 2000,            // ⏳ 2 seconds
                showConfirmButton: false,
                timerProgressBar: true  // 🔹 progress bar
            });
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
    };


    return (
        <>
            <Navbar expand="lg" variant="dark" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #0000001f", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                <Container  >
                    {/* Left - Logo */}
                    <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            width="180"
                            height="40"
                            className="d-inline-block align-top me-2"
                        />
                    </Navbar.Brand>

                    {/* Hamburger Toggle */}
                    <Navbar.Toggle
                        aria-controls="offcanvasNavbar"
                        onClick={handleOffcanvasShow}
                        style={{ backgroundColor: "#2c7864", color: "#ffffff" }}
                    />

                    {/* Offcanvas for small screens */}
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        show={showOffcanvas}
                        onHide={handleOffcanvasClose}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel">
                                Side Menu
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {/* Center - Buttons */}
                            <Nav className="flex-grow-1 justify-content-center gap-5 mt-2">
                                <span

                                    style={{
                                        cursor: "pointer",
                                        fontSize: "22px",
                                        color: location.pathname === "/home" ? "#161616e0" : "#555353ff",
                                        borderBottom: location.pathname === "/home" ? "3px solid #ab541f" : "none",
                                        paddingBottom: "5px",
                                        fontWeight: location.pathname === "/home" ? "700" : "500", // active bold
                                    }}
                                    onClick={() => nav("/home")}
                                >
                                    Blogs
                                </span>

                                <span

                                    style={{
                                        cursor: "pointer",
                                        fontSize: "22px",
                                        color: location.pathname === "/schooldetails" ? "#161616e0" : "#555353ff",
                                        borderBottom: location.pathname === "/schooldetails" ? "3px solid #ab541f" : "none",
                                        paddingBottom: "4px",
                                        fontWeight: location.pathname === "/schooldetails" ? "700" : "400",
                                    }}
                                    onClick={() => nav("/schooldetails")}
                                >
                                    Schools
                                </span>
                            </Nav>



                            {/* Right - Admin Info with Dropdown */}
                            <Nav className="d-flex align-items-center ms-auto mt-3 mt-lg-0">
                                <PersonCircle size={28} className="me-2" />
                                <NavDropdown
                                    title={
                                        <span className="fw-semibold "
                                            style={{
                                                maxWidth: "150px",
                                                display: "inline-block",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "middle",
                                                color: "#161616"
                                            }}
                                            title="bhavin parmar "
                                        >
                                            {adminname}
                                        </span>
                                    }

                                    id="admin-dropdown"
                                    align="end"
                                    menuVariant="light"
                                    className="mt-1"
                                >
                                    <NavDropdown.Item style={{ color: "#161616" }}
                                        as="button"
                                        className="dropdown-item-custom"
                                        onClick={handleShow}
                                    >
                                        Change Password
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as="button" className="dropdown-item-custom" style={{ color: "#161616" }} onClick={() => { handalLogout() }}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            {/* 🔹 Change Password Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-semibold" style={{ color: "#2c7864" }}>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePasswordChange}>
                        {/* Old Password */}
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Old Password</Form.Label>
                            <InputGroup className="border rounded">
                                <InputGroup.Text className="bg-white border-0">
                                    <Lock />
                                </InputGroup.Text>
                                <Form.Control
                                    type={showPassword.oldPassword ? "text" : "password"}
                                    placeholder="Enter old password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handleChange}
                                    required
                                    className="border-0 shadow-none"
                                />
                                <InputGroup.Text
                                    onClick={() => togglePasswordVisibility("oldPassword")}
                                    style={{ cursor: "pointer" }}
                                    className="bg-white border-0 "
                                >
                                    {showPassword.oldPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* New Password */}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <InputGroup className="border rounded">
                                <InputGroup.Text className="bg-white border-0">
                                    <Lock />
                                </InputGroup.Text>
                                <Form.Control
                                    type={showPassword.newPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="border-0 shadow-none"
                                />
                                <InputGroup.Text
                                    onClick={() => togglePasswordVisibility("newPassword")}
                                    style={{ cursor: "pointer" }}
                                    className="bg-white border-0"
                                >
                                    {showPassword.newPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Confirm Password */}
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup className="border rounded">
                                <InputGroup.Text className="bg-white border-0">
                                    <Lock />
                                </InputGroup.Text>
                                <Form.Control
                                    type={showPassword.confirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="border-0 shadow-none"
                                />
                                <InputGroup.Text
                                    onClick={() => togglePasswordVisibility("confirmPassword")}
                                    style={{ cursor: "pointer" }}
                                    className="bg-white border-0"
                                >
                                    {showPassword.confirmPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                type="submit"
                                className="fw-semibold d-flex align-items-center justify-content-center"
                                style={{ backgroundColor: "#2c7864", border: "none", width: "100%" }}
                                disabled={loading} // 🔹 disable button while loading
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Loading...
                                    </>
                                ) : (
                                    "Change"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AdminNavbar;
