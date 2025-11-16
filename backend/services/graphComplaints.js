// services/graphComplaints.js

class GraphNode {
  constructor(area) {
    this.area = area;
    this.neighbors = [];
    this.complaints = [];
  }
}

export class ComplaintGraph {
  constructor() {
    this.nodes = new Map();
  }

  addArea(area) {
    if (!this.nodes.has(area)) {
      this.nodes.set(area, new GraphNode(area));
    }
  }

  addEdge(area1, area2) {
    this.addArea(area1);
    this.addArea(area2);
    const node1 = this.nodes.get(area1);
    const node2 = this.nodes.get(area2);

    if (!node1.neighbors.includes(area2)) node1.neighbors.push(area2);
    if (!node2.neighbors.includes(area1)) node2.neighbors.push(area1);
  }

  addComplaint(area, complaint) {
    this.addArea(area);
    this.nodes.get(area).complaints.push(complaint);
  }

  getClusterBFS(startArea) {
    if (!this.nodes.has(startArea)) return [];

    const visited = new Set();
    const queue = [startArea];
    const clusterComplaints = [];

    while (queue.length > 0) {
      const area = queue.shift();
      if (!visited.has(area)) {
        visited.add(area);
        const node = this.nodes.get(area);
        clusterComplaints.push(...node.complaints);
        for (const neighbor of node.neighbors) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
    }

    return clusterComplaints;
  }

  getClusterDFS(startArea) {
    if (!this.nodes.has(startArea)) return [];

    const visited = new Set();
    const stack = [startArea];
    const clusterComplaints = [];

    while (stack.length > 0) {
      const area = stack.pop();
      if (!visited.has(area)) {
        visited.add(area);
        const node = this.nodes.get(area);
        clusterComplaints.push(...node.complaints);
        for (const neighbor of node.neighbors) {
          if (!visited.has(neighbor)) stack.push(neighbor);
        }
      }
    }

    return clusterComplaints;
  }
}

// Node for DLL
class Node {
  constructor(complaint) {
    this.complaint = complaint;
    this.prev = null;
    this.next = null;
  }
}

// Stack for undo/redo
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

// Doubly Linked List for complaints
export class ComplaintDLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.map = new Map();
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

    this.undoStack.push({
      complaintId: id,
      prevStatus: node.complaint.status,
      newStatus: newStatus
    });

    this.redoStack.clear();
    node.complaint.status = newStatus;
    return true;
  }

  undo() {
    if (this.undoStack.isEmpty()) return false;

    const lastChange = this.undoStack.pop();
    const node = this.map.get(lastChange.complaintId);
    if (!node) return false;

    this.redoStack.push({
      complaintId: lastChange.complaintId,
      prevStatus: lastChange.newStatus,
      newStatus: lastChange.prevStatus
    });

    node.complaint.status = lastChange.prevStatus;
    return true;
  }

  redo() {
    if (this.redoStack.isEmpty()) return false;

    const lastUndone = this.redoStack.pop();
    const node = this.map.get(lastUndone.complaintId);
    if (!node) return false;

    this.undoStack.push({
      complaintId: lastUndone.complaintId,
      prevStatus: lastUndone.prevStatus,
      newStatus: lastUndone.newStatus
    });

    node.complaint.status = lastUndone.newStatus;
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
// Add this Priority Queue class to graphComplaints.js

class PriorityQueue {
  constructor() {
    this.heap = [];
    this.priorityMap = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  getPriority(complaint) {
    return this.priorityMap[complaint.priority] || 0;
  }

  // Insert complaint (Max Heap - highest priority at top)
  enqueue(complaint) {
    this.heap.push(complaint);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(index) {
    if (index === 0) return;

    const parentIndex = this.getParentIndex(index);
    const currentPriority = this.getPriority(this.heap[index]);
    const parentPriority = this.getPriority(this.heap[parentIndex]);

    if (currentPriority > parentPriority) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  // Remove highest priority complaint
  dequeue() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  heapifyDown(index) {
    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);
    let largest = index;

    if (leftIndex < this.heap.length && 
        this.getPriority(this.heap[leftIndex]) > this.getPriority(this.heap[largest])) {
      largest = leftIndex;
    }

    if (rightIndex < this.heap.length && 
        this.getPriority(this.heap[rightIndex]) > this.getPriority(this.heap[largest])) {
      largest = rightIndex;
    }

    if (largest !== index) {
      this.swap(index, largest);
      this.heapifyDown(largest);
    }
  }

  // Get all complaints sorted by priority
  getAllSorted() {
    const sorted = [];
    const tempHeap = [...this.heap];
    
    while (this.heap.length > 0) {
      sorted.push(this.dequeue());
    }
    
    this.heap = tempHeap;
    return sorted;
  }

  // Build heap from array of complaints
  buildHeap(complaints) {
    this.heap = [];
    complaints.forEach(complaint => this.enqueue(complaint));
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0] || null;
  }
}

// Export it
export const complaintPriorityQueue = new PriorityQueue();

// Export instances
export const cityGraph = new ComplaintGraph();
export const complaintsList = new ComplaintDLL(); // ✅ THIS WAS MISSING!

// Initialize some connections (optional - can be done via API)
cityGraph.addEdge('12121', 'Karachi,Pakistan');
cityGraph.addEdge('Karachi,Pakistan', 'fb area block 16');