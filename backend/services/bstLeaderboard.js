class BSTNode {
  constructor(userData) {
    this.userId = userData.userId;
    this.name = userData.name; // store user name
    this.totalComplaints = 1;
    this.left = null;
    this.right = null;
  }
}

export class LeaderboardBST {
  constructor() {
    this.root = null;
    this.userMap = new Map(); // userId -> node
  }

  addComplaint(userId, userName) {
    if (this.userMap.has(userId)) {
      const node = this.userMap.get(userId);
      node.totalComplaints += 1;
    } else {
      const node = new BSTNode({ userId, name: userName });
      this.insert(node);
      this.userMap.set(userId, node);
    }
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

  // In-order descending traversal
  inOrderDesc(node = this.root, arr = []) {
    if (!node) return arr;
    this.inOrderDesc(node.right, arr);
    arr.push({
      userId: node.userId,
      name: node.name,
      totalComplaints: node.totalComplaints,
    });
    this.inOrderDesc(node.left, arr);
    return arr;
  }

  topN(n = 10) {
    return this.inOrderDesc().slice(0, n);
  }

  setCount(userId, name, count) {
  let node = this.find(userId); // implement find in BST
  if (node) {
    node.count = count;
  } else {
    this.insert(userId, { name, count });
  }
}

}
