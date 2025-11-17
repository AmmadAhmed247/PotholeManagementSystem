// services/graphComplaints.js
import Complaint from '../models/Complaint.js';

class AreaNode {
  constructor(name) {
    this.name = name;
    this.complaints = []; // complaints in this area
    this.adjacent = new Set(); // connected areas
  }
}

export class CityGraph {
  constructor() {
    this.nodes = new Map(); // areaName -> AreaNode
  }

  addComplaint(areaName, complaint) {
    if (!this.nodes.has(areaName)) {
      this.nodes.set(areaName, new AreaNode(areaName));
    }
    this.nodes.get(areaName).complaints.push(complaint);
  }

  addEdge(area1, area2) {
    if (!this.nodes.has(area1)) this.nodes.set(area1, new AreaNode(area1));
    if (!this.nodes.has(area2)) this.nodes.set(area2, new AreaNode(area2));

    this.nodes.get(area1).adjacent.add(area2);
    this.nodes.get(area2).adjacent.add(area1);
  }

  getClusterBFS(startArea) {
    if (!this.nodes.has(startArea)) return [];

    const visited = new Set();
    const queue = [startArea];
    const cluster = [];

    while (queue.length) {
      const area = queue.shift();
      if (!visited.has(area)) {
        visited.add(area);
        cluster.push({
          area,
          complaints: this.nodes.get(area).complaints
        });

        for (const neighbor of this.nodes.get(area).adjacent) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
    }

    return cluster;
  }

  getClusterDFS(startArea) {
    if (!this.nodes.has(startArea)) return [];

    const visited = new Set();
    const cluster = [];

    const dfs = (area) => {
      visited.add(area);
      cluster.push({
        area,
        complaints: this.nodes.get(area).complaints
      });

      for (const neighbor of this.nodes.get(area).adjacent) {
        if (!visited.has(neighbor)) dfs(neighbor);
      }
    };

    dfs(startArea);
    return cluster;
  }

  // Rebuild graph from DB on server start
  async rebuildGraphFromDB() {
    const complaints = await Complaint.find();
    complaints.forEach(c => {
      this.addComplaint(c.area, c);
    });
    console.log('Graph rebuilt from DB');
  }
}

// shared instance for all users
export const cityGraph = new CityGraph();

// Rebuild graph at server start
cityGraph.rebuildGraphFromDB().catch(err => console.error('Error rebuilding graph:', err));
