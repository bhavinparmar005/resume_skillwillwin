import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/adminforgetpassword`, { email });

            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent!",
                    text: "✅ OTP has been sent to your email.",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    setLoading(false);
                    navigate("/verifyotp", { state: { email } });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Email not found!!",
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: false,
                });
                setLoading(false);
                 setEmail("")
                
            }
        } catch (error) {
            setLoading(false);
            setEmail("")
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
        }


    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100">
                <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                    <div className="p-4 shadow rounded bg-white">
                        <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>Forgot Password</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <InputGroup style={{ border: "1px solid #ced4da", borderRadius: "0.375rem" }}>
                                    <InputGroup.Text style={{ border: "none", background: "transparent" }}>
                                        <Envelope />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                            Sending...
                                        </>
                                    ) : (
                                        "Send OTP"
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

export default ForgotPassword;
