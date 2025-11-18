import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    InputGroup,
    Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddSchoolForm = () => {
    let nav = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem("adminToken")
        let admin = JSON.parse(localStorage.getItem("name"))
        if (!token && !admin) {
            nav("/")
        }
    }, [])
    const [loading, setLoading] = useState(false); // Submit loader
    const [pinLoading, setPinLoading] = useState(false); // Pincode loader
    const [locationFetched, setLocationFetched] = useState(false); // show/hide fields

    const [formData, setFormData] = useState({
        schoolname: "",
        email: "",
        phone: "",
        student: "",
        address: "",
        pincode: "",
        city: "",
        district: "",
        state: "",
    });


    // 🔹 Input change handle
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Pincode change handle (API call)
    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, pincode: value }));

        if (value.length === 6) {
            setPinLoading(true);
            setLocationFetched(false);

            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                const data = await res.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];

                    setFormData((prev) => ({
                        ...prev,
                        // 👇 sirf empty fields hi overwrite honge
                        city: prev.city || postOffice.Block?.replace(/\s*S\.R\.$/, "") || "",
                        district: prev.district || postOffice.District || "",
                        state: prev.state || postOffice.State || "",
                    }));

                    setLocationFetched(true);
                } else {
                    alert("Invalid Pincode");
                }
            } catch (err) {
                console.error("Error fetching Pincode data:", err);
            }
            setPinLoading(false);
        } else {
            // agar user < 6 digit kare to reset karo
            setLocationFetched(false);
            setFormData((prev) => ({
                ...prev,
                city: "",
                district: "",
                state: "",
            }));
        }
    };

    // 🔹 Submit handle (Address auto merge)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)

            // 🔥 user ka likha address
            let userAddress = formData.address || "";

            // 🔥 auto location part
            const locationPart = `${formData.city || ""}, ${formData.district || ""}, ${formData.state || ""}, ${formData.pincode || ""}`
                .replace(/(, )+/g, ", ")
                .replace(/^, |, $/g, "");

            // 🔥 merge user address + location
            const fullAddress = userAddress
                ? `${userAddress}, ${locationPart}`.replace(/(, )+/g, ", ").replace(/^, |, $/g, "")
                : locationPart;

            // 🔥 sirf required fields rakho
            const finalData = {
                address: fullAddress,
                schoolname: formData.schoolname,
                email: formData.email,
                phone: formData.phone,
                student: formData.student,
            };

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addschool`, finalData);

            setLoading(false);
            // ✅ Success SweetAlert
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: res.data.message || "School added successfully 🎉",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                nav("/schooldetails");
            });

            setLocationFetched(false)
        } catch (error) {

            setLoading(false);

            Swal.fire({
                icon: "error",
                title: "Error!",
                text:
                    error.response?.data?.message ||
                    "Something went wrong ❌ Please try again.",
                timer: 2000,                // 2 second ke liye alert chalega
                timerProgressBar: true,     // progress bar dikhegi
                showConfirmButton: false,   // confirm button hatado
            });
        }

    };




    return (
        <Container fluid className="d-flex justify-content-center align-items-center ">
            <Row className="w-100 mt-5 mb-5">
                <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
                    <div className="login-card p-4 shadow rounded bg-white">
                        <h3
                            className="text-center mb-4 fw-semibold"
                            style={{ color: "#2c7864" }}
                        >
                            Add School
                        </h3>

                        <Form onSubmit={handleSubmit}>
                            {/* Schoolname */}
                            <Form.Group className="mb-3" controlId="schoolname">
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

                            {/* Email */}
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

                            {/* Phone */}
                            {/* Phone */}
                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Phone Number</Form.Label>
                                <InputGroup
                                    style={{
                                        border: "1px solid #ced4da",
                                        borderRadius: "0.375rem",
                                    }}
                                >
                                    <Form.Control
                                        type="text" // number se better text use kare, taaki leading 0 bhi aa sake
                                        placeholder="Enter phone number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            // sirf digits allow aur max 10 digit
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            setFormData({ ...formData, phone: value });
                                        }}
                                        style={{ border: "none", boxShadow: "none" }}
                                        required
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Please enter a 10-digit phone number.
                                </Form.Text>
                            </Form.Group>


                            {/* Students */}
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

                            {/* Address */}
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


                            {/* Pincode */}
                            <Form.Group className="mb-3" controlId="pincode">
                                <Form.Label>Pin Code</Form.Label>
                                <InputGroup
                                    style={{
                                        border: "1px solid #ced4da",
                                        borderRadius: "0.375rem",
                                    }}
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter pin code"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handlePincodeChange}   // <-- ab yaha change
                                        style={{ border: "none", boxShadow: "none" }}
                                        required
                                    />

                                </InputGroup>
                            </Form.Group>

                            {/* Show loader or city/district/state */}
                            {pinLoading && (
                                <div className="text-center my-3">
                                    <Spinner animation="border" />
                                    <p className="mt-2">Fetching location...</p>
                                </div>
                            )}

                            {!pinLoading && locationFetched && (
                                <>
                                    {/* City */}
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.city}
                                            readOnly
                                            style={{ background: "#f8f9fa", border: "1px solid #ced4da", boxShadow: "none" }}
                                        />
                                    </Form.Group>

                                    {/* District */}
                                    <Form.Group className="mb-3" controlId="district">
                                        <Form.Label>District</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.district}
                                            readOnly
                                            style={{ background: "#f8f9fa", border: "1px solid #ced4da", boxShadow: "none" }}
                                        />
                                    </Form.Group>

                                    {/* State */}
                                    <Form.Group className="mb-3" controlId="state">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.state}
                                            readOnly
                                            style={{ background: "#f8f9fa", border: "1px solid #ced4da", boxShadow: "none" }}
                                        />
                                    </Form.Group>
                                </>
                            )}





                            {/* Submit */}
                            <div className="d-grid">
                                <Button
                                    type="submit"
                                    className="login-btn fw-semibold"
                                    style={{
                                        backgroundColor: "#2c7864",
                                        border: "none",
                                    }}
                                    disabled={loading}
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
                                            Adding...
                                        </>
                                    ) : (
                                        "Add"
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

export default AddSchoolForm;
