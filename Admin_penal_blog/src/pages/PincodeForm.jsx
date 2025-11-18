import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";

const PincodeForm = () => {
  const [pin, setPin] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const PIN_REGEX = /^[1-9][0-9]{5}$/;

  // ✅ Clean village name
  const cleanName = (name) => {
    return name.replace(/\s+(S\.R\.|H\.O\.|G\.P\.O\.)$/i, "");
  };

  // ✅ Fetch from API
  const fetchData = async (pincode) => {
    try {
      // Govt API
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data && data[0]?.Status === "Success") {
        const office = data[0].PostOffice[0]; // first post office
        return {
          village: cleanName(office.Name), // ✅ cleaned village
          district: office.District,
          state: office.State,
        };
      }

      throw new Error("Govt API Failed");
    } catch (error) {
      console.warn("Govt API failed, trying RapidAPI...", error);

      // RapidAPI fallback
      try {
        const res2 = await fetch(
          `https://postalpincode.p.rapidapi.com/api/pincode/${pincode}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": "YOUR_RAPIDAPI_KEY",
              "x-rapidapi-host": "postalpincode.p.rapidapi.com",
            },
          }
        );
        const data2 = await res2.json();
        if (data2 && data2.PostOffice?.length > 0) {
          const office = data2.PostOffice[0];
          return {
            village: cleanName(office.Name), // ✅ cleaned village
            district: office.District,
            state: office.State,
          };
        }
        return null;
      } catch (err2) {
        console.error("Both APIs failed:", err2);
        return null;
      }
    }
  };

  // ✅ Wrapper
  const fetchDetails = async (pincode) => {
    if (!PIN_REGEX.test(pincode)) {
      setError("Invalid Pincode");
      setDetails(null);
      return;
    }
    setLoading(true);
    setError("");
    const data = await fetchData(pincode);
    setLoading(false);

    if (data) {
      setDetails(data);
    } else {
      setError("No details found for this pincode");
      setDetails(null);
    }
  };

  // ✅ On change
  const handlePinChange = (e) => {
    const value = e.target.value;
    setPin(value);
    if (value.length === 6) {
      fetchDetails(value);
    } else {
      setDetails(null);
      setError("");
    }
  };

  // ✅ On Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details) {
      alert("Please enter a valid pincode");
      return;
    }
    const payload = {
      pincode: pin,
      ...details,
    };
    console.log("📌 Final Data:", payload); // ✅ Console me data
    alert("Data captured! Check the console.");
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4 text-center fw-bold">Pincode Finder</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                value={pin}
                onChange={handlePinChange}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            {loading && <Spinner animation="border" variant="primary" />}
          </Col>
        </Row>

        {details && (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Village</Form.Label>
                  <Form.Control value={details.village} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>District</Form.Label>
                  <Form.Control value={details.district} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control value={details.state} readOnly />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Button variant="success" type="submit" disabled={!details}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default PincodeForm;
