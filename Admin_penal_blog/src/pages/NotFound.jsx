import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/404.json"; // apna json file ka path

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 " style={{ backgroundColor: "#2c7864b9" }}
    >
      <Row className="text-center mb-5">
        <Col>
          {/* Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <Lottie animationData={animationData} loop={true} />
          </motion.div>

          {/* Page Not Found Text */}
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-3 fw-semibold"
            style={{ color: "#ffffff" }}
          >
            Oops! Page Not Found
          </motion.h2>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-4"
            style={{ color: "#161616", fontSize: "18px" }}
          >
            The page you are looking for doesn’t exist or has been moved.
          </motion.p>

          {/* Go Back Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              variant="outline-light"
              size="lg"
              className="rounded-pill shadow-lg px-4 fw-semibold"
              onClick={() => navigate("/home")}
            >
              Go Home
            </Button>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;