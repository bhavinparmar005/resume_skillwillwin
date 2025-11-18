import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VerifyOtp = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admincheckotp`,
                { email: state?.email, otp }
            );

            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Verified",
                    text: "Now you can reset your password.",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    setLoading(false);
                    navigate("/resetpassword", { state: { email: state?.email } }); // Navigate to Reset Password page
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "❌ Invalid OTP",
                    text: res.data.message,
                    timer: 2000,              // ⏳ 2 sec me close hoga
                    timerProgressBar: true,   // progress bar dikhayega
                    showConfirmButton: false, // OK button nahi dikhayega
                }).then(() => {
                    setLoading(false);
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong ❌",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
             setOtp("")
        }


    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100" >
            <Row className="w-100">
                <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                    <div className="p-4 shadow rounded bg-white">
                        <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>Verify OTP</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="otp">
                                <Form.Label>OTP</Form.Label>
                                <InputGroup style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        style={{ border: "none", boxShadow: "none" }}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <div className="d-grid">
                                <Button type="submit" style={{ backgroundColor: "#2c7864", border: "none" }} disabled={loading} className="fw-semibold">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
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

export default VerifyOtp;
