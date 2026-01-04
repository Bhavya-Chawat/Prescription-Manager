import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  AlertTriangle,
  ArrowUp,
  Eye,
  EyeOff,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/Dialog";
import { snapshot, callNext } from "../services/queueApi";

// ============================================
// DSA: MIN-HEAP PRIORITY QUEUE IMPLEMENTATION
// ============================================
class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Get parent/child indices
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }
  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  // Priority values (lower = higher priority)
  getPriorityValue(priority) {
    const values = { Emergency: 0, High: 1, Normal: 2, Low: 3 };
    return values[priority] ?? 4;
  }

  // Compare by priority, then by arrival time
  compare(a, b) {
    const pA = this.getPriorityValue(a.priority);
    const pB = this.getPriorityValue(b.priority);
    if (pA !== pB) return pA - pB;
    return new Date(a.addedAt) - new Date(b.addedAt);
  }

  // Swap two elements
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // O(log n) insertion
  insert(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  // Bubble up to maintain heap property
  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else break;
    }
  }

  // O(log n) extract minimum (highest priority)
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }

  // Bubble down to maintain heap property
  heapifyDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = this.getLeftChildIndex(index);
      const right = this.getRightChildIndex(index);

      if (
        left < length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }
      if (
        right < length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else break;
    }
  }

  // Get sorted array (for display)
  getSortedArray() {
    const copy = new MinHeap();
    copy.heap = [...this.heap];
    const result = [];
    while (copy.heap.length > 0) {
      result.push(copy.extractMin());
    }
    return result;
  }

  peek() {
    return this.heap[0] || null;
  }

  size() {
    return this.heap.length;
  }

  getHeap() {
    return [...this.heap];
  }
}

