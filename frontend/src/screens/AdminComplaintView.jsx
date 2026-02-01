import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import {
  listComplaints,
  updateComplaint,
  getComplaintStats,
} from "../actions/complaintActions";
import { COMPLAINT_UPDATE_RESET } from "../constants/complaintConstants";

const AdminComplaintView = () => {
  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const complaintList = useSelector((state) => state.complaintList);
  const { loading, complaints, error, page, pages, total } = complaintList;

  const complaintUpdate = useSelector((state) => state.complaintUpdate);
  const { success: updateSuccess } = complaintUpdate;

  const complaintStats = useSelector((state) => state.complaintStats);
  const { stats } = complaintStats;

  useEffect(() => {
    if (!userInfo || userInfo.role !== "warden") {
      window.location.href = "/";
    } else {
      dispatch(getComplaintStats());
      dispatch(listComplaints({ status: statusFilter, type: typeFilter, priority: priorityFilter }));
    }
  }, [dispatch, userInfo, statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    if (updateSuccess) {
      setShowAssignModal(false);
      setSelectedComplaint(null);
      setAssignedStaffId("");
      setNewStatus("");
      setNewPriority("");
      dispatch({ type: COMPLAINT_UPDATE_RESET });
      dispatch(listComplaints({ status: statusFilter, type: typeFilter, priority: priorityFilter }));
      dispatch(getComplaintStats());
    }
  }, [updateSuccess, dispatch, statusFilter, typeFilter, priorityFilter]);

  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewPriority(complaint.priority);
    setAssignedStaffId(complaint.assignedStaff?._id || "");
    setShowAssignModal(true);
  };

  const handleUpdate = () => {
    if (selectedComplaint) {
      const updateData = {};
      if (assignedStaffId) updateData.assignedStaff = assignedStaffId;
      if (newStatus !== selectedComplaint.status) updateData.status = newStatus;
      if (newPriority !== selectedComplaint.priority) updateData.priority = newPriority;

      dispatch(updateComplaint(selectedComplaint._id, updateData));
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

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={12}>
          <h2>Complaint Management Dashboard</h2>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mt-3">
        <Col md={2}>
          <Card className="text-center">
            <Card.Body>
              <h5>Total</h5>
              <h3>{stats?.total || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <h5>Raised</h5>
              <h3>{stats?.raised || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h5>Assigned</h5>
              <h3>{stats?.assigned || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h5>In Progress</h5>
              <h3>{stats?.inProgress || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h5>Resolved</h5>
              <h3>{stats?.resolved || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center bg-secondary text-white">
            <Card.Body>
              <h5>Closed</h5>
              <h3>{stats?.closed || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mt-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Raised">Raised</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filter by Type</Form.Label>
            <Form.Control
              as="select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Mess">Mess</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filter by Priority</Form.Label>
            <Form.Control
              as="select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Complaints Table */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header as="h5">
              All Complaints {total && `(${total} total)`}
            </Card.Header>
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
                      <th>Status</th>
                      <th>Assigned Staff</th>
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
                          <small>{complaint.student?.email}</small>
                        </td>
                        <td>
                          {complaint.roomNumber}
                          {complaint.blockNumber && ` - ${complaint.blockNumber}`}
                        </td>
                        <td>{complaint.type}</td>
                        <td>{getPriorityBadge(complaint.priority)}</td>
                        <td>{getStatusBadge(complaint.status)}</td>
                        <td>
                          {complaint.assignedStaff ? (
                            <>
                              {complaint.assignedStaff.name}
                              <br />
                              <small>{complaint.assignedStaff.phoneNumber}</small>
                            </>
                          ) : (
                            <Badge bg="secondary">Not Assigned</Badge>
                          )}
                        </td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => openAssignModal(complaint)}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No complaints found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assign/Update Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Complaint</Modal.Title>
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
                <strong>Student:</strong> {selectedComplaint.student?.name} (
                {selectedComplaint.student?.email})
              </p>
              <p>
                <strong>Room:</strong> {selectedComplaint.roomNumber}
              </p>
              <hr />

              <Form>
                <Form.Group controlId="assignStaff" className="mb-3">
                  <Form.Label>Assign Staff (Staff ID)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter staff user ID"
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Enter the MongoDB ObjectId of the staff member
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="status" className="mb-3">
                  <Form.Label>Update Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Raised">Raised</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="priority" className="mb-3">
                  <Form.Label>Update Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update Complaint
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminComplaintView;
