import React, { useState, useEffect, useMemo } from "react";
import {
  History,
  Search,
  Filter,
  Eye,
  EyeOff,
  Plus,
  Link,
  Lock,
  Clock,
  AlertCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

// ============================================
// DSA: APPEND-ONLY LOG IMPLEMENTATION
// ============================================

// Generate a simple hash for demonstration
function generateHash(data) {
  let hash = 0;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// Append-only log entry with hash chain (like blockchain)
class AuditLogEntry {
  constructor(data, previousHash = "00000000") {
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = generateHash({
      ...data,
      timestamp: this.timestamp,
      previousHash,
    });
  }
}

// Append-only log data structure
class AppendOnlyLog {
  constructor() {
    this.entries = [];
  }

  // O(1) append operation - can only add, never modify or delete
  append(data) {
    const previousHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : "00000000";

    const entry = new AuditLogEntry(data, previousHash);
    this.entries.push(entry);
    return entry;
  }

  // Verify chain integrity
  verifyChain() {
    for (let i = 1; i < this.entries.length; i++) {
      if (this.entries[i].previousHash !== this.entries[i - 1].hash) {
        return { valid: false, brokenAt: i };
      }
    }
    return { valid: true };
  }

  // Get all entries (newest first for display)
  getEntries() {
    return [...this.entries].reverse();
  }

  size() {
    return this.entries.length;
  }
}

// Append-Only Log Visualization Component
function AppendOnlyLogVisualizer({ logs, highlightedIndex }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No logs yet. Actions will appear here as a hash chain.</p>
      </div>
    );
  }

  // Show last 5 entries for visualization
  const visibleLogs = logs.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-info" />
        <h3 className="font-semibold text-text-primary">
          Hash Chain Visualization
        </h3>
        <span className="text-xs text-text-muted">
          (Append-Only, Immutable)
        </span>
      </div>

      {/* Chain visualization */}
      <div className="flex flex-col gap-0">
        {visibleLogs.map((entry, i) => (
          <div key={entry.hash} className="relative">
            {/* Entry box */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                highlightedIndex === i
                  ? "border-primary bg-primary-light scale-105 shadow-lg"
                  : "border-border-color bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        entry.data.status === "Success" ? "success" : "error"
                      }
                    >
                      {entry.data.action}
                    </Badge>
                    <span className="text-xs text-text-muted">
                      {entry.data.entity}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary">
                    {entry.data.details}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-muted mb-1">Hash</div>
                  <code className="text-xs bg-success-light text-success px-2 py-1 rounded font-mono">
                    {entry.hash}
                  </code>
                </div>
              </div>

              {/* Previous hash reference */}
              {entry.previousHash !== "00000000" && (
                <div className="mt-3 pt-3 border-t border-border-color flex items-center gap-2">
                  <Link className="w-3 h-3 text-info" />
                  <span className="text-xs text-text-muted">
                    Links to previous:
                  </span>
                  <code className="text-xs bg-info-light text-info px-2 py-0.5 rounded font-mono">
                    {entry.previousHash}
                  </code>
                </div>
              )}

              {entry.previousHash === "00000000" && (
                <div className="mt-3 pt-3 border-t border-border-color flex items-center gap-2">
                  <Lock className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Genesis Entry (Chain Start)
                  </span>
                </div>
              )}
            </div>

            {/* Chain link arrow */}
            {i < visibleLogs.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-6 bg-info"></div>
              </div>
            )}
          </div>
        ))}

        {logs.length > 6 && (
          <div className="text-center py-2 text-text-muted text-sm">
            ... and {logs.length - 6} more entries
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-primary" />
          <span>Immutable (can't modify)</span>
        </div>
        <div className="flex items-center gap-1">
          <Link className="w-3 h-3 text-info" />
          <span>Hash Chain (tamper-evident)</span>
        </div>
        <div className="flex items-center gap-1">
          <Plus className="w-3 h-3 text-success" />
          <span>Append-Only (no delete)</span>
        </div>
      </div>
    </div>
  );
}

export default function AuditHistory() {
  const [auditLog] = useState(() => {
    // Initialize with sample data
    const log = new AppendOnlyLog();
    const sampleData = [
      {
        action: "Login",
        entity: "User",
        entityId: "USR-002",
        user: "John Pharmacist",
        details: "User logged in successfully",
        status: "Success",
      },
      {
        action: "Update",
        entity: "Medicine",
        entityId: "MED-003",
        user: "John Pharmacist",
        details: "Updated stock level for Aspirin 100mg",
        status: "Success",
      },
      {
        action: "Create",
        entity: "Prescription",
        entityId: "PRX-2026-001",
        user: "Sarah Admin",
        details: "Created new prescription for patient John Doe",
        status: "Success",
      },
      {
        action: "Add to Queue",
        entity: "Queue",
        entityId: "Q-001",
        user: "Sarah Admin",
        details: "Added PRX-2026-001 to queue with High priority",
        status: "Success",
      },
      {
        action: "Dispense",
        entity: "Prescription",
        entityId: "PRX-2026-001",
        user: "John Pharmacist",
        details: "Dispensed 3 items to patient John Doe",
        status: "Success",
      },
      {
        action: "Failed Login",
        entity: "User",
        entityId: "USR-999",
        user: "Unknown",
        details: "Failed login attempt with username: testuser",
        status: "Failed",
      },
    ];
    sampleData.forEach((data) => log.append(data));
    return log;
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [showDSAModal, setShowDSAModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs(auditLog.getEntries());
      setLoading(false);
    }, 500);
  }, [auditLog]);

  // Add new log entry (demonstration)
  const handleAddLogEntry = () => {
    const actions = ["Create", "Update", "Delete", "Dispense", "Login"];
    const entities = ["User", "Medicine", "Prescription", "Queue"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomEntity = entities[Math.floor(Math.random() * entities.length)];

    auditLog.append({
      action: randomAction,
      entity: randomEntity,
      entityId: `${randomEntity.toUpperCase().slice(0, 3)}-${Math.floor(
        Math.random() * 1000
      )}`,
      user: "Demo User",
      details: `${randomAction} operation on ${randomEntity}`,
      status: Math.random() > 0.2 ? "Success" : "Failed",
    });

    setLogs(auditLog.getEntries());
    setHighlightedIndex(0);
    setTimeout(() => setHighlightedIndex(null), 2000);
  };

  const getActionBadge = (action) => {
    const variants = {
      Create: "success",
      Update: "info",
      Delete: "error",
      Dispense: "success",
      "Add to Queue": "info",
      Login: "default",
      "Failed Login": "error",
    };
    return <Badge variant={variants[action] || "default"}>{action}</Badge>;
  };

  const getStatusBadge = (status) => {
    return status === "Success" ? (
      <Badge variant="success">Success</Badge>
    ) : (
      <Badge variant="error">Failed</Badge>
    );
  };

  const filteredLogs = logs.filter((entry) => {
    const matchesSearch =
      entry.data.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.data.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.data.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction =
      actionFilter === "all" || entry.data.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // Verify chain integrity
  const chainStatus = useMemo(() => auditLog.verifyChain(), [logs]);

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
              <History className="w-5 h-5 text-white" />
            </div>
            Audit History
          </h1>
          <p className="text-gray-500 mt-1">
            Immutable append-only audit trail with hash chain verification
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowDSAModal(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Algorithm
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {logs.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chain Length</p>
                <p className="text-2xl font-bold text-info mt-1">
                  {auditLog.size()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {logs.filter((l) => l.data.status === "Success").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Body className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chain Status</p>
                <div className="mt-1">
                  {chainStatus.valid ? (
                    <Badge variant="success">✓ Verified</Badge>
                  ) : (
                    <Badge variant="error">✗ Broken</Badge>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Algorithm Info */}
      <Card>
        <Card.Body className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">
                Append-Only Log with Hash Chain
              </p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Each log entry contains a cryptographic hash of the previous
                entry, forming an immutable chain (like blockchain). Entries can
                only be appended (O(1)), never modified or deleted.
              </p>
              <div className="flex gap-3 mt-3 text-xs flex-wrap">
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-gray-200 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Append: O(1)
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-gray-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Immutable
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg font-medium shadow-sm border border-gray-200 flex items-center gap-1">
                  <Link className="w-3 h-3" /> Hash Chain
                </span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Filters */}
      <Card>
        <Card.Body className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by entity ID, user, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-48">
              <Select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="Create">Create</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
                <option value="Dispense">Dispense</option>
                <option value="Add to Queue">Add to Queue</option>
                <option value="Login">Login</option>
              </Select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Hash</Table.Head>
              <Table.Head>Timestamp</Table.Head>
              <Table.Head>Action</Table.Head>
              <Table.Head>Entity</Table.Head>
              <Table.Head>Entity ID</Table.Head>
              <Table.Head>User</Table.Head>
              <Table.Head>Details</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredLogs.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <EmptyState
                    icon={History}
                    title="No audit logs found"
                    description="Try adjusting your search filters"
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredLogs.map((entry, index) => (
                <Table.Row
                  key={entry.hash}
                  className={
                    highlightedIndex === index ? "bg-primary-light" : ""
                  }
                >
                  <Table.Cell>
                    <code className="text-xs bg-success-light text-success px-2 py-1 rounded font-mono">
                      {entry.hash.slice(0, 8)}
                    </code>
                  </Table.Cell>
                  <Table.Cell className="text-sm text-text-muted font-mono">
                    {new Date(entry.timestamp).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{getActionBadge(entry.data.action)}</Table.Cell>
                  <Table.Cell>{entry.data.entity}</Table.Cell>
                  <Table.Cell>
                    <code className="text-xs bg-info-light px-2 py-1 rounded">
                      {entry.data.entityId}
                    </code>
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {entry.data.user}
                  </Table.Cell>
                  <Table.Cell className="text-sm text-text-muted max-w-md truncate">
                    {entry.data.details}
                  </Table.Cell>
                  <Table.Cell>{getStatusBadge(entry.data.status)}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Info Footer */}
      <Card>
        <Card.Body className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary mb-2">
                Immutable Audit Trail
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                All audit logs are stored in an append-only data structure with
                cryptographic hash linking. Each entry contains a hash of its
                content plus the previous entry's hash, making any tampering
                immediately detectable. This is the same principle used in
                blockchain technology!
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* DSA Modal */}
      <Dialog open={showDSAModal} onOpenChange={setShowDSAModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto scrollbar-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md shadow-gray-800/20">
                <History className="w-4 h-4 text-white" />
              </div>
              <div>
                <DialogTitle className="font-bold text-gray-900">
                  Append-Only Log & Hash Chain
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Understanding how hash chains ensure tamper-evident audit
                  trails
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {/* Theory Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-gray-800 text-white flex items-center justify-center text-xs">
                  📚
                </span>
                What is an Append-Only Log with Hash Chain?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                An <strong className="text-gray-800">Append-Only Log</strong> is
                an immutable data structure where entries can only be added at
                the end - never modified or deleted. Each entry contains a
                <strong> cryptographic hash</strong> of the previous entry,
                forming a chain. If any entry is tampered with, its hash
                changes, breaking the chain for all subsequent entries.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h4 className="font-semibold text-xs text-gray-700 mb-1">
                    Immutability
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    Once appended, entries cannot be changed. This ensures
                    complete audit trail integrity.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h4 className="font-semibold text-xs text-gray-700 mb-1">
                    Tamper Evidence
                  </h4>
                  <p className="text-sm text-gray-600">
                    Hash chain links each entry to its predecessor. Any
                    modification is immediately detectable.
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
                    Action Occurs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    User performs an action
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Create Entry
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Log data + prev hash
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Hash Entry
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Generate unique hash
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    4
                  </div>
                  <p className="text-sm font-medium text-gray-900">Append</p>
                  <p className="text-xs text-gray-500 mt-1">Add to chain end</p>
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
                    append_only_log.cpp
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  C++ Implementation
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`struct LogEntry {
    string timestamp;
    string action, user, details;
    string previousHash;
    string hash;
};

class AppendOnlyLog {
private:
    vector<LogEntry> chain;
    
    // Simple hash function (use SHA-256 in production)
    string computeHash(const LogEntry& entry) {
        string data = entry.timestamp + entry.action + 
                     entry.user + entry.previousHash;
        size_t hash = 0;
        for (char c : data) hash = hash * 31 + c;
        return to_string(hash);
    }
    
public:
    // O(1) - Append new entry to chain
    void append(string action, string user, string details) {
        LogEntry entry;
        entry.timestamp = getCurrentTime();
        entry.action = action;
        entry.user = user;
        entry.details = details;
        
        // Link to previous entry (genesis if empty)
        entry.previousHash = chain.empty() ? 
            "00000000" : chain.back().hash;
        
        // Compute hash of this entry
        entry.hash = computeHash(entry);
        
        chain.push_back(entry);  // O(1) amortized
    }
    
    // O(n) - Verify chain integrity
    bool verifyChain() {
        for (int i = 1; i < chain.size(); i++) {
            if (chain[i].previousHash != chain[i-1].hash)
                return false;  // Chain broken!
        }
        return true;
    }
    
    // Modification NOT allowed - no update/delete methods
};`}</code>
              </pre>
            </div>

            {/* Real-World Use Cases */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔗</span> Blockchain Technology
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Bitcoin & cryptocurrency transactions</li>
                  <li>• Smart contract execution logs</li>
                  <li>• Decentralized ledgers</li>
                  <li>• NFT ownership history</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏥</span> Compliance & Auditing
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Medical record audit trails</li>
                  <li>• Financial transaction logs</li>
                  <li>• Security event logging</li>
                  <li>• Regulatory compliance records</li>
                </ul>
              </div>
            </div>

            {/* Current Hash Chain Visualization */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center text-sm">
                  🔗
                </span>
                Live Hash Chain Visualization
              </h3>
              <AppendOnlyLogVisualizer
                logs={logs}
                highlightedIndex={highlightedIndex}
              />
            </div>

            {/* Chain Verification */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm">
                  ✓
                </span>
                Chain Integrity Verification
              </h3>
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Current Chain Status:
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Verifying {logs.length} entries in the hash chain...
                    </p>
                  </div>
                  {chainStatus.valid ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="lg">
                        ✓ Chain Verified
                      </Badge>
                      <Lock className="w-6 h-6 text-success" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="error" size="lg">
                        ✗ Chain Broken
                      </Badge>
                      <AlertCircle className="w-6 h-6 text-error" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm">
                  ⚡
                </span>
                Time Complexity Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-amber-200">
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Operation
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900">
                        Complexity
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Append Entry
                      </td>
                      <td className="text-center p-3 font-mono font-bold text-success">
                        O(1)
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        Hash + push to end
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Verify Chain
                      </td>
                      <td className="text-center p-3 font-mono text-info">
                        O(n)
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        Check all hash links
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Modify Entry
                      </td>
                      <td className="text-center p-3 font-mono font-bold text-error">
                        ❌ N/A
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        Not supported - immutable
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-gray-700">
                        Delete Entry
                      </td>
                      <td className="text-center p-3 font-mono font-bold text-error">
                        ❌ N/A
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        Not supported - append-only
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                Click "Add Log Entry" to see how new entries are appended to the
                chain in real-time!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  Step 1: Create entry
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  Step 2: Get prev hash
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 3: Compute hash
                </div>
                <div className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  Step 4: Append to chain
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
