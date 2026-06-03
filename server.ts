import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'analytics_db.json');

app.use(express.json());

// Initialize database
function initDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    const initialDb = {
      totalViews: 45, // bootstrapped base
      uniqueVisitors: 12,
      uniqueIps: [],
      sessionIds: [],
      referrers: {
        "LinkedIn Post Links": 18,
        "GitHub Project Referrals": 14,
        "Direct Search Traffic": 10,
        "Resume PDF QR Code": 3
      },
      geographicNodes: [
        { city: "Mumbai", country: "IN (India)", visits: 24, conversion: "Form Sub", devices: "Desktop (70%), Mobile (30%)" },
        { city: "Bengaluru", country: "IN (India)", visits: 12, conversion: "None", devices: "Desktop (80%), Mobile (20%)" },
        { city: "New York", country: "US (United States)", visits: 5, conversion: "None", devices: "Desktop" },
        { city: "London", country: "GB (United Kingdom)", visits: 3, conversion: "None", devices: "Desktop" },
        { city: "Singapore", country: "SG (Singapore)", visits: 1, conversion: "None", devices: "Mobile" }
      ],
      dailyStats: {
        "MON": 12,
        "TUE": 15,
        "WED": 18,
        "THU": 22,
        "FRI": 25,
        "SAT": 14,
        "SUN": 32
      },
      logs: [
        `[${new Date().toLocaleTimeString()}] INF Database analytics instance bootstrapped.`
      ],
      submissions: [
        {
          name: 'Rachel Adams',
          email: 'rachel@enterprise.com',
          subject: 'Data Analyst Role - Tech Ventures',
          message: 'Hi Jay, I reviewed your Banking Fraud detection dashboards from LinkedIn. We have an opening for a Junior/Mid Data Analyst in our Mumbai office. Would you be open to a quick call tomorrow afternoon?',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          isRead: true
        }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
  }
}

// Read database
function readDb() {
  try {
    initDatabase();
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading analytics database, recreating...', err);
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      uniqueIps: [],
      sessionIds: [],
      referrers: { "LinkedIn Post Links": 0, "GitHub Project Referrals": 0, "Direct Search Traffic": 0, "Resume PDF QR Code": 0 },
      geographicNodes: [],
      dailyStats: { "MON": 0, "TUE": 0, "WED": 0, "THU": 0, "FRI": 0, "SAT": 0, "SUN": 0 },
      logs: [],
      submissions: []
    };
  }
}

// Write database
function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing analytics database:', err);
  }
}

// Map timezone to city node region
const tzCityMap: Record<string, { city: string, country: string }> = {
  'Asia/Kolkata': { city: 'Mumbai', country: 'IN (India)' },
  'Asia/Calcutta': { city: 'Mumbai', country: 'IN (India)' },
  'Asia/Katmandu': { city: 'Mumbai', country: 'IN (India)' },
  'America/New_York': { city: 'New York', country: 'US (United States)' },
  'America/Chicago': { city: 'Chicago', country: 'US (United States)' },
  'America/Los_Angeles': { city: 'Los Angeles', country: 'US (United States)' },
  'Europe/London': { city: 'London', country: 'GB (United Kingdom)' },
  'Asia/Singapore': { city: 'Singapore', country: 'SG (Singapore)' },
  'Australia/Sydney': { city: 'Sydney', country: 'AU (Australia)' },
  'Europe/Paris': { city: 'Paris', country: 'FR (France)' },
  'Asia/Tokyo': { city: 'Tokyo', country: 'JP (Japan)' },
};

