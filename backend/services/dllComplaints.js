// dllComplaints.js

class Node {
  constructor(complaint) {
    this.complaint = complaint; // { id, fullName, email, status, ... }
    this.prev = null;
    this.next = null;
  }
}

export class ComplaintDLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.map = new Map(); // for fast lookup by complaint ID
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

  updateStatus(id, status) {
    const node = this.map.get(id);
    if (!node) return false;
    node.complaint.status = status; // 'Pending', 'In Progress', 'Resolved'
    return true;
  }

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
