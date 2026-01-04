import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Play,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/Dialog";
import { processDispense } from "../services/dispenseApi";
import { getPrescription } from "../services/prescriptionApi";

// ============================================
// DSA: GREEDY FEFO ALGORITHM IMPLEMENTATION
// ============================================

// Sort batches by expiry date (First-Expiry-First-Out)
function sortBatchesByExpiry(batches) {
  return [...batches].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
}

// Greedy FEFO allocation algorithm
function greedyFEFOAllocation(requiredQty, batches) {
  const sortedBatches = sortBatchesByExpiry(batches);
  const allocations = [];
  let remaining = requiredQty;

  for (const batch of sortedBatches) {
    if (remaining <= 0) break;

    const allocateQty = Math.min(remaining, batch.available);
    if (allocateQty > 0) {
      allocations.push({
        batchId: batch.id,
        batchCode: batch.code,
        expiry: batch.expiry,
        available: batch.available,
        allocated: allocateQty,
        isGreedyChoice: true, // This is the "greedy" choice - earliest expiry with stock
      });
      remaining -= allocateQty;
    }
  }

  return {
    allocations,
    totalAllocated: requiredQty - remaining,
    remaining,
    isFullyAllocated: remaining === 0,
  };
}

// FEFO Visualization Component
function FEFOVisualizer({ batches, allocation, showSteps }) {
  const sortedBatches = sortBatchesByExpiry(batches);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-text-primary">
          Greedy FEFO Allocation Visualization
        </h3>
      </div>

      {/* Sorted Batches */}
      <div className="p-4 bg-app-bg rounded-lg">
        <div className="text-xs text-text-muted mb-3">
          Step 1: Sort batches by expiry date (earliest first)
        </div>
        <div className="flex gap-2 flex-wrap">
          {sortedBatches.map((batch, i) => {
            const allocInfo = allocation?.allocations.find(
              (a) => a.batchCode === batch.code
            );
            return (
              <div
                key={batch.id}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  allocInfo
                    ? "border-success bg-success-light scale-105"
                    : "border-border-color bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{batch.code}</span>
                </div>
                <div className="text-xs text-text-muted">
                  Expiry: {batch.expiry}
                </div>
                <div className="text-xs text-text-muted">
                  Available: {batch.available}
                </div>
                {allocInfo && (
                  <div className="mt-2 pt-2 border-t border-success">
                    <div className="text-xs font-bold text-success">
                      ✓ Allocated: {allocInfo.allocated}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Greedy Steps */}
      {showSteps && allocation && (
        <div className="p-4 bg-info-light rounded-lg">
          <div className="text-xs text-text-muted mb-3">
            Step 2: Greedy allocation (take from earliest expiry until
            requirement met)
          </div>
          <div className="space-y-2">
            {allocation.allocations.map((alloc, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Badge variant="success">Step {i + 1}</Badge>
                <span>
                  Take <strong>{alloc.allocated}</strong> units from batch{" "}
                  <code className="bg-white px-2 py-0.5 rounded">
                    {alloc.batchCode}
                  </code>{" "}
                  (expires: {alloc.expiry})
                </span>
                <ArrowRight className="w-4 h-4 text-success" />
                <span className="text-success font-medium">Greedy Choice!</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-info flex items-center gap-2">
              {allocation.isFullyAllocated ? (
                <>
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">
                    Fully allocated! Total: {allocation.totalAllocated} units
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="text-warning font-medium">
                    Partially allocated: {allocation.totalAllocated} units
                    (short by {allocation.remaining})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="p-3 bg-white rounded-lg border text-xs text-text-muted">
        <strong>Why Greedy?</strong> At each step, we make the locally optimal
        choice (batch with earliest expiry) without reconsidering. This ensures
        minimum wastage as medicines closer to expiry are used first.
      </div>
    </div>
  );
}

export default function Dispense() {
  const [searchParams] = useSearchParams();
  const [prescriptionId, setPrescriptionId] = useState(
    searchParams.get("prescriptionId") || ""
  );
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDSAModal, setShowDSAModal] = useState(false);
  const [dispenseResult, setDispenseResult] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Auto-load if prescriptionId from URL
  React.useEffect(() => {
    const urlPrescriptionId = searchParams.get("prescriptionId");
    if (urlPrescriptionId) {
      setPrescriptionId(urlPrescriptionId);
      handleLoadPrescription(urlPrescriptionId);
    }
  }, [searchParams]);

  const handleLoadPrescription = async (id) => {
    if (!id || !id.trim()) {
      setModalMessage("Please enter a prescription ID");
      setShowErrorModal(true);
      return;
    }
    setLoading(true);
    try {
      const response = await getPrescription(id);
      const data = response.data?.data;
      if (data) {
        setPrescription(data);
      } else {
        setModalMessage("Prescription not found");
        setShowErrorModal(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading prescription:", error);
      setModalMessage(
        "Failed to load prescription: " +
          (error.response?.data?.message || error.message)
      );
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    handleLoadPrescription(prescriptionId);
  };

  const handleDispense = async () => {
    if (!prescription) return;
    setShowConfirmModal(true);
  };

  const confirmDispense = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const response = await processDispense(prescription._id);
      setDispenseResult(response.data?.data);
      setModalMessage(
        "Prescription dispensed successfully! Bill created. Redirecting to history..."
      );
      setShowSuccessModal(true);
      setLoading(false);

      // Reset for next prescription and redirect after 2 seconds
      setPrescription(null);
      setPrescriptionId("");

      setTimeout(() => {
        window.location.href = "/history";
      }, 2000);
    } catch (error) {
      console.error("Error dispensing:", error);
      setModalMessage(
        "Failed to dispense: " +
          (error.response?.data?.message || error.message)
      );
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Available: "success",
      Partial: "warning",
      Unavailable: "error",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            Dispense Medicine
          </h1>
          <p className="text-gray-500 mt-1">
            Process prescriptions with Greedy FEFO allocation -
            First-Expiry-First-Out
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowDSAModal(true)}>
          <Eye className="w-4 h-4 mr-2" />
          View Algorithm
        </Button>
      </div>

      {/* Info Banner */}
      <Card>
        <Card.Body className="p-4 bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                FEFO (First-Expiry-First-Out) Dispensing
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Medicines are automatically allocated from batches with earliest
                expiry dates to minimize wastage
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Algorithm Info */}
      <Card>
        <Card.Body className="p-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">
                Greedy FEFO (First-Expiry-First-Out) Algorithm
              </p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                A greedy algorithm that always selects the batch with the
                earliest expiry date first. This locally optimal choice ensures
                medicines are dispensed before they expire, minimizing wastage.
              </p>
              <div className="flex gap-3 mt-3 text-xs flex-wrap">
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-green-200">
                  Sort: O(n log n)
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-green-200">
                  Allocate: O(n)
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-green-200">
                  Total: O(n log n)
                </span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Search Prescription */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-medium">Search Prescription</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter prescription ID (e.g., PRX-2026-001) or press Search for demo"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" loading={loading}>
              <Play className="w-4 h-4 mr-2" />
              Search & Allocate
            </Button>
          </form>
        </Card.Body>
      </Card>

      {/* Prescription Details */}
      {prescription ? (
        <div className="space-y-4">
          {/* Data Quality Warning */}
          {(!prescription.patientId?.name ||
            prescription.items?.some((item) => !item.medicineId?.name)) && (
            <Card>
              <Card.Body className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Incomplete Data
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Some patient or medicine details are missing. This may be
                      from older prescriptions. The system will still process
                      the dispense.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Patient Info */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Prescription Details</h2>
                <Badge
                  variant={
                    prescription.status === "queued" ? "info" : "success"
                  }
                >
                  {prescription.status || "Pending"}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-text-muted">Prescription ID</p>
                  <p className="font-medium text-text-primary mt-1">
                    <code className="text-xs bg-info-light px-2 py-1 rounded">
                      {prescription._id?.slice(-8).toUpperCase() || "N/A"}
                    </code>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Patient Name</p>
                  <p className="font-medium text-text-primary mt-1">
                    {prescription.patientId?.name ||
                      prescription.patientName || (
                        <span className="text-gray-400 italic">
                          Not Available
                        </span>
                      )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Doctor</p>
                  <p className="font-medium text-text-primary mt-1">
                    {prescription.doctor || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Department</p>
                  <p className="font-medium text-text-primary mt-1">
                    {prescription.department || "N/A"}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Items to Dispense */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Medicines to Dispense</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {prescription.items?.map((item, index) => (
                  <div
                    key={item._id || `item-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.medicineId?.name || (
                          <span>
                            <span className="text-gray-400 italic">
                              Medicine ID:{" "}
                            </span>
                            <code className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                              {typeof item.medicineId === "string"
                                ? item.medicineId.slice(-8).toUpperCase()
                                : item.medicineId}
                            </code>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dosage: {item.dosage} • Quantity: {item.quantity}
                      </p>
                    </div>
                    <Badge variant="info">Pending</Badge>
                  </div>
                )) || <p className="text-gray-500">No items</p>}
              </div>
            </Card.Body>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPrescription(null);
                setPrescriptionId("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDispense}
              loading={loading}
              className="bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Dispensing
            </Button>
          </div>

          {dispenseResult && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-medium text-success">
                  Dispensing Complete!
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    {dispenseResult.dispense?.status === "full"
                      ? "Fully Dispensed"
                      : "Partially Dispensed"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Bill Total: ₹{dispenseResult.bill?.total || 0}
                  </p>
                  {dispenseResult.dispense?.backorderItems?.length > 0 && (
                    <div className="mt-2 p-2 bg-warning-light rounded">
                      <p className="text-sm text-warning font-medium">
                        Some items were out of stock
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      ) : (
        !loading && (
          <Card>
            <Card.Body className="py-12">
              <EmptyState
                icon={Package}
                title="Search for a Prescription"
                description="Enter a prescription ID above to load and dispense medicines"
              />
            </Card.Body>
          </Card>
        )
      )}

      {/* DSA Modal */}
      <Dialog open={showDSAModal} onOpenChange={setShowDSAModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md shadow-green-500/20">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <DialogTitle className="font-bold text-gray-900">
                  Greedy FEFO Algorithm
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Understanding how First-Expiry-First-Out minimizes medicine
                  wastage
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {/* Theory Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-green-500 text-white flex items-center justify-center text-xs">
                  📚
                </span>
                What is the Greedy FEFO Algorithm?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The <strong className="text-green-700">Greedy FEFO</strong>{" "}
                (First-Expiry-First-Out) algorithm is a greedy approach that
                makes locally optimal choices at each step. It always selects
                the batch with the <strong>earliest expiry date</strong> that
                has available stock. This ensures medicines closest to
                expiration are used first, minimizing wastage.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <h4 className="font-semibold text-xs text-green-700 mb-1">
                    Greedy Choice Property
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    At each step, pick the batch expiring soonest. This local
                    choice leads to global optimal for FEFO.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <h4 className="font-semibold text-xs text-green-700 mb-1">
                    Optimal Substructure
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    After allocating from one batch, the remaining problem has
                    the same structure - allocate remaining quantity.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Here */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                  ⚙️
                </span>
                How It Works in This Application
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Sort Batches
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By expiry date ascending
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Greedy Select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pick earliest expiring batch
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium text-gray-900">Allocate</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Take min(needed, available)
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    4
                  </div>
                  <p className="text-sm font-medium text-gray-900">Repeat</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Until fully allocated
                  </p>
                </div>
              </div>
            </div>

            {/* C++ Code Section */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm ml-2">
                    fefo_algorithm.cpp
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  C++ Implementation
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`struct Batch {
    string code;
    Date expiryDate;
    int available;
};

struct Allocation {
    string batchCode;
    int quantity;
};

// Greedy FEFO Algorithm - O(n log n)
vector<Allocation> greedyFEFO(int requiredQty, vector<Batch>& batches) {
    // Step 1: Sort batches by expiry date - O(n log n)
    sort(batches.begin(), batches.end(), 
        [](const Batch& a, const Batch& b) {
            return a.expiryDate < b.expiryDate;
        });
    
    vector<Allocation> result;
    int remaining = requiredQty;
    
    // Step 2: Greedy allocation - O(n)
    for (const Batch& batch : batches) {
        if (remaining <= 0) break;  // Fully allocated
        
        // Greedy choice: take as much as possible from earliest expiry
        int allocate = min(remaining, batch.available);
        
        if (allocate > 0) {
            result.push_back({batch.code, allocate});
            remaining -= allocate;
        }
    }
    
    return result;  // Total: O(n log n)
}

// Usage Example
int main() {
    vector<Batch> batches = {
        {"B2024-001", Date(2025,3,15), 50},
        {"B2024-023", Date(2025,6,20), 100},
        {"B2024-045", Date(2025,12,31), 150}
    };
    
    auto allocations = greedyFEFO(80, batches);
    // Returns: [{"B2024-001", 50}, {"B2024-023", 30}]
}`}</code>
              </pre>
            </div>

            {/* Real-World Use Cases */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏥</span> Pharmacy Applications
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Medicine dispensing systems</li>
                  <li>• Hospital inventory management</li>
                  <li>• Drug distribution centers</li>
                  <li>• Automated dispensing cabinets</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏭</span> Other Industries
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Food & beverage inventory</li>
                  <li>• Blood bank management</li>
                  <li>• Cosmetics with shelf life</li>
                  <li>• Chemical storage systems</li>
                </ul>
              </div>
            </div>

            {/* Sample FEFO Visualization */}
            {prescription && prescription.items.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                    🎯
                  </span>
                  Current Prescription FEFO Allocation
                </h3>
                <div className="space-y-4">
                  {prescription.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          {item.medicine}
                        </h4>
                        <Badge
                          variant={
                            item.status === "Available" ? "success" : "warning"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <FEFOVisualizer
                        batches={item.batches}
                        allocation={item.allocation}
                        showSteps={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Demo */}
            {(!prescription || prescription.items.length === 0) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                    🎯
                  </span>
                  Sample FEFO Allocation Demo
                </h3>
                {(() => {
                  const demoBatches = [
                    {
                      id: 1,
                      code: "B2024-001",
                      expiry: "2025-03-15",
                      available: 50,
                    },
                    {
                      id: 2,
                      code: "B2024-023",
                      expiry: "2025-06-20",
                      available: 100,
                    },
                    {
                      id: 3,
                      code: "B2024-045",
                      expiry: "2025-12-31",
                      available: 150,
                    },
                  ];
                  const demoAllocation = greedyFEFOAllocation(80, demoBatches);
                  return (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">
                        Example: Allocating 80 units of Paracetamol 500mg from
                        available batches
                      </p>
                      <FEFOVisualizer
                        batches={demoBatches}
                        allocation={demoAllocation}
                        showSteps={true}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Performance Comparison */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm">
                  ⚡
                </span>
                Comparison: FEFO vs Other Strategies
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-amber-200">
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Strategy
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900">
                        Wastage Prevention
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900">
                        Complexity
                      </th>
                      <th className="text-center p-3 font-semibold text-amber-700 bg-amber-100 rounded-t-lg">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    <tr className="bg-amber-50">
                      <td className="p-3 font-bold text-green-700">FEFO ✓</td>
                      <td className="text-center p-3">
                        <Badge variant="success">Excellent</Badge>
                      </td>
                      <td className="text-center p-3 font-mono">O(n log n)</td>
                      <td className="p-3 text-xs font-medium">
                        Pharmaceuticals, perishables
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">FIFO</td>
                      <td className="text-center p-3">
                        <Badge variant="warning">Moderate</Badge>
                      </td>
                      <td className="text-center p-3 font-mono">O(1)</td>
                      <td className="p-3 text-xs">Non-perishable inventory</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">LIFO</td>
                      <td className="text-center p-3">
                        <Badge variant="error">Poor</Badge>
                      </td>
                      <td className="text-center p-3 font-mono">O(1)</td>
                      <td className="p-3 text-xs">Not for medicines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                FEFO guarantees optimal wastage reduction for medicines with
                expiry dates
              </p>
            </div>

            {/* Try It Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gray-700 text-white flex items-center justify-center text-sm">
                  🧪
                </span>
                Try It Yourself
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Search for a prescription above (or use ID:{" "}
                <code className="bg-white px-2 py-1 rounded border border-blue-200">
                  PRX-2026-001
                </code>
                ) to see FEFO allocation in action with real batch data.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 1: Sort by expiry
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 2: Greedy select
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 3: Allocate
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 4: Repeat
                </div>
              </div>
            </div>
          </div>
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

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Dispensing
            </DialogTitle>
          </DialogHeader>
          <p className="text-text-primary text-base py-4">
            Dispense prescription for{" "}
            <strong>{prescription?.patientId?.name || "patient"}</strong>?
          </p>
          <DialogFooter className="mt-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={confirmDispense} className="flex-1">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
