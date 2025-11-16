
class Node {
  constructor(complaint) {
    this.complaint = complaint; // { id, fullName, email, status, ... } ye sab store hoga
    this.prev = null;
    this.next = null;
  }
}

// undo / redo status ky liye
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    return this.items.pop() || null;
  }

  peek() {
    return this.items[this.items.length - 1] || null;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }
}

export class ComplaintDLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.map = new Map(); // ordered map {key : val}

    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  addComplaint(complaint) {
    const node = new Node(complaint);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
    this.map.set(complaint.id, node);
  }

  updateStatus(id, newStatus) {
    const node = this.map.get(id);
    if (!node) return false;

    // Push previous status to undo stack
    this.undoStack.push({
      complaintId: id,
      prevStatus: node.complaint.status,
      newStatus: newStatus
    });

    // Clear redo stack on new action
    this.redoStack.clear();

    node.complaint.status = newStatus;
    return true;
  }

  // Undo last status change
  undo() {
    if (this.undoStack.isEmpty()) return false;

    const lastChange = this.undoStack.pop();
    const node = this.map.get(lastChange.complaintId);
    if (!node) return false;

    // Push to redo stack
    this.redoStack.push({
      complaintId: lastChange.complaintId,
      prevStatus: lastChange.newStatus,
      newStatus: lastChange.prevStatus
    });

    node.complaint.status = lastChange.prevStatus;
    return true;
  }

  // Redo last undone change
  redo() {
    if (this.redoStack.isEmpty()) return false;

    const lastUndone = this.redoStack.pop();
    const node = this.map.get(lastUndone.complaintId);
    if (!node) return false;

    // Push back to undo stack
    this.undoStack.push({
      complaintId: lastUndone.complaintId,
      prevStatus: lastUndone.prevStatus,
      newStatus: lastUndone.newStatus
    });

    node.complaint.status = lastUndone.newStatus;
    return true;
  }

  // Get all complaints as array
  getAllComplaints() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.complaint);
      current = current.next;
    }
    return result;
  }
}

export const complaintsList = new ComplaintDLL();
