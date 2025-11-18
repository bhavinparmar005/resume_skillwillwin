import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const EditSchoolForm = () => {
    let location = useLocation()
    let nav = useNavigate();
    let id = location.state._id
    // console.log(id);

    useEffect(() => {
        let token = localStorage.getItem("adminToken")
        let admin = JSON.parse(localStorage.getItem("name"))
        if (!token && !admin) {
            nav("/")
        }
    }, [])
    const [loading, setLoading] = useState(false); // 🔹 Loader state
    const [formData, setFormData] = useState({
        schoolname: "" || location.state.schoolname,
        email: "" || location.state.email,
        phone: "" || location.state.phone,
        student: "" || location.state.student,
        address: "" || location.state.address

    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // 🔹 Loader start
            

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/editschool/${id}`,
                formData
            );

            setLoading(false); // 🔹 Loader stop

            // ✅ Success Alert
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "School updated successfully 🎉",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                nav("/schooldetails");
                setFormData({
                    schoolname: "",
                    email: "",
                    phone: "",
                    student: "",
                    address: "",
                });
            });
        } catch (error) {
            setLoading(false);

            // ❌ Error Alert
            Swal.fire({
                icon: "error",
                title: "Error!",
                text:
                    error.response?.data?.message ||
                    "Failed to update school ❌ Please try again.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    return (
        <>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center "

            >
                <Row className="w-100 mt-5 mb-5">
                    <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                        <div className="login-card p-4 shadow rounded bg-white">
                            <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>
                                Edit School
                            </h3>

                            <Form onSubmit={handleSubmit}>

                                {/* schoolname */}
                                <Form.Group className="mb-3" controlId="text">
                                    <Form.Label>School Name</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >

                                        <Form.Control
                                            type="text"
                                            placeholder="Enter school name"
                                            name="schoolname"
                                            value={formData.schoolname}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                {/* school Email */}
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >

                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email address"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>


                                {/* school number */}
                                <Form.Group className="mb-3" controlId="number">
                                    <Form.Label>Phone Number</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >

                                        <Form.Control
                                            type="number"
                                            placeholder="Enter phone number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                {/* school student */}
                                <Form.Group className="mb-3" controlId="student">
                                    <Form.Label>Total Students</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >

                                        <Form.Control
                                            type="number"
                                            placeholder="Enter total students"
                                            name="student"
                                            value={formData.student}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                {/* school addresh */}

                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >

                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>







                                {/* Submit */}
                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        className="login-btn fw-semibold"
                                        style={{
                                            backgroundColor: "#2c7864",
                                            border: "none",
                                        }}
                                        disabled={loading} // 🔹 disable when loading
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
                                                Saveing...
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>


                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default EditSchoolForm