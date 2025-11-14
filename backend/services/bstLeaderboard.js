// bstLeaderboard.js

class BSTNode {
  constructor(userData) {
    this.userId = userData.userId;
    this.name = userData.name;
    this.totalComplaints = userData.totalComplaints || 1;
    this.resolvedComplaints = userData.resolvedComplaints || 0;
    this.pendingComplaints = userData.pendingComplaints || 1;
    this.joinedDate = userData.joinedDate;
    this.left = null;
    this.right = null;
  }
}

export class LeaderboardBST {
  constructor() {
    this.root = null;
    this.userMap = new Map(); // maps userId -> node for quick access
  }

  // Add complaint or create new user
  addComplaint(userId, userData = {}) {
    if (this.userMap.has(userId)) {
      const node = this.userMap.get(userId);
      this.remove(node);
      node.totalComplaints += 1;
      node.pendingComplaints += 1;
      this.insert(node);
    } else {
      const node = new BSTNode({
        userId: userId,
        name: userData.name || 'Unknown User',
        totalComplaints: 1,
        resolvedComplaints: 0,
        pendingComplaints: 1,
        joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
      this.insert(node);
      this.userMap.set(userId, node);
    }
  }

  // Update complaint status
  updateComplaintStatus(userId, newStatus, oldStatus) {
    if (!this.userMap.has(userId)) return false;

    const node = this.userMap.get(userId);
    this.remove(node);


    if (oldStatus === 'Pending' && newStatus === 'Resolved') {
      node.pendingComplaints -= 1;
      node.resolvedComplaints += 1;
    } else if (oldStatus === 'Pending' && newStatus === 'In Progress') {
      node.pendingComplaints -= 1;
    } else if (oldStatus === 'In Progress' && newStatus === 'Resolved') {
      node.resolvedComplaints += 1;
    } else if (oldStatus === 'Resolved' && newStatus === 'Pending') {
      node.resolvedComplaints -= 1;
      node.pendingComplaints += 1;
    } else if (oldStatus === 'Resolved' && newStatus === 'In Progress') {
      node.resolvedComplaints -= 1;
    } else if (oldStatus === 'In Progress' && newStatus === 'Pending') {
      node.pendingComplaints += 1;
    }

    this.insert(node);
    return true;
  }

  insert(node) {
    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;
    while (true) {
      if (node.totalComplaints < current.totalComplaints) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      }
    }
  }

  remove(node) {
    const nodes = this.inOrder().filter(n => n.userId !== node.userId);
    this.root = null;
    for (const n of nodes) {
      n.left = n.right = null;
      this.insert(n);
    }
  }

  inOrder(node = this.root, arr = []) {
    if (!node) return arr;
    this.inOrder(node.left, arr);
    arr.push(node);
    this.inOrder(node.right, arr);
    return arr;
  }

  // In-order traversal descending
  inOrderDesc(node = this.root, arr = []) {
    if (!node) return arr;
    this.inOrderDesc(node.right, arr);
    arr.push({
      id: node.userId,
      name: node.name,
      totalComplaints: node.totalComplaints,
      resolvedComplaints: node.resolvedComplaints,
      pendingComplaints: node.pendingComplaints,
      joinedDate: node.joinedDate
    });
    this.inOrderDesc(node.left, arr);
    return arr;
  }

  // Return top N users
  topN(n = 10) {
    return this.inOrderDesc().slice(0, n);
  }
}