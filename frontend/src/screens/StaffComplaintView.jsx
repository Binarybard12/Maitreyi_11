import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { listAssignedComplaints, updateComplaint } from "../actions/complaintActions";
import { COMPLAINT_UPDATE_RESET } from "../constants/complaintConstants";

const StaffComplaintView = () => {
  const dispatch = useDispatch();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const complaintAssigned = useSelector((state) => state.complaintAssigned);
  const { loading, complaints, error } = complaintAssigned;

  const complaintUpdate = useSelector((state) => state.complaintUpdate);
  const { success: updateSuccess } = complaintUpdate;

  useEffect(() => {
    if (!userInfo || userInfo.role !== "staff") {
      window.location.href = "/";
    } else {
      dispatch(listAssignedComplaints());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (updateSuccess) {
      setShowUpdateModal(false);
      setSelectedComplaint(null);
      setNewStatus("");
      dispatch({ type: COMPLAINT_UPDATE_RESET });
      dispatch(listAssignedComplaints());
    }
  }, [updateSuccess, dispatch]);

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setShowUpdateModal(true);
  };

  const handleStatusUpdate = () => {
    if (selectedComplaint && newStatus) {
      dispatch(updateComplaint(selectedComplaint._id, { status: newStatus }));
    }
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

  const getStatusCounts = () => {
    if (!complaints) return { assigned: 0, inProgress: 0, resolved: 0 };
    return {
      assigned: complaints.filter((c) => c.status === "Assigned").length,
      inProgress: complaints.filter((c) => c.status === "In Progress").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <h2>My Assigned Complaints</h2>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mt-3">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Total Assigned</h5>
              <h3>{complaints?.length || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h5>Assigned</h5>
              <h3>{statusCounts.assigned}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h5>In Progress</h5>
              <h3>{statusCounts.inProgress}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h5>Resolved</h5>
              <h3>{statusCounts.resolved}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Complaints Table */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header as="h5">Assigned Complaints</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : complaints && complaints.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint._id}>
                        <td>{complaint._id.substring(0, 8)}...</td>
                        <td>
                          {complaint.student?.name}
                          <br />
                          <small>{complaint.student?.phoneNumber}</small>
                        </td>
                        <td>
                          {complaint.roomNumber}
                          {complaint.blockNumber && ` - ${complaint.blockNumber}`}
                        </td>
                        <td>{complaint.type}</td>
                        <td>{getPriorityBadge(complaint.priority)}</td>
                        <td>
                          <small>{complaint.description.substring(0, 50)}...</small>
                        </td>
                        <td>{getStatusBadge(complaint.status)}</td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => openUpdateModal(complaint)}
                            disabled={complaint.status === "Resolved" || complaint.status === "Closed"}
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No complaints assigned to you yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Complaint Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <>
              <h5>Complaint Details</h5>
              <p>
                <strong>Type:</strong> {selectedComplaint.type}
              </p>
              <p>
                <strong>Description:</strong> {selectedComplaint.description}
              </p>
              <p>
                <strong>Student:</strong> {selectedComplaint.student?.name}
              </p>
              <p>
                <strong>Room:</strong> {selectedComplaint.roomNumber}
              </p>
              <p>
                <strong>Current Status:</strong> {getStatusBadge(selectedComplaint.status)}
              </p>
              <hr />

              <Form>
                <Form.Group controlId="status">
                  <Form.Label>Update Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Mark as "Resolved" when the issue is fixed
                  </Form.Text>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffComplaintView;