// API Route: Ping metrics from visitor
app.post('/api/analytics/ping', (req, res) => {
  const { referrer, sessionId, timezone, deviceType } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  const db = readDb();
  
  // 1. Increment total views
  db.totalViews = (db.totalViews || 0) + 1;
  
  // 2. Determine day of the week
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentDay = days[new Date().getDay()];
  if (!db.dailyStats) {
    db.dailyStats = { "MON": 0, "TUE": 0, "WED": 0, "THU": 0, "FRI": 0, "SAT": 0, "SUN": 0 };
  }
  db.dailyStats[currentDay] = (db.dailyStats[currentDay] || 0) + 1;
  
  // 3. Track unique visitors by sessionId/IP
  if (!db.sessionIds) db.sessionIds = [];
  if (!db.uniqueIps) db.uniqueIps = [];
  
  const isNewSession = sessionId && !db.sessionIds.includes(sessionId);
  if (isNewSession) {
    db.sessionIds.push(sessionId);
    db.uniqueVisitors = (db.uniqueVisitors || 0) + 1;
  }
  
  const ipStr = Array.isArray(ip) ? ip[0] : (ip as string);
  const isNewIp = ipStr && !db.uniqueIps.includes(ipStr);
  if (isNewIp) {
    db.uniqueIps.push(ipStr);
  }
  
  // 4. Track referrers
  const validReferrers = ["LinkedIn Post Links", "GitHub Project Referrals", "Direct Search Traffic", "Resume PDF QR Code"];
  const source = validReferrers.includes(referrer) ? referrer : "Direct Search Traffic";
  if (!db.referrers) {
    db.referrers = { "LinkedIn Post Links": 0, "GitHub Project Referrals": 0, "Direct Search Traffic": 0, "Resume PDF QR Code": 0 };
  }
  db.referrers[source] = (db.referrers[source] || 0) + 1;
  
  // 5. Track geographic nodes
  let mappedLocale = tzCityMap[timezone];
  if (!mappedLocale) {
    const parts = timezone ? timezone.split('/') : [];
    if (parts.length > 1) {
      mappedLocale = { city: parts[1].replace('_', ' '), country: parts[0] };
    } else {
      mappedLocale = { city: 'Mumbai', country: 'IN (India)' }; // Fallback
    }
  }
  
  if (!db.geographicNodes) db.geographicNodes = [];
  const existingNode = db.geographicNodes.find((n: any) => n.city.toLowerCase() === mappedLocale.city.toLowerCase());
  if (existingNode) {
    existingNode.visits = (existingNode.visits || 0) + 1;
  } else {
    db.geographicNodes.push({
      city: mappedLocale.city,
      country: mappedLocale.country,
      visits: 1,
      conversion: "None",
      devices: deviceType || "Desktop"
    });
  }
  
  // 6. Write logs
  if (!db.logs) db.logs = [];
  const timestamp = new Date().toLocaleTimeString();
  db.logs.unshift(`[${timestamp}] INF View logged: ${mappedLocale.city} (${deviceType || 'Desktop'}) via ${source}.`);
  if (db.logs.length > 50) db.logs = db.logs.slice(0, 50);
  
  writeDb(db);
  res.json({ success: true, totalViews: db.totalViews, uniqueVisitors: db.uniqueVisitors });
});

// API Route: Get Analytics details
app.get('/api/analytics/stats', (req, res) => {
  const db = readDb();
  res.json({
    totalViews: db.totalViews,
    uniqueVisitors: db.uniqueVisitors,
    referrers: db.referrers || { "LinkedIn Post Links": 0, "GitHub Project Referrals": 0, "Direct Search Traffic": 0, "Resume PDF QR Code": 0 },
    geographicNodes: db.geographicNodes || [],
    dailyStats: db.dailyStats || { "MON": 0, "TUE": 0, "WED": 0, "THU": 0, "FRI": 0, "SAT": 0, "SUN": 0 },
    logs: db.logs || []
  });
});

// API Route: Save Lead submission
app.post('/api/leads', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  const db = readDb();
  if (!db.submissions) db.submissions = [];
  
  const newLead = {
    name: name || 'Anonymous Guest',
    email: email || '',
    subject: subject || 'No Subject',
    message: message || '',
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  db.submissions.unshift(newLead);
  
  // Increment conversion on geographic nodes
  if (db.geographicNodes && db.geographicNodes.length > 0) {
    db.geographicNodes[0].conversion = "Form Sub";
  }
  
  // Log message transaction
  if (!db.logs) db.logs = [];
  db.logs.unshift(`[${new Date().toLocaleTimeString()}] TRN lead message submitted from ${name} (${email}).`);
  
  writeDb(db);
  res.json({ success: true, submissionCount: db.submissions.length });
});

// API Route: Get Leads list
app.get('/api/leads', (req, res) => {
  const db = readDb();
  res.json(db.submissions || []);
});

// API Route: Delete single Lead submission
app.delete('/api/leads/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const db = readDb();
  
  if (db.submissions && index >= 0 && index < db.submissions.length) {
    const removed = db.submissions[index];
    db.submissions.splice(index, 1);
    
    if (!db.logs) db.logs = [];
    db.logs.unshift(`[${new Date().toLocaleTimeString()}] DB Action: Removed lead entry from ${removed.name}.`);
    
    writeDb(db);
    res.json({ success: true, count: db.submissions.length });
  } else {
    res.status(404).json({ error: 'Lead index out of bounds' });
  }
});

// API Route: Flush leads
app.delete('/api/leads-flush', (req, res) => {
  const db = readDb();
  db.submissions = [];
  if (!db.logs) db.logs = [];
  db.logs.unshift(`[${new Date().toLocaleTimeString()}] DB Action: Pruned total lead database entries.`);
  writeDb(db);
  res.json({ success: true });
});

// Serve frontend assets
async function startServer() {
  initDatabase();
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
