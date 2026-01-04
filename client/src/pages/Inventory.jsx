import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Package,
  AlertCircle,
  Hash,
  Clock,
  Eye,
  EyeOff,
  Zap,
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
  createMedicine,
  getAllMedicines,
  updateMedicine,
  createBatch,
  getBatchesForMedicine,
} from "../services/inventoryApi";

// ============================================
// DSA: HASH TABLE IMPLEMENTATION
// ============================================
class MedicineHashTable {
  constructor(size = 16) {
    this.size = size;
    this.buckets = new Array(size).fill(null).map(() => []);
    this.count = 0;
  }

  // Hash function: converts medicine code to bucket index
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  // O(1) average case insertion
  set(key, value) {
    const index = this._hash(key);
    const bucket = this.buckets[index];

    // Check if key already exists (update)
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return { index, collision: bucket.length > 1 };
      }
    }

    // Add new entry
    bucket.push([key, value]);
    this.count++;
    return { index, collision: bucket.length > 1 };
  }

  // O(1) average case lookup
  get(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];

    for (const [k, v] of bucket) {
      if (k === key) return { value: v, index, found: true };
    }
    return { value: null, index, found: false };
  }

  // Get all entries
  entries() {
    const result = [];
    for (let i = 0; i < this.buckets.length; i++) {
      for (const [key, value] of this.buckets[i]) {
        result.push({ key, value, bucketIndex: i });
      }
    }
    return result;
  }

  // Get bucket visualization data
  getBuckets() {
    return this.buckets.map((bucket, index) => ({
      index,
      items: bucket.map(([key, value]) => ({ key, value })),
      hasCollision: bucket.length > 1,
    }));
  }
}

