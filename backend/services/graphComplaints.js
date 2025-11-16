// services/graphComplaints.js

class GraphNode {
  constructor(area) {
    this.area = area;
    this.neighbors = [];
    this.complaints = []; // store complaints in this area
  }
}

export class ComplaintGraph {
  constructor() {
    this.nodes = new Map(); // area name -> GraphNode , adj list
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
    if (!node2.neighbors.includes(area1)) node2.neighbors.push(area1); // undirected graph
  }

  addComplaint(area, complaint) {
    this.addArea(area);
    this.nodes.get(area).complaints.push(complaint);
  }

  // BFS
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

  // DFS
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

// Export a single graph instance
export const cityGraph = new ComplaintGraph();
