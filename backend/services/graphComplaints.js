import { withConnection } from '../services/Db.js';

class AreaNode {
  constructor(name) {
    this.name = name;
    this.complaints = [];
    this.adjacent = new Set();
  }
}

export class CityGraph {
  constructor() {
    this.nodes = new Map();
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
        cluster.push({ area, complaints: this.nodes.get(area).complaints });
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
      cluster.push({ area, complaints: this.nodes.get(area).complaints });
      for (const neighbor of this.nodes.get(area).adjacent) {
        if (!visited.has(neighbor)) dfs(neighbor);
      }
    };

    dfs(startArea);
    return cluster;
  }

 async rebuildGraphFromDB() {
    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT RAWTOHEX(id) AS id, RAWTOHEX(user_id) AS user_id,
                title, description, location, area, status
         FROM complaints
         WHERE area IS NOT NULL`
      )
    );

    // FIX: Destructure the rows to break the circular connection reference
    (result.rows || []).forEach((row) => {
      const cleanComplaint = {
        id: String(row.ID),
        userId: String(row.USER_ID),
        title: row.TITLE,
        description: row.DESCRIPTION,
        location: row.LOCATION,
        area: row.AREA,
        status: row.STATUS
      };
      this.addComplaint(row.AREA, cleanComplaint);
    });
    console.log('Graph rebuilt from DB');
  }
}

export const cityGraph = new CityGraph();