import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Container, Row, Col, Card, Table, Badge, Modal } from "react-bootstrap";
import {
  createComplaint,
  listMyComplaints,
  submitComplaintFeedback,
} from "../actions/complaintActions";
import { COMPLAINT_CREATE_RESET, COMPLAINT_FEEDBACK_RESET } from "../constants/complaintConstants";

const ComplaintScreen = () => {
  const dispatch = useDispatch();

  const [type, setType] = useState("Electrical");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(3);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const complaintCreate = useSelector((state) => state.complaintCreate);
  const { loading: createLoading, success: createSuccess, error: createError } = complaintCreate;

  const complaintMy = useSelector((state) => state.complaintMy);
  const { loading: listLoading, complaints, error: listError } = complaintMy;

  const complaintFeedback = useSelector((state) => state.complaintFeedback);
  const { success: feedbackSuccess } = complaintFeedback;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = "/login";
    } else {
      dispatch(listMyComplaints());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (createSuccess) {
      setType("Electrical");
      setDescription("");
      setPriority("Medium");
      dispatch({ type: COMPLAINT_CREATE_RESET });
      dispatch(listMyComplaints());
    }
  }, [createSuccess, dispatch]);

  useEffect(() => {
    if (feedbackSuccess) {
      setShowFeedbackModal(false);
      setFeedback("");
      setRating(3);
      setSelectedComplaint(null);
      dispatch({ type: COMPLAINT_FEEDBACK_RESET });
      dispatch(listMyComplaints());
    }
  }, [feedbackSuccess, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createComplaint({
        type,
        description,
        priority,
        roomNumber: userInfo.roomNumber,
        blockNumber: userInfo.blockNumber,
      })
    );
  };

  const handleFeedbackSubmit = () => {
    if (selectedComplaint) {
      dispatch(submitComplaintFeedback(selectedComplaint._id, { feedback, rating }));
    }
  };

  const openFeedbackModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowFeedbackModal(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Raised: "warning",
      Assigned: "info",
      "In Progress": "primary",
      Resolved: "success",
      Closed: "secondary",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      Low: "success",
      Medium: "info",
      High: "warning",
      Critical: "danger",
    };
    return <Badge bg={priorityColors[priority] || "secondary"}>{priority}</Badge>;
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <h2>My Complaints</h2>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Raise New Complaint</Card.Header>
            <Card.Body>
              {createError && <div className="alert alert-danger">{createError}</div>}
              {createSuccess && (
                <div className="alert alert-success">Complaint raised successfully!</div>
              )}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="type" className="mb-3">
                  <Form.Label>Complaint Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Mess">Mess</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="priority" className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe your complaint in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="roomNumber" className="mb-3">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={userInfo?.roomNumber || ""}
                    disabled
                  />
                </Form.Group>

                <Button type="submit" variant="primary" disabled={createLoading}>
                  {createLoading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header as="h5">Complaint History</Card.Header>
            <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
              {listLoading ? (
                <p>Loading...</p>
              ) : listError ? (
                <div className="alert alert-danger">{listError}</div>
              ) : complaints && complaints.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>{complaint.type}</td>
                        <td>{getStatusBadge(complaint.status)}</td>
                        <td>{getPriorityBadge(complaint.priority)}</td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        <td>
                          {complaint.status === "Resolved" && !complaint.feedback && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => openFeedbackModal(complaint)}
                            >
                              Feedback
                            </Button>
                          )}
                          {complaint.status === "Closed" && (
                            <Badge bg="secondary">Closed</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No complaints found. Raise your first complaint!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="rating" className="mb-3">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group controlId="feedback" className="mb-3">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ComplaintScreen;
