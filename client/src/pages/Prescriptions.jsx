import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/Dialog";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [addedToQueueRx, setAddedToQueueRx] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPrescriptions([
          {
            id: 1,
            prescriptionId: "PRX-2026-001",
            patientName: "John Doe",
            doctor: "Dr. Sarah Wilson",
            department: "General Medicine",
            items: 3,
            status: "Pending",
            createdAt: "2026-01-02 10:30",
          },
          {
            id: 2,
            prescriptionId: "PRX-2026-002",
            patientName: "Jane Smith",
            doctor: "Dr. Michael Brown",
            department: "Cardiology",
            items: 2,
            status: "In Queue",
            createdAt: "2026-01-02 11:15",
          },
          {
            id: 3,
            prescriptionId: "PRX-2026-003",
            patientName: "Robert Johnson",
            doctor: "Dr. Emily Chen",
            department: "Pediatrics",
            items: 4,
            status: "Completed",
            createdAt: "2026-01-02 09:45",
          },
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setLoading(false);
    }
  };

  // Handle Add to Queue button click
  const handleAddToQueue = (prescription) => {
    // Update the prescription status to "In Queue"
    setPrescriptions(
      prescriptions.map((rx) =>
        rx.id === prescription.id ? { ...rx, status: "In Queue" } : rx
      )
    );

    // Show success toast
    setAddedToQueueRx(prescription);
    setShowSuccessToast(true);

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
      setAddedToQueueRx(null);
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      "In Queue": "info",
      Completed: "success",
      Dispensed: "success",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Prescriptions
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage patient prescriptions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Today</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {prescriptions.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Pending</p>
                <p className="text-2xl font-semibold text-warning mt-1">
                  {prescriptions.filter((p) => p.status === "Pending").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-warning opacity-50" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">In Queue</p>
                <p className="text-2xl font-semibold text-info mt-1">
                  {prescriptions.filter((p) => p.status === "In Queue").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-info opacity-50" />
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Completed</p>
                <p className="text-2xl font-semibold text-success mt-1">
                  {prescriptions.filter((p) => p.status === "Completed").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-success opacity-50" />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <Card.Body className="p-4">
          <Input
            placeholder="Search by prescription ID or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </Card.Body>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Prescription ID</Table.Head>
              <Table.Head>Patient</Table.Head>
              <Table.Head>Doctor</Table.Head>
              <Table.Head>Department</Table.Head>
              <Table.Head>Items</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPrescriptions.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <EmptyState
                    icon={FileText}
                    title="No prescriptions found"
                    description="Create a new prescription to get started"
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredPrescriptions.map((rx) => (
                <Table.Row key={rx.id}>
                  <Table.Cell>
                    <code className="text-xs bg-info-light px-2 py-1 rounded">
                      {rx.prescriptionId}
                    </code>
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {rx.patientName}
                  </Table.Cell>
                  <Table.Cell>{rx.doctor}</Table.Cell>
                  <Table.Cell>{rx.department}</Table.Cell>
                  <Table.Cell>{rx.items}</Table.Cell>
                  <Table.Cell>{getStatusBadge(rx.status)}</Table.Cell>
                  <Table.Cell className="text-sm text-text-muted">
                    {rx.createdAt}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {rx.status === "Pending" && (
                        <Button size="sm" onClick={() => handleAddToQueue(rx)}>
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Add to Queue
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Add Prescription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
            <DialogDescription>
              Create a new prescription for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-4 py-3">
            <Input label="Patient Name" placeholder="Enter patient name" />
            <Input label="Doctor Name" placeholder="Enter doctor name" />
            <Input label="Department" placeholder="e.g., General Medicine" />
            <div className="text-xs text-text-muted">
              Add prescription items after creating the prescription
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Create Prescription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccessToast && addedToQueueRx && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-gray-950 text-white px-5 py-4 rounded-xl shadow-2xl border border-green-500/50">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-gray-950" />
            </div>
            <div>
              <p className="font-semibold text-white">Added to Queue!</p>
              <p className="text-sm text-gray-300">
                {addedToQueueRx.patientName} ({addedToQueueRx.prescriptionId})
              </p>
            </div>
            <Button
              size="sm"
              className="ml-4 bg-green-500 text-gray-950 hover:bg-green-400 border-0"
              onClick={() => navigate("/queue")}
            >
              View Queue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
