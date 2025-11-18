// users data structure for leaderboard
class BSTNode {
  constructor(userData) {
    this.userId = userData.userId;
    this.name = userData.name; // store user name
    this.totalComplaints = 1;
    this.left = null;
    this.right = null;
  }
}

// main class to where all BST operations are defined
export class LeaderboardBST {
  constructor() {
    this.root = null;
    this.userMap = new Map(); 
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
    // check is tree empty ?
    if (!this.root) {
      this.root = node;
      return;
    }
    // start from root
    
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
  // find in tree
  find(userId, node = this.root) {
    if (!node) return null;
    if (node.userId === userId) return node;
    const leftSearch = this.find(userId, node.left);
    if (leftSearch) return leftSearch;
    return this.find(userId, node.right);
  }
  // helpful when we rebuild the leaderboard from DB
  setCount(userId, name, count) {
    let node = this.find(userId);
    if (node) {
      node.totalComplaints = count;
    } else {
      const newNode = new BSTNode({ userId, name });
      newNode.totalComplaints = count;
      this.insert(newNode);
      this.userMap.set(userId, newNode);
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
  // get top N users (10) 
  topN(n = 10) {
    return this.inOrderDesc().slice(0, n);
  }
}
