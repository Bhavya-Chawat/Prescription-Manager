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
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDSAModal, setShowDSAModal] = useState(false);
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  const [searchTime, setSearchTime] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    manufacturer: "",
    unit: "Tablet",
    minStockLevel: 10,
    maxStockLevel: 100,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    category: "",
    unit: "",
    minStock: 0,
  });

  // Sample batches data for each medicine
  const batchesData = {
    MED001: [
      {
        id: 1,
        batchCode: "B2024-001",
        quantity: 100,
        expiry: "2025-03-15",
        manufacturer: "PharmaCo",
        purchaseDate: "2024-01-10",
      },
      {
        id: 2,
        batchCode: "B2024-023",
        quantity: 100,
        expiry: "2025-06-20",
        manufacturer: "PharmaCo",
        purchaseDate: "2024-02-15",
      },
      {
        id: 3,
        batchCode: "B2024-045",
        quantity: 50,
        expiry: "2025-12-31",
        manufacturer: "MediSupply",
        purchaseDate: "2024-03-20",
      },
    ],
    MED002: [
      {
        id: 4,
        batchCode: "B2024-012",
        quantity: 60,
        expiry: "2025-05-10",
        manufacturer: "AntibioCorp",
        purchaseDate: "2024-01-25",
      },
      {
        id: 5,
        batchCode: "B2024-067",
        quantity: 60,
        expiry: "2025-08-25",
        manufacturer: "AntibioCorp",
        purchaseDate: "2024-02-28",
      },
    ],
    MED003: [
      {
        id: 6,
        batchCode: "B2024-034",
        quantity: 10,
        expiry: "2025-02-28",
        manufacturer: "HealthPharma",
        purchaseDate: "2024-01-05",
      },
      {
        id: 7,
        batchCode: "B2024-089",
        quantity: 5,
        expiry: "2025-11-15",
        manufacturer: "HealthPharma",
        purchaseDate: "2024-04-10",
      },
    ],
    MED004: [
      {
        id: 8,
        batchCode: "B2024-INS-001",
        quantity: 5,
        expiry: "2025-01-20",
        manufacturer: "InsulinCare",
        purchaseDate: "2024-01-02",
      },
    ],
    MED005: [
      {
        id: 9,
        batchCode: "B2024-056",
        quantity: 90,
        expiry: "2025-07-15",
        manufacturer: "DiabetesCo",
        purchaseDate: "2024-02-01",
      },
      {
        id: 10,
        batchCode: "B2024-078",
        quantity: 90,
        expiry: "2025-09-30",
        manufacturer: "DiabetesCo",
        purchaseDate: "2024-03-15",
      },
    ],
    MED006: [
      {
        id: 11,
        batchCode: "B2024-099",
        quantity: 95,
        expiry: "2025-08-20",
        manufacturer: "GastroPharma",
        purchaseDate: "2024-02-20",
      },
    ],
    MED007: [
      {
        id: 12,
        batchCode: "B2024-110",
        quantity: 100,
        expiry: "2025-10-15",
        manufacturer: "CardioCare",
        purchaseDate: "2024-03-01",
      },
      {
        id: 13,
        batchCode: "B2024-125",
        quantity: 100,
        expiry: "2026-01-30",
        manufacturer: "CardioCare",
        purchaseDate: "2024-04-05",
      },
    ],
    MED008: [
      {
        id: 14,
        batchCode: "B2024-088",
        quantity: 8,
        expiry: "2025-04-10",
        manufacturer: "HeartMeds",
        purchaseDate: "2024-01-18",
      },
    ],
  };

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

  // Handle Batches button click
  const handleBatchesClick = (medicine) => {
    setSelectedMedicine(medicine);
    setIsBatchesDialogOpen(true);
  };

  // Handle Edit form submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setMedicines(
      medicines.map((med) =>
        med.id === selectedMedicine.id ? { ...med, ...editFormData } : med
      )
    );
    setIsEditDialogOpen(false);
    setSelectedMedicine(null);
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
      // Simulated data - replace with actual API call
      setTimeout(() => {
        setMedicines([
          {
            id: 1,
            code: "MED001",
            name: "Paracetamol 500mg",
            category: "Analgesic",
            stock: 250,
            minStock: 50,
            unit: "Tablet",
            status: "In Stock",
          },
          {
            id: 2,
            code: "MED002",
            name: "Amoxicillin 250mg",
            category: "Antibiotic",
            stock: 120,
            minStock: 40,
            unit: "Capsule",
            status: "In Stock",
          },
          {
            id: 3,
            code: "MED003",
            name: "Aspirin 100mg",
            category: "Analgesic",
            stock: 15,
            minStock: 30,
            unit: "Tablet",
            status: "Low Stock",
          },
          {
            id: 4,
            code: "MED004",
            name: "Insulin Glargine",
            category: "Diabetes",
            stock: 5,
            minStock: 10,
            unit: "Vial",
            status: "Critical",
          },
          {
            id: 5,
            code: "MED005",
            name: "Metformin 500mg",
            category: "Diabetes",
            stock: 180,
            minStock: 60,
            unit: "Tablet",
            status: "In Stock",
          },
          {
            id: 6,
            code: "MED006",
            name: "Omeprazole 20mg",
            category: "Gastrointestinal",
            stock: 95,
            minStock: 40,
            unit: "Capsule",
            status: "In Stock",
          },
          {
            id: 7,
            code: "MED007",
            name: "Atorvastatin 10mg",
            category: "Cardiovascular",
            stock: 200,
            minStock: 50,
            unit: "Tablet",
            status: "In Stock",
          },
          {
            id: 8,
            code: "MED008",
            name: "Lisinopril 5mg",
            category: "Cardiovascular",
            stock: 8,
            minStock: 30,
            unit: "Tablet",
            status: "Critical",
          },
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching medicines:", error);
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
    // Add medicine to hash table and list
    const newMed = {
      id: medicines.length + 1,
      code: formData.code.toUpperCase(),
      name: formData.name,
      category: formData.category,
      stock: 0,
      minStock: parseInt(formData.minStockLevel),
      unit: formData.unit,
      status: "Low Stock",
    };

    setMedicines([...medicines, newMed]);
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      name: "",
      code: "",
      category: "",
      manufacturer: "",
      unit: "Tablet",
      minStockLevel: 10,
      maxStockLevel: 100,
    });
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Add a new medicine to the inventory database
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMedicine}>
            <div className="space-y-4">
              <Input
                label="Medicine Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Paracetamol 500mg"
              />

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-3 gap-4">
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
                  label="Min Stock"
                  type="number"
                  required
                  value={formData.minStockLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, minStockLevel: e.target.value })
                  }
                />

                <Input
                  label="Max Stock"
                  type="number"
                  required
                  value={formData.maxStockLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, maxStockLevel: e.target.value })
                  }
                />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>
              Update medicine details for {selectedMedicine?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <Input
                label="Medicine Name"
                required
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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

      {/* Batches Dialog */}
      <Dialog open={isBatchesDialogOpen} onOpenChange={setIsBatchesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              Batch Details - {selectedMedicine?.name}
            </DialogTitle>
            <DialogDescription>
              View all batches for {selectedMedicine?.code} sorted by expiry
              date (FEFO)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-gray-600">
                  {(selectedMedicine &&
                    batchesData[selectedMedicine.code]?.length) ||
                    0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {(selectedMedicine &&
                    batchesData[selectedMedicine.code]?.reduce(
                      (sum, b) => sum + b.quantity,
                      0
                    )) ||
                    0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <p className="text-sm text-gray-600">Earliest Expiry</p>
                <p className="text-lg font-bold text-amber-600">
                  {(selectedMedicine &&
                    batchesData[selectedMedicine.code]?.[0]?.expiry) ||
                    "N/A"}
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
                  {selectedMedicine &&
                    batchesData[selectedMedicine.code]
                      ?.sort((a, b) => new Date(a.expiry) - new Date(b.expiry))
                      .map((batch, index) => {
                        const expiryDate = new Date(batch.expiry);
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
                          <Table.Row key={batch.id}>
                            <Table.Cell>
                              <div className="flex items-center gap-2">
                                {index === 0 && (
                                  <Badge variant="info" size="sm">
                                    FEFO
                                  </Badge>
                                )}
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {batch.batchCode}
                                </code>
                              </div>
                            </Table.Cell>
                            <Table.Cell className="font-semibold">
                              {batch.quantity}
                            </Table.Cell>
                            <Table.Cell>{batch.expiry}</Table.Cell>
                            <Table.Cell>{batch.manufacturer}</Table.Cell>
                            <Table.Cell className="text-gray-500">
                              {batch.purchaseDate}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge variant={expiryStatus}>
                                {expiryLabel}
                              </Badge>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                <Hash className="w-6 h-6 text-white" />
              </div>
              Hash Table Data Structure
            </DialogTitle>
            <DialogDescription>
              Understanding O(1) constant-time lookup for medicine inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6">
            {/* Theory Section */}
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl text-white">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  📚 What is a Hash Table?
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  A Hash Table is a data structure that stores key-value pairs
                  and provides <strong>O(1) average-case</strong> time
                  complexity for insertion, deletion, and lookup operations. It
                  uses a hash function to compute an index into an array of
                  buckets, from which the desired value can be found.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                    Insert: O(1)
                  </div>
                  <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
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
    </div>
  );
}
