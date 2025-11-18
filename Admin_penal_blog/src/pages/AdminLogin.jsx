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
import { Eye, EyeSlash, Envelope, Lock } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  let nav = useNavigate()
  useEffect(() => {
    let token = localStorage.getItem("adminToken")
    let admin = JSON.parse(localStorage.getItem("name"))
    if (token && admin) {
      nav("/home")
    }
  }, [])

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 Loader state

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 Loader start

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/adminlogin`,
        formData
      );

      const { AdminName, adminToken, message } = res.data;

      // LocalStorage save
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("name", JSON.stringify(AdminName));

      setLoading(false); // 🔹 Loader stop

      // 🔹 Success SweetAlert
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome, ${AdminName}!`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        nav("/home"); // 2 second ke baad redirect
      });

      setFormData({
        email: "",
        password: "",
      })



    } catch (error) {
      setLoading(false);

      // 🔹 Error SweetAlert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.error || "Something went wrong!",
        timer: 2000,             // 2 second me auto close
        showConfirmButton: false, // confirm button hide
        timerProgressBar: true    // optional: progress bar dikhaye
      });
      setFormData({
        email: "",
        password: "",
      })

      console.log(error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"

    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
           <img src="logo.svg" alt="" className="d-block mx-auto"  width={"280px"} style={{marginBottom:"2rem"}} />
          <div className="login-card p-4 shadow rounded bg-white">
            <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>
              Admin Login
            </h3>
            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <InputGroup
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "0.375rem",
                  }}
                >
                  <InputGroup.Text
                    style={{ border: "none", background: "transparent" }}
                  >
                    <Envelope />
                  </InputGroup.Text>
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

              {/* Password with show/hide */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "0.375rem",
                  }}
                >
                  <InputGroup.Text
                    style={{ border: "none", background: "transparent" }}
                  >
                    <Lock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ border: "none", boxShadow: "none" }}
                  />
                  <Button
                    variant="light"
                    className="no-hover"
                    style={{ border: "none", background: "transparent" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </Button>
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
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              {/* Forget password link */}
              <div className="text-end mt-2">
                <p style={{ color: "#2c7864", cursor: "pointer" }} onClick={() => { nav("/forgetpassword") }}>
                  Forgot Password?
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