// Hash Table Visualization Component
function HashTableVisualizer({ hashTable, highlightedBucket, searchKey }) {
  const buckets = hashTable.getBuckets();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-text-primary">
          Hash Table Structure
        </h3>
        <span className="text-xs text-text-muted">
          ({hashTable.size} buckets)
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {buckets.map((bucket) => (
          <div
            key={bucket.index}
            className={`p-2 rounded-lg border-2 transition-all duration-300 min-h-[80px] ${
              highlightedBucket === bucket.index
                ? "border-primary bg-primary-light scale-105 shadow-lg"
                : bucket.items.length > 0
                ? bucket.hasCollision
                  ? "border-warning bg-warning-light"
                  : "border-success bg-success-light"
                : "border-border-color bg-app-bg"
            }`}
          >
            <div className="text-xs font-mono text-text-muted mb-1">
              [{bucket.index}]
            </div>
            {bucket.items.map((item, i) => (
              <div
                key={i}
                className={`text-xs truncate ${
                  searchKey === item.key
                    ? "font-bold text-primary"
                    : "text-text-primary"
                }`}
                title={item.key}
              >
                {item.key.slice(0, 6)}
              </div>
            ))}
            {bucket.items.length === 0 && (
              <div className="text-xs text-text-muted italic">empty</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs mt-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success-light border border-success"></div>
          <span>Filled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning-light border border-warning"></div>
          <span>Collision</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary-light border border-primary"></div>
          <span>Searching</span>
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBatchesDialogOpen, setIsBatchesDialogOpen] = useState(false);
  const [isAddBatchDialogOpen, setIsAddBatchDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDSAModal, setShowDSAModal] = useState(false);
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  const [searchTime, setSearchTime] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    manufacturer: "",
    unit: "Tablet",
    unitPrice: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    addBatch: true,
    batchNumber: "",
    batchQuantity: "",
    batchExpiry: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    category: "",
    unit: "",
    minStock: 0,
  });
  const [batchFormData, setBatchFormData] = useState({
    batchNumber: "",
    quantity: "",
    expiryDate: "",
  });
  const [medicineBatches, setMedicineBatches] = useState([]);

  // Handle Edit button click
  const handleEditClick = (medicine) => {
    setSelectedMedicine(medicine);
    setEditFormData({
      name: medicine.name,
      code: medicine.code,
      category: medicine.category,
      unit: medicine.unit,
      minStock: medicine.minStock,
    });
    setIsEditDialogOpen(true);
  };

  // Handle Add Batch button click
  const handleAddBatchClick = (medicine) => {
    setSelectedMedicine(medicine);
    setBatchFormData({
      batchNumber: "",
      quantity: "",
      expiryDate: "",
    });
    setIsAddBatchDialogOpen(true);
  };

  // Handle Batches button click
  const handleBatchesClick = async (medicine) => {
    setSelectedMedicine(medicine);
    setMedicineBatches([]);
    setIsBatchesDialogOpen(true);

    // Fetch batches for this medicine
    try {
      const response = await getBatchesForMedicine(medicine.id);
      setMedicineBatches(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setMedicineBatches([]);
    }
  };

  // Handle Add Batch form submit
  const handleAddBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBatch({
        medicineId: selectedMedicine.id,
        batchNumber: batchFormData.batchNumber,
        quantity: parseInt(batchFormData.quantity),
        expiryDate: batchFormData.expiryDate,
      });

      // Refresh medicines to update stock
      await fetchMedicines();

      setIsAddBatchDialogOpen(false);
      setBatchFormData({
        batchNumber: "",
        quantity: "",
        expiryDate: "",
      });
      setModalMessage("Batch added successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding batch:", error);
      setModalMessage("Failed to add batch");
      setShowErrorModal(true);
    }
  };

  // Handle Edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicine(selectedMedicine.id, {
        name: editFormData.name,
        code: editFormData.code,
        category: editFormData.category,
        unit: editFormData.unit,
        minStockLevel: parseInt(editFormData.minStock),
      });

      // Refresh medicines list
      await fetchMedicines();

      setIsEditDialogOpen(false);
      setSelectedMedicine(null);
      setModalMessage("Medicine updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating medicine:", error);
      setModalMessage("Failed to update medicine");
      setShowErrorModal(true);
    }
  };

  // Create and populate hash table from medicines
  const hashTable = useMemo(() => {
    const ht = new MedicineHashTable(16);
    medicines.forEach((med) => ht.set(med.code, med));
    return ht;
  }, [medicines]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await getAllMedicines();
      console.log("Full API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response data.data:", response.data?.data);

      const data = response.data?.data || [];
      console.log("Extracted medicines array:", data);
      console.log("Number of medicines:", data.length);

      // Map backend data to frontend format
      const mapped = data.map((med, index) => {
        console.log(`Mapping medicine ${index}:`, med);
        const threshold = med.reorderThreshold || med.minStockLevel || 10;
        const stock = med.totalStock || 0;
        const criticalThreshold = threshold * 0.3;

        // Determine status based on stock vs threshold
        // Critical: < 30% of threshold, Low: 30%-99% of threshold, In Stock: >= threshold
        let status = "In Stock";
        if (stock === 0 || stock < criticalThreshold) {
          status = "Critical";
        } else if (stock >= criticalThreshold && stock < threshold) {
          status = "Low Stock";
        }

        console.log(
          `  ${med.code}: stock=${stock}, threshold=${threshold}, critical=${criticalThreshold}, status=${status}`
        );

        return {
          id: med._id || index + 1,
          code: med.code,
          name: med.name,
          category: med.category,
          stock: stock,
          minStock: threshold,
          unit: med.unit,
          unitPrice: med.unitPrice || 0,
          manufacturer: med.manufacturer || "",
          status: status,
        };
      });

      console.log("Final mapped medicines:", mapped);
      console.log("Setting medicines state with:", mapped.length, "items");
      setMedicines(mapped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      console.error("Error details:", error.response);
      setMedicines([]);
      setLoading(false);
    }
  };

  // O(1) Hash Table Search with visualization
  const handleHashSearch = (term) => {
    setSearchTerm(term);

    if (term.startsWith("MED")) {
      const start = performance.now();
      const result = hashTable.get(term.toUpperCase());
      const end = performance.now();

      setSearchTime((end - start).toFixed(3));
      setHighlightedBucket(result.index);
      setSearchResult(result);

      // Clear highlight after 2 seconds
      setTimeout(() => setHighlightedBucket(null), 2000);
    } else {
      setSearchTime(null);
      setSearchResult(null);
      setHighlightedBucket(null);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      // Prepare medicine data with initial batch if provided
      const medicineData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        category: formData.category,
        manufacturer: formData.manufacturer,
        unit: formData.unit,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        minStockLevel: parseInt(formData.minStockLevel),
        maxStockLevel: parseInt(formData.maxStockLevel),
      };

      // Add initial batch if user selected to add it
      if (
        formData.addBatch &&
        formData.batchNumber &&
        formData.batchQuantity &&
        formData.batchExpiry
      ) {
        medicineData.initialBatch = {
          batchNumber: formData.batchNumber,
          quantity: parseInt(formData.batchQuantity),
          expiryDate: formData.batchExpiry,
        };
      }

      // Create medicine with optional batch
      const medicineResponse = await createMedicine(medicineData);

      // Fetch updated list
      await fetchMedicines();

      setIsAddDialogOpen(false);
      // Reset form
      setFormData({
        name: "",
        code: "",
        category: "",
        manufacturer: "",
        unit: "Tablet",
        unitPrice: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        addBatch: true,
        batchNumber: "",
        batchQuantity: "",
        batchExpiry: "",
      });
      setModalMessage(
        "Medicine" +
          (formData.addBatch ? " and batch" : "") +
          " added successfully!"
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding medicine:", error);
      setModalMessage("Failed to add medicine");
      setShowErrorModal(true);
    }
  };

  // Filter medicines (O(n) linear search for name, O(1) for code via hash table)
  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (status) => {
    const variants = {
      "In Stock": "success",
      "Low Stock": "warning",
      Critical: "error",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            Medicine Inventory
          </h1>
          <p className="text-gray-500 mt-1">
            Fast medicine lookup powered by Hash Table (O(1) search)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowDSAModal(true)}>
            <Hash className="w-4 h-4 mr-2" />
            View Algorithm
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {medicines.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {medicines.filter((m) => m.status === "In Stock").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  {medicines.filter((m) => m.status === "Low Stock").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-error mt-1">
                  {medicines.filter((m) => m.status === "Critical").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Search with O(1) demo */}
      <Card>
        <Card.Body className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by medicine code (e.g., MED001) for O(1) lookup..."
                value={searchTerm}
                onChange={(e) => handleHashSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            {searchTime && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-success-light rounded-xl">
                <Zap className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">
                  O(1): {searchTime}ms
                </span>
                {searchResult?.found && (
                  <Badge variant="success" size="sm">
                    Bucket [{searchResult.index}]
                  </Badge>
                )}
                {searchResult && !searchResult.found && (
                  <Badge variant="error" size="sm">
                    Not found
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Medicines Table */}
      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Code</Table.Head>
              <Table.Head>Medicine Name</Table.Head>
              <Table.Head>Category</Table.Head>
              <Table.Head>Stock</Table.Head>
              <Table.Head>Min Stock</Table.Head>
              <Table.Head>Unit</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMedicines.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <EmptyState
                    icon={Package}
                    title="No medicines found"
                    description="Try adjusting your search or add a new medicine"
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredMedicines.map((medicine) => (
                <Table.Row key={medicine.id}>
                  <Table.Cell>
                    <code className="text-xs bg-info-light px-2 py-1 rounded">
                      {medicine.code}
                    </code>
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {medicine.name}
                  </Table.Cell>
                  <Table.Cell>{medicine.category}</Table.Cell>
                  <Table.Cell>{medicine.stock}</Table.Cell>
                  <Table.Cell>{medicine.minStock}</Table.Cell>
                  <Table.Cell>{medicine.unit}</Table.Cell>
                  <Table.Cell>{getStockBadge(medicine.status)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(medicine)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBatchClick(medicine)}
                      >
                        Add Batch
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBatchesClick(medicine)}
                      >
                        Batches
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Add Medicine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Add a new medicine to the inventory database
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMedicine}>
            <div className="space-y-3 px-4 py-3">
              <Input
                label="Medicine Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Paracetamol 500mg"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Medicine Code"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="MED001"
                />

                <Input
                  label="Category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Analgesic"
                />
              </div>

              <Input
                label="Manufacturer"
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturer: e.target.value })
                }
                placeholder="Company name"
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Unit"
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="Tablet"
                />

                <Input
                  label="Unit Price (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.unitPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                />

                <Input
                  label="Min Stock"
                  type="number"
                  required
                  value={formData.minStockLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, minStockLevel: e.target.value })
                  }
                />
              </div>

              <Input
                label="Max Stock"
                type="number"
                required
                value={formData.maxStockLevel}
                onChange={(e) =>
                  setFormData({ ...formData, maxStockLevel: e.target.value })
                }
              />

              {/* Batch Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="addBatch"
                    checked={formData.addBatch}
                    onChange={(e) =>
                      setFormData({ ...formData, addBatch: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="addBatch"
                    className="text-sm font-medium text-gray-700"
                  >
                    Add Initial Batch (Stock)
                  </label>
                </div>

                {formData.addBatch && (
                  <div className="space-y-3 bg-gray-50 p-3 rounded">
                    <Input
                      label="Batch Number"
                      required={formData.addBatch}
                      value={formData.batchNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          batchNumber: e.target.value,
                        })
                      }
                      placeholder="e.g., BATCH-001"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        required={formData.addBatch}
                        value={formData.batchQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            batchQuantity: e.target.value,
                          })
                        }
                        placeholder="100"
                      />

                      <Input
                        label="Expiry Date"
                        type="date"
                        required={formData.addBatch}
                        value={formData.batchExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            batchExpiry: e.target.value,
                          })
                        }
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      💡 Batches help track expiry dates and follow FEFO (First
                      Expiry, First Out) dispensing
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Medicine</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>
              Update medicine details for {selectedMedicine?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="space-y-3 px-4 py-3">
              <Input
                label="Medicine Name"
                required
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Medicine Code"
                  required
                  value={editFormData.code}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, code: e.target.value })
                  }
                  disabled
                />

                <Input
                  label="Category"
                  required
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Unit"
                  required
                  value={editFormData.unit}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, unit: e.target.value })
                  }
                />

                <Input
                  label="Min Stock Level"
                  type="number"
                  required
                  value={editFormData.minStock}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      minStock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Batch Dialog */}
      <Dialog
        open={isAddBatchDialogOpen}
        onOpenChange={setIsAddBatchDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
            <DialogDescription>
              Add a new stock batch for {selectedMedicine?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBatchSubmit}>
            <div className="space-y-4 px-4 py-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Medicine</p>
                <p className="font-semibold text-gray-900">
                  {selectedMedicine?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Code: {selectedMedicine?.code} | Current Stock:{" "}
                  {selectedMedicine?.stock || 0}
                </p>
              </div>

              <Input
                label="Batch Number"
                required
                value={batchFormData.batchNumber}
                onChange={(e) =>
                  setBatchFormData({
                    ...batchFormData,
                    batchNumber: e.target.value,
                  })
                }
                placeholder="e.g., BATCH-001, B2026-001"
              />

              <Input
                label="Quantity"
                type="number"
                min="1"
                required
                value={batchFormData.quantity}
                onChange={(e) =>
                  setBatchFormData({
                    ...batchFormData,
                    quantity: e.target.value,
                  })
                }
                placeholder="Number of units"
              />

              <Input
                label="Expiry Date"
                type="date"
                required
                value={batchFormData.expiryDate}
                onChange={(e) =>
                  setBatchFormData({
                    ...batchFormData,
                    expiryDate: e.target.value,
                  })
                }
              />

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700">
                  <strong>💡 Tip:</strong> Batches help track expiry dates. The
                  system uses FEFO (First Expiry First Out) to automatically
                  dispense medicines expiring soonest.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddBatchDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Batch</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batches Dialog */}
      <Dialog open={isBatchesDialogOpen} onOpenChange={setIsBatchesDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-white" />
              </div>
              Batch Details - {selectedMedicine?.name}
            </DialogTitle>
            <DialogDescription>
              View all batches for {selectedMedicine?.code} sorted by expiry
              date (FEFO)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 p-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">Total Batches</p>
                <p className="text-lg font-bold text-gray-600">
                  {medicineBatches.length || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">Total Stock</p>
                <p className="text-lg font-bold text-green-600">
                  {selectedMedicine?.stock || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                <p className="text-xs text-gray-600">Earliest Expiry</p>
                <p className="text-lg font-bold text-amber-600">
                  {medicineBatches[0]?.expiryDate
                    ? new Date(
                        medicineBatches[0].expiryDate
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Batches Table */}
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Batch Code</Table.Head>
                    <Table.Head>Quantity</Table.Head>
                    <Table.Head>Expiry Date</Table.Head>
                    <Table.Head>Manufacturer</Table.Head>
                    <Table.Head>Purchase Date</Table.Head>
                    <Table.Head>Status</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {medicineBatches.length > 0 ? (
                    medicineBatches
                      .sort(
                        (a, b) =>
                          new Date(a.expiryDate) - new Date(b.expiryDate)
                      )
                      .map((batch, index) => {
                        const expiryDate = new Date(batch.expiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.ceil(
                          (expiryDate - today) / (1000 * 60 * 60 * 24)
                        );
                        let expiryStatus = "success";
                        let expiryLabel = "OK";
                        if (daysUntilExpiry < 30) {
                          expiryStatus = "error";
                          expiryLabel = "Expiring Soon";
                        } else if (daysUntilExpiry < 90) {
                          expiryStatus = "warning";
                          expiryLabel = "Monitor";
                        }

                        return (
                          <Table.Row key={batch._id || batch.id}>
                            <Table.Cell>
                              <div className="flex items-center gap-2">
                                {index === 0 && (
                                  <Badge variant="info" size="sm">
                                    FEFO
                                  </Badge>
                                )}
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {batch.batchNumber}
                                </code>
                              </div>
                            </Table.Cell>
                            <Table.Cell className="font-semibold">
                              {batch.quantity}
                            </Table.Cell>
                            <Table.Cell>
                              {new Date(batch.expiryDate).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                              {selectedMedicine?.manufacturer || "N/A"}
                            </Table.Cell>
                            <Table.Cell className="text-gray-500">
                              {new Date(
                                batch.receivedDate || batch.createdAt
                              ).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge variant={expiryStatus}>
                                {expiryLabel}
                              </Badge>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        No batches found for this medicine
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>

            {/* FEFO Info */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    FEFO (First-Expiry-First-Out)
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Batches are sorted by expiry date. The batch marked with
                    "FEFO" badge will be dispensed first to minimize wastage and
                    ensure medicines are used before they expire.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBatchesDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DSA Modal */}
      <Dialog open={showDSAModal} onOpenChange={setShowDSAModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md">
                <Hash className="w-4 h-4 text-white" />
              </div>
              Hash Table Data Structure
            </DialogTitle>
            <DialogDescription>
              Understanding O(1) constant-time lookup for medicine inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {/* Theory Section */}
            <div className="relative overflow-hidden p-4 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl text-white">
              <div className="relative z-10">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                  📚 What is a Hash Table?
                </h3>
                <p className="text-white/90 text-xs leading-relaxed mb-3">
                  A Hash Table is a data structure that stores key-value pairs
                  and provides <strong>O(1) average-case</strong> time
                  complexity for insertion, deletion, and lookup operations. It
                  uses a hash function to compute an index into an array of
                  buckets, from which the desired value can be found.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Insert: O(1)
                  </div>
                  <div className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Search: O(1)
                  </div>
                  <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    Delete: O(1)
                  </div>
                  <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    Space: O(n)
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* How It Works Here */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
                    🎯
                  </span>
                  How It Works Here
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">1.</span>
                    Medicine code (e.g., MED001) is passed to hash function
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">2.</span>
                    Hash function computes bucket index using character codes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">3.</span>
                    Medicine is stored in the computed bucket
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">4.</span>
                    Collisions handled via chaining (linked list in bucket)
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white text-sm">
                    🏥
                  </span>
                  Real-World Use Cases
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Database indexing and caching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Symbol tables in compilers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Password verification (hash storage)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    DNS lookups and routing tables
                  </li>
                </ul>
              </div>
            </div>

            {/* Live Visualization */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
                  🔍
                </span>
                Live Hash Table ({medicines.length} medicines in{" "}
                {hashTable.size} buckets)
              </h3>
              <HashTableVisualizer
                hashTable={hashTable}
                highlightedBucket={highlightedBucket}
                searchKey={searchTerm.toUpperCase()}
              />
            </div>

            {/* C++ Code Snippet */}
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <div className="px-5 py-3 bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-sm ml-2">
                    hash_table.cpp
                  </span>
                </div>
                <Badge variant="info" size="xs">
                  C++
                </Badge>
              </div>
              <pre className="p-5 bg-gray-900 text-sm overflow-x-auto">
                <code className="text-gray-100">{`class HashTable {
private:
    static const int SIZE = 16;
    vector<list<pair<string, Medicine>>> buckets;
    
    int hash(const string& key) {
        int hashValue = 0;
        for (char c : key) {
            hashValue = (hashValue * 31 + c) % SIZE;
        }
        return hashValue;
    }

public:
    HashTable() : buckets(SIZE) {}
    
    // O(1) average case insertion
    void insert(const string& code, const Medicine& med) {
        int index = hash(code);
        for (auto& pair : buckets[index]) {
            if (pair.first == code) {
                pair.second = med;  // Update existing
                return;
            }
        }
        buckets[index].push_back({code, med});
    }
    
    // O(1) average case lookup
    Medicine* search(const string& code) {
        int index = hash(code);
        for (auto& pair : buckets[index]) {
            if (pair.first == code) {
                return &pair.second;
            }
        }
        return nullptr;  // Not found
    }
};`}</code>
              </pre>
            </div>

            {/* Performance Comparison */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
                  ⚡
                </span>
                Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Operation
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-700">
                        Array
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-700">
                        Sorted Array
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-700 bg-green-100">
                        Hash Table
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-medium">Search</td>
                      <td className="text-center p-3 text-error">O(n)</td>
                      <td className="text-center p-3 text-warning">O(log n)</td>
                      <td className="text-center p-3 bg-green-50 font-bold text-success">
                        O(1)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Insert</td>
                      <td className="text-center p-3 text-success">O(1)</td>
                      <td className="text-center p-3 text-error">O(n)</td>
                      <td className="text-center p-3 bg-green-50 font-bold text-success">
                        O(1)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Delete</td>
                      <td className="text-center p-3 text-error">O(n)</td>
                      <td className="text-center p-3 text-error">O(n)</td>
                      <td className="text-center p-3 bg-green-50 font-bold text-success">
                        O(1)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Try It Out */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm">
                  🚀
                </span>
                Try It Yourself
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Close this modal and search for medicine codes in the search
                bar. Watch how the hash table provides instant O(1) lookup!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {medicines.slice(0, 4).map((med) => (
                  <div
                    key={med.id}
                    className="p-3 bg-white rounded-xl border border-green-200 shadow-sm"
                  >
                    <code className="font-bold text-primary block mb-1">
                      {med.code}
                    </code>
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {med.name}
                    </span>
                  </div>
                ))}
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
                <Package className="w-6 h-6 text-success" />
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
                <AlertCircle className="w-6 h-6 text-error" />
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
    </div>
  );
}