// Min-Heap Tree Visualization Component
function MinHeapVisualizer({ heap, highlightedIndex }) {
  const heapArray = heap.getHeap();

  if (heapArray.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Queue is empty. Add patients to see the heap structure.</p>
      </div>
    );
  }

  // Calculate tree levels
  const levels = [];
  let levelStart = 0;
  let levelSize = 1;

  while (levelStart < heapArray.length) {
    levels.push(heapArray.slice(levelStart, levelStart + levelSize));
    levelStart += levelSize;
    levelSize *= 2;
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Emergency: "bg-error text-white",
      High: "bg-warning text-white",
      Normal: "bg-info text-white",
      Low: "bg-border-color text-text-primary",
    };
    return colors[priority] || "bg-app-bg";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-semibold text-text-primary">
          Min-Heap Tree Structure
        </h3>
        <span className="text-xs text-text-muted">
          (Root = Highest Priority)
        </span>
      </div>

      {/* Tree visualization */}
      <div className="flex flex-col items-center space-y-2">
        {levels.map((level, levelIndex) => (
          <div
            key={levelIndex}
            className="flex justify-center gap-2"
            style={{ width: "100%" }}
          >
            {level.map((item, itemIndex) => {
              const globalIndex = Math.pow(2, levelIndex) - 1 + itemIndex;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col items-center p-2 rounded-lg min-w-[80px] transition-all duration-300 ${getPriorityColor(
                    item.priority
                  )} ${
                    highlightedIndex === globalIndex
                      ? "ring-4 ring-primary scale-110"
                      : ""
                  }`}
                >
                  <div className="text-xs font-bold">{item.queueNumber}</div>
                  <div className="text-[10px] truncate max-w-[70px]">
                    {item.patientName.split(" ")[0]}
                  </div>
                  <div className="text-[10px] opacity-75">{item.priority}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-error"></div>
          <span>Emergency (0)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning"></div>
          <span>High (1)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-info"></div>
          <span>Normal (2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-border-color"></div>
          <span>Low (3)</span>
        </div>
      </div>

      {/* Heap array representation */}
      <div className="mt-4 p-3 bg-app-bg rounded-lg">
        <div className="text-xs text-text-muted mb-2">
          Array Representation:
        </div>
        <div className="flex gap-1 flex-wrap">
          {heapArray.map((item, i) => (
            <div
              key={item.id}
              className={`px-2 py-1 rounded text-xs ${
                highlightedIndex === i
                  ? "bg-primary text-white"
                  : "bg-white border"
              }`}
            >
              [{i}] {item.queueNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Queue() {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDSAModal, setShowDSAModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [operationLog, setOperationLog] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Create Min-Heap from queue items
  const priorityQueue = useMemo(() => {
    const heap = new MinHeap();
    queueItems.forEach((item) => heap.insert(item));
    return heap;
  }, [queueItems]);

  // Get sorted queue (by priority)
  const sortedQueue = useMemo(() => {
    return priorityQueue.getSortedArray();
  }, [priorityQueue]);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await snapshot();
      console.log("Full API Response:", response);
      const data = response.data?.data || [];
      console.log("Queue data (nested by priority):", data);

      // Flatten the priority lanes into a single array
      const flatData = data.flat();
      console.log("Flattened queue data:", flatData);

      const priorityNames = ["Emergency", "High", "Normal", "Low"];

      const mapped = flatData.map((item, index) => {
        console.log(`Mapping item ${index}:`, item);
        console.log(`  prescriptionId:`, item.prescriptionId);
        console.log(`  patientId:`, item.prescriptionId?.patientId);
        console.log(`  patient name:`, item.prescriptionId?.patientId?.name);

        return {
          id: item._id,
          queueNumber: `Q${String(index + 1).padStart(3, "0")}`,
          prescriptionId:
            item.prescriptionId?.prescriptionId ||
            item.prescriptionId?._id?.slice(-8) ||
            "N/A",
          fullPrescriptionId: item.prescriptionId?._id || item.prescriptionId,
          patientName: item.prescriptionId?.patientId?.name || "Unknown",
          priority: priorityNames[item.priority] || "Normal",
          items: item.prescriptionId?.items?.length || 0,
          addedAt: new Date(item.createdAt),
        };
      });

      console.log("Mapped queue items:", mapped);
      setQueueItems(mapped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching queue:", error);
      setQueueItems([]);
      setLoading(false);
    }
  };

  // Process next patient (demonstrates O(log n) extract-min)
  const handleProcessNext = async () => {
    if (sortedQueue.length === 0) return;

    const next = sortedQueue[0];

    // Confirm before processing
    if (!window.confirm(`Process prescription for ${next.patientName}?`)) {
      return;
    }

    setOperationLog([
      {
        time: new Date().toLocaleTimeString(),
        action: `EXTRACT-MIN`,
        detail: `Processing ${next.queueNumber} (${next.priority}) - O(log n)`,
      },
      ...operationLog.slice(0, 4),
    ]);

    // Highlight root before removal
    setHighlightedIndex(0);

    try {
      const response = await callNext();
      console.log("Call next response:", response);

      const calledEntry = response.data?.data;
      if (calledEntry && calledEntry.prescriptionId) {
        // Navigate to dispense page with prescription ID
        const prescriptionId =
          calledEntry.prescriptionId._id || calledEntry.prescriptionId;
        window.location.href = `/dispense?prescriptionId=${prescriptionId}`;
      } else {
        // Just refresh the queue if navigation info not available
        setTimeout(() => {
          fetchQueue();
          setHighlightedIndex(null);
        }, 1000);
      }
    } catch (error) {
      console.error("Error calling next:", error);
      setErrorMessage(
        "Failed to process next patient: " + (error.message || "Unknown error")
      );
      setShowErrorModal(true);
      setHighlightedIndex(null);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      Emergency: "error",
      High: "warning",
      Normal: "info",
      Low: "default",
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Emergency: "border-l-4 border-error bg-error-light",
      High: "border-l-4 border-warning bg-warning-light",
      Normal: "border-l-4 border-info bg-info-light",
      Low: "border-l-4 border-border-color bg-app-bg",
    };
    return colors[priority] || "";
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Patient Queue
          </h1>
          <p className="text-gray-500 mt-1">
            Priority-based queue using Min-Heap (O(log n) operations)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowDSAModal(true)}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            View Algorithm
          </Button>
          <Button
            onClick={handleProcessNext}
            disabled={sortedQueue.length === 0}
          >
            <Play className="w-4 h-4 mr-2" />
            Process Next
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Queue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {queueItems.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Emergency</p>
                <p className="text-2xl font-bold text-error mt-1">
                  {queueItems.filter((q) => q.priority === "Emergency").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  {queueItems.filter((q) => q.priority === "High").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Wait</p>
                <p className="text-2xl font-bold text-info mt-1">15m</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      {/* Algorithm Info */}
      <Card>
        <Card.Body className="p-4 bg-warning-light border border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Min-Heap Priority Queue Algorithm
              </p>
              <p className="text-sm text-text-muted mt-1">
                Patients are organized in a Min-Heap where the root always
                contains the highest-priority patient. Insert and extract
                operations maintain the heap property in O(log n) time.
              </p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="bg-white px-2 py-1 rounded">
                  Insert: O(log n)
                </span>
                <span className="bg-white px-2 py-1 rounded">
                  Extract-Min: O(log n)
                </span>
                <span className="bg-white px-2 py-1 rounded">Peek: O(1)</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      {/* Queue List */}
      <div className="space-y-3">
        {sortedQueue.length === 0 ? (
          <Card>
            <Card.Body>
              <EmptyState
                icon={Users}
                title="Queue is empty"
                description="No patients waiting for dispensing"
              />
            </Card.Body>
          </Card>
        ) : (
          sortedQueue.map((item, index) => (
            <Card key={item.id} className={getPriorityColor(item.priority)}>
              <Card.Body className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-text-primary">
                        {index + 1}
                      </div>
                      <div className="text-xs text-text-muted">Position</div>
                    </div>

                    <div className="border-l border-border-color pl-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-text-primary">
                            {item.patientName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-app-bg px-2 py-0.5 rounded">
                              {item.prescriptionId}
                            </code>
                            <span className="text-xs text-text-muted">
                              • Queue #{item.queueNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-text-muted">Priority</p>
                      <div className="mt-1">
                        {getPriorityBadge(item.priority)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-text-muted">Items</p>
                      <p className="font-medium text-text-primary mt-1">
                        {item.items}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        // Navigate to dispense page with full prescription ID
                        if (item.fullPrescriptionId) {
                          window.location.href = `/dispense?prescriptionId=${item.fullPrescriptionId}`;
                        }
                      }}
                    >
                      Process
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
      {/* Queue Info */}
      {sortedQueue.length > 0 && (
        <Card>
          <Card.Body className="p-4">
            <p className="text-sm text-text-muted">
              <strong>Next to process:</strong> {sortedQueue[0].patientName} (
              {sortedQueue[0].priority} priority) - This is the root of the
              Min-Heap!
            </p>
          </Card.Body>
        </Card>
      )}
      {/* DSA Modal */}
      <Dialog open={showDSAModal} onOpenChange={setShowDSAModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md shadow-gray-800/20">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <DialogTitle className="font-bold text-gray-900">
                  Min-Heap Priority Queue
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Understanding how the Min-Heap efficiently manages patient
                  priority with O(log n) operations
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
                What is a Min-Heap Priority Queue?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                A <strong className="text-green-700">Min-Heap</strong> is a
                complete binary tree where each parent node has a value smaller
                than or equal to its children. The root always contains the
                minimum value (highest priority). For a priority queue, we use
                priority values where lower numbers = higher priority
                (Emergency=0, High=1, Normal=2, Low=3).
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h4 className="font-semibold text-xs text-gray-700 mb-1">
                    Heap Property
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    For every node i: parent(i) ≤ children(i). This ensures the
                    minimum is always at the root in O(1) time.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-2">
                    Complete Tree
                  </h4>
                  <p className="text-sm text-gray-600">
                    All levels filled except possibly the last, which is filled
                    left-to-right. Enables array storage.
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
                    Add Patient
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Insert at end, heapify up
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium text-gray-900">Bubble Up</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Swap with parent if higher priority
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Process Next
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Extract root (min), move last to root
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    4
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Bubble Down
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Swap with smaller child until valid
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
                    min_heap.cpp
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  C++ Implementation
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`class MinHeapPriorityQueue {
private:
    vector<Patient> heap;
    
    int parent(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return 2 * i + 1; }
    int rightChild(int i) { return 2 * i + 2; }
    
    // Priority: Emergency=0, High=1, Normal=2, Low=3
    bool hasHigherPriority(Patient& a, Patient& b) {
        if (a.priority != b.priority) 
            return a.priority < b.priority;
        return a.arrivalTime < b.arrivalTime; // FIFO for same priority
    }
    
    void heapifyUp(int index) {
        while (index > 0 && hasHigherPriority(heap[index], heap[parent(index)])) {
            swap(heap[index], heap[parent(index)]);
            index = parent(index);
        }
    }
    
    void heapifyDown(int index) {
        int smallest = index;
        int left = leftChild(index), right = rightChild(index);
        
        if (left < heap.size() && hasHigherPriority(heap[left], heap[smallest]))
            smallest = left;
        if (right < heap.size() && hasHigherPriority(heap[right], heap[smallest]))
            smallest = right;
            
        if (smallest != index) {
            swap(heap[index], heap[smallest]);
            heapifyDown(smallest);
        }
    }
    
public:
    // O(log n) - Insert and bubble up
    void insert(Patient patient) {
        heap.push_back(patient);
        heapifyUp(heap.size() - 1);
    }
    
    // O(log n) - Remove root and rebalance
    Patient extractMin() {
        Patient top = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) heapifyDown(0);
        return top;
    }
    
    // O(1) - Peek at highest priority
    Patient peek() { return heap[0]; }
};`}</code>
              </pre>
            </div>

            {/* Real-World Use Cases */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏥</span> Healthcare Applications
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emergency room triage systems</li>
                  <li>• Patient scheduling by urgency</li>
                  <li>• ICU bed allocation</li>
                  <li>• Organ transplant waitlists</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">💻</span> Computer Science
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dijkstra's shortest path algorithm</li>
                  <li>• Huffman coding for compression</li>
                  <li>• Task scheduling in OS</li>
                  <li>• A* pathfinding in games</li>
                </ul>
              </div>
            </div>

            {/* Current Heap Visualization */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                  🌳
                </span>
                Live Heap Visualization
              </h3>
              {queueItems.length > 0 ? (
                <MinHeapVisualizer
                  heap={priorityQueue}
                  highlightedIndex={highlightedIndex}
                />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>
                    No patients in queue. Add patients to see the heap
                    structure.
                  </p>
                </div>
              )}
            </div>

            {/* Operation Log */}
            {operationLog.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gray-700 text-white flex items-center justify-center text-sm">
                    📋
                  </span>
                  Recent Operations
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {operationLog.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm bg-white p-3 rounded-xl border border-gray-200"
                    >
                      <span className="text-gray-400 font-mono text-xs">
                        {log.time}
                      </span>
                      <Badge
                        variant={log.action === "INSERT" ? "success" : "info"}
                        size="sm"
                      >
                        {log.action}
                      </Badge>
                      <span className="text-gray-700 flex-1">{log.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Comparison */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm">
                  ⚡
                </span>
                Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-amber-200">
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Operation
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900">
                        Unsorted Array
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900">
                        Sorted Array
                      </th>
                      <th className="text-center p-3 font-semibold text-amber-700 bg-amber-100 rounded-t-lg">
                        Min-Heap ✓
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Insert Patient
                      </td>
                      <td className="text-center p-3 text-success font-mono">
                        O(1)
                      </td>
                      <td className="text-center p-3 text-error font-mono">
                        O(n)
                      </td>
                      <td className="text-center p-3 bg-amber-50 font-mono font-bold text-success">
                        O(log n)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Get Highest Priority
                      </td>
                      <td className="text-center p-3 text-error font-mono">
                        O(n)
                      </td>
                      <td className="text-center p-3 text-success font-mono">
                        O(1)
                      </td>
                      <td className="text-center p-3 bg-amber-50 font-mono font-bold text-success">
                        O(1)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Remove & Process
                      </td>
                      <td className="text-center p-3 text-error font-mono">
                        O(n)
                      </td>
                      <td className="text-center p-3 text-error font-mono">
                        O(n)
                      </td>
                      <td className="text-center p-3 bg-amber-50 font-mono font-bold text-success">
                        O(log n)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                With 1000 patients, Min-Heap performs operations in ~10 steps vs
                1000 for linear approaches
              </p>
            </div>

            {/* Try It Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                  🧪
                </span>
                Try It Yourself
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add patients with different priorities and watch the heap
                rebalance in real-time!
              </p>
              <div className="flex flex-wrap gap-3">
                {["Emergency", "High", "Normal", "Low"].map((priority, i) => (
                  <div
                    key={priority}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                      i === 0
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : i === 1
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : i === 2
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    Priority {i}: {priority}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
          <p className="text-text-primary text-base py-4">{errorMessage}</p>
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
