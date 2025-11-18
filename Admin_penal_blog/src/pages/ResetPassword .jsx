import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { Eye, EyeSlash, Lock } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    console.log(state?.email);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
    // Loader start
    setLoading(true);

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "❌ Password Mismatch",
            text: "New Password and Confirm Password do not match!",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        setLoading(false);
        return; // Stop submission
    }

    const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/adminupdatepassword`,
        {
            email: state?.email,
            newPassword: passwordData.newPassword,
        }
    );

    if (res.data.success) {
        Swal.fire({
            icon: "success",
            title: "✅ Password Changed Successfully",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            setLoading(false);
            navigate("/"); // Navigate to login/home
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "❌ Error",
            text: res.data.message || "Failed to change password.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        });
        setLoading(false);
    }
} catch (error) {
    setLoading(false);
    Swal.fire({
        icon: "error",
        title: "❌ Error",
        text:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong while changing password ❌",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}



    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100" >
            <Row className="w-100">
                <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                    <div className="p-4 shadow rounded bg-white">
                        <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>Reset Password</h3>
                        <Form onSubmit={handleSubmit}>
                            {/* New Password */}
                            <Form.Group className="mb-3" controlId="newPassword">
                                <Form.Label>New Password</Form.Label>
                                <InputGroup style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                                    <InputGroup.Text style={{ border: "none", background: "transparent" }}>
                                        <Lock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword.newPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handleChange}
                                        required
                                        style={{ border: "none", boxShadow: "none" }}
                                    />
                                    <Button
                                        variant="light"
                                        style={{ border: "none", background: "transparent" }}
                                        onClick={() => togglePasswordVisibility("newPassword")}
                                    >
                                        {showPassword.newPassword ? <EyeSlash /> : <Eye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            {/* Confirm Password */}
                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputGroup style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                                    <InputGroup.Text style={{ border: "none", background: "transparent" }}>
                                        <Lock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        style={{ border: "none", boxShadow: "none" }}
                                    />
                                    <Button
                                        variant="light"
                                        style={{ border: "none", background: "transparent" }}
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                    >
                                        {showPassword.confirmPassword ? <EyeSlash /> : <Eye />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            {/* Submit */}
                            <div className="d-grid">
                                <Button type="submit" style={{ backgroundColor: "#2c7864", border: "none" }} disabled={loading} className="fw-semibold">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                            Resetting...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
