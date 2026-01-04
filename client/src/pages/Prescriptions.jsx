import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  User,
  CheckCircle,
  ArrowRight,
  X,
  AlertTriangle,
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
import {
  getAllPrescriptions,
  createPrescription,
} from "../services/prescriptionApi";
import { enqueue } from "../services/queueApi";
import { getAllMedicines } from "../services/inventoryApi";

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [fullPrescriptionDetails, setFullPrescriptionDetails] = useState(null);

  // Form fields for new prescription
  const [formData, setFormData] = useState({
    patientName: "",
    doctor: "",
    department: "",
    priority: 2,
    medicines: [], // Selected medicines with quantity
  });

  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAddingMedicine, setIsAddingMedicine] = useState(null);

  const [medicineQuantity, setMedicineQuantity] = useState("");

  useEffect(() => {
    fetchPrescriptions();
    fetchAvailableMedicines();
  }, []);

  const fetchAvailableMedicines = async () => {
    try {
      const response = await getAllMedicines();
      console.log("Fetched medicines:", response.data);
      setAvailableMedicines(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setModalMessage("Failed to load medicines. Please refresh the page.");
      setShowErrorModal(true);
    }
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await getAllPrescriptions();
      const data = response.data?.data || [];

      // Map backend data to frontend format
      const mapped = data.map((rx) => ({
        id: rx._id,
        prescriptionId: rx._id.slice(-8).toUpperCase(),
        patientName: rx.patientId?.name || "Unknown",
        doctor: rx.doctor || "N/A",
        department: rx.department || "N/A",
        items: rx.items?.length || 0,
        status:
          rx.status === "dispensed"
            ? "Dispensed"
            : rx.status === "queued"
            ? "In Queue"
            : rx.status === "called"
            ? "Processing"
            : "Draft",
        rawStatus: rx.status,
        createdAt: new Date(rx.createdAt).toLocaleString(),
      }));

      setPrescriptions(mapped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions([]);
      setLoading(false);
    }
  };

  const handleCreatePrescription = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form fields
    const newErrors = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    if (!formData.doctor.trim()) {
      newErrors.doctor = "Doctor name is required";
    }
    if (formData.medicines.length === 0) {
      newErrors.medicines = "Please select at least one medicine";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const prescriptionResponse = await createPrescription({
        patientName: formData.patientName,
        doctor: formData.doctor,
        department: formData.department || "General",
        items: formData.medicines.map((m) => ({
          medicineId: m.id,
          dosage: m.dosage,
          quantity: m.quantity,
        })),
      });

      const createdPrescriptionId = prescriptionResponse.data?.data?._id;

      // Automatically add to queue with selected priority
      if (createdPrescriptionId) {
        try {
          await enqueue({
            prescriptionId: createdPrescriptionId,
            priority: formData.priority, // Use selected priority
          });
        } catch (queueError) {
          console.error("Error auto-queuing:", queueError);
          // Continue even if queuing fails
        }
      }

      setIsAddDialogOpen(false);
      setFormData({
        patientName: "",
        doctor: "",
        department: "",
        priority: 2,
        medicines: [],
      });
      setErrors({});
      fetchPrescriptions();
      setModalMessage("Prescription created and added to queue successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating prescription:", error);

      let errorMessage = "Failed to create prescription";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    }
  };

  const addMedicineToRx = (medicine) => {
    // Extract dosage from medicine name (e.g., "Paracetamol 500mg" -> "500mg")
    const dosageMatch = medicine.name.match(/(\d+\s*(?:mg|ml|g|units?))/i);
    const defaultDosage = dosageMatch ? dosageMatch[1] : "1 unit";

    // Set the current medicine for quantity input
    setIsAddingMedicine(medicine);
    setMedicineDosage(defaultDosage);
    setMedicineQuantity("10");
  };

  const confirmAddMedicine = () => {
    if (isAddingMedicine && medicineQuantity.trim()) {
      const quantity = parseInt(medicineQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        // Auto-extract dosage from medicine name (e.g., "Paracetamol 500mg" -> "500mg")
        const dosageMatch = isAddingMedicine.name.match(
          /(\d+\s*(?:mg|ml|g|units?))/i
        );
        const dosage = dosageMatch ? dosageMatch[1] : isAddingMedicine.name;

        setFormData((prev) => ({
          ...prev,
          medicines: [
            ...prev.medicines,
            {
              id: isAddingMedicine._id,
              name: isAddingMedicine.name,
              dosage: dosage,
              quantity: quantity,
            },
          ],
        }));

        // Reset the medicine selection state
        setIsAddingMedicine(null);
        setMedicineQuantity("");
      }
    }
  };

  const cancelAddMedicine = () => {
    setIsAddingMedicine(null);
    setMedicineQuantity("");
  };

  const removeMedicineFromRx = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  // Handle Add to Queue button click
  const handleAddToQueue = async (prescription) => {
    // Ask user for priority
    const priorityInput = prompt(
      "Enter priority (0=Emergency, 1=High, 2=Normal, 3=Low):",
      "2"
    );

    if (priorityInput === null) return; // User cancelled

    const priority = parseInt(priorityInput);
    if (isNaN(priority) || priority < 0 || priority > 3) {
      alert("Invalid priority. Please enter 0-3.");
      return;
    }

    try {
      // Add to queue with priority
      await enqueue({
        prescriptionId: prescription.id,
        priority: priority,
      });

      // Refresh the list to get updated status
      await fetchPrescriptions();

      // Show success message
      const priorityNames = ["Emergency", "High", "Normal", "Low"];
      alert(
        `Prescription added to queue with ${priorityNames[priority]} priority!`
      );
    } catch (error) {
      console.error("Error adding to queue:", error);

      let errorMessage = "Failed to add to queue";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm text-text-muted">Dispensed</p>
                <p className="text-2xl font-semibold text-success mt-1">
                  {prescriptions.filter((p) => p.status === "Dispensed").length}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setSelectedPrescription(rx);
                          setShowDetailsModal(true);
                          // Fetch full prescription details
                          try {
                            const { getPrescription } = await import(
                              "../services/prescriptionApi"
                            );
                            const response = await getPrescription(rx.id);
                            setFullPrescriptionDetails(response.data?.data);
                          } catch (error) {
                            console.error(
                              "Error fetching prescription details:",
                              error
                            );
                          }
                        }}
                      >
                        View Details
                      </Button>
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
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
            <DialogDescription>
              Create a new prescription for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-4 py-3">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">
                Patient Name *
              </label>
              <Input
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => {
                  setFormData({ ...formData, patientName: e.target.value });
                  if (errors.patientName)
                    setErrors((prev) => ({ ...prev, patientName: undefined }));
                }}
                error={errors.patientName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Doctor Name *
              </label>
              <Input
                placeholder="Enter doctor name"
                value={formData.doctor}
                onChange={(e) => {
                  setFormData({ ...formData, doctor: e.target.value });
                  if (errors.doctor)
                    setErrors((prev) => ({ ...prev, doctor: undefined }));
                }}
                error={errors.doctor}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <Input
                placeholder="e.g., General Medicine"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Queue Priority
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value),
                  })
                }
              >
                <option value={0}>🚨 Emergency</option>
                <option value={1}>⚠️ High</option>
                <option value={2}>📋 Normal</option>
                <option value={3}>📝 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Medicines *
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMedicineSelector(!showMedicineSelector)}
                className="w-full"
              >
                {showMedicineSelector
                  ? "Hide Medicines"
                  : "Select Medicines from Inventory"}
              </Button>

              {showMedicineSelector && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border max-h-40 overflow-y-auto">
                  {availableMedicines.map((med) => (
                    <div
                      key={med._id}
                      className="flex items-center justify-between p-2 hover:bg-white rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{med.unitPrice || 0}/unit
                        </p>
                      </div>
                      {isAddingMedicine?._id === med._id ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Quantity"
                            value={medicineQuantity}
                            onChange={(e) =>
                              setMedicineQuantity(e.target.value)
                            }
                            className="w-20 text-xs h-8"
                            type="number"
                            min="1"
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={confirmAddMedicine}
                              className="h-8"
                            >
                              ✓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelAddMedicine}
                              className="h-8"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => addMedicineToRx(med)}>
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Medicines *
              </label>
              {errors.medicines && (
                <p className="text-xs text-red-500 mt-1">{errors.medicines}</p>
              )}
              {formData.medicines.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {formData.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-info-light rounded"
                    >
                      <div className="text-sm">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-xs text-gray-600">
                          {med.dosage} × {med.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMedicineFromRx(idx)}
                        className="text-error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No medicines selected
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePrescription}>
              Create Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Algorithm Modal */}
      <Dialog open={showAlgorithmModal} onOpenChange={setShowAlgorithmModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Prescription Flow & DSA Algorithms
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Understanding how the system processes prescriptions using Data
              Structures & Algorithms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h3 className="font-bold text-lg text-blue-900 mb-3">
                1. Create Prescription
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed space-y-1">
                • Enter patient info, doctor, and medicines
                <br />• Uses <strong>Linked List DSA</strong> for ordered
                prescription items
                <br />• Items stored sequentially for easy traversal and
                modification
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
              <h3 className="font-bold text-lg text-amber-900 mb-3">
                2. Auto-Queue with Priority
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed space-y-1">
                • Automatically added to queue based on selected priority
                <br />• Uses <strong>Min-Heap Priority Queue</strong> DSA
                <br />
                • Priority levels: Emergency (0) → High (1) → Normal (2) → Low
                (3)
                <br />
                • Within same priority, FIFO (First-In-First-Out) order
                maintained
                <br />• O(log n) insertion and extraction complexity
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <h3 className="font-bold text-lg text-purple-900 mb-3">
                3. Process from Queue
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed space-y-1">
                • Pharmacist clicks "Process Next"
                <br />
                • Min-Heap extracts highest priority prescription
                <br />• Emergency patients always served first
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <h3 className="font-bold text-lg text-green-900 mb-3">
                4. Dispense with FEFO
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed space-y-1">
                • Uses <strong>Greedy FEFO Algorithm</strong>{" "}
                (First-Expiry-First-Out)
                <br />
                • Allocates stock from batches expiring soonest
                <br />
                • Minimizes wastage through optimal batch selection
                <br />• Bill created automatically after dispensing
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowAlgorithmModal(false)}
              className="px-6"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-success text-xl">
              <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              Success
            </DialogTitle>
          </DialogHeader>
          <p className="text-text-primary text-base py-4">{modalMessage}</p>
          <DialogFooter className="mt-2">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-error text-xl">
              <div className="w-10 h-10 rounded-full bg-error-light flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              Error
            </DialogTitle>
          </DialogHeader>
          <p className="text-text-primary text-base py-4">{modalMessage}</p>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setShowErrorModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Prescription Details
            </DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6 py-6 px-2">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Prescription ID
                  </p>
                  <p className="font-semibold text-base">
                    {selectedPrescription.prescriptionId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedPrescription.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-text-muted mb-1">Patient Name</p>
                  <p className="font-semibold text-base">
                    {selectedPrescription.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Doctor</p>
                  <p className="font-semibold text-base">
                    {selectedPrescription.doctor}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-text-muted mb-1">Department</p>
                  <p className="font-semibold text-base">
                    {selectedPrescription.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">
                    Number of Items
                  </p>
                  <p className="font-semibold text-base">
                    {selectedPrescription.items}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Created At</p>
                <p className="font-semibold text-base">
                  {selectedPrescription.createdAt}
                </p>
              </div>

              {fullPrescriptionDetails?.items &&
                fullPrescriptionDetails.items.length > 0 && (
                  <div className="border-t pt-6">
                    <p className="text-sm text-text-muted mb-3">
                      Prescribed Medicines
                    </p>
                    <div className="space-y-2">
                      {fullPrescriptionDetails.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-base">
                                {item.medicineId?.name || "Medicine"}
                              </p>
                              <p className="text-sm text-text-muted mt-1">
                                Dosage: {item.dosage || "As directed"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary">
                                {item.quantity} units
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowDetailsModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
