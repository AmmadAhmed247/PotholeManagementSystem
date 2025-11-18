class UserNode {
  constructor(email, userData) {
    this.email = email;
    this.userData = userData; 
    this.left = null;
    this.right = null;
  }
}

class UserTree {
  constructor() {
    this.root = null;
  }
  insert(email, userData) {
    const newNode = new UserNode(email, userData);

    if (!this.root) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (email < current.email) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;

      } else if (email > current.email) {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;

      } else {
        throw new Error("User already exists in tree");
      }
    }
  }

  search(email) {
    let current = this.root;
    while (current) {
      if (email === current.email) return current.userData;
      email < current.email
        ? (current = current.left)
        : (current = current.right);
    }

    return null;
  }
}

export const userTree = new UserTree();
