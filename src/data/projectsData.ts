import type { ProjectCapsule } from '../types/portfolio';

export const PROJECTS_DATA: ProjectCapsule[] = [
  {
    id: 'nuraga',
    code: 'PROJECT: NURAGA',
    title: 'NURAGA - Integrated Safety Intelligence',
    subtitle: 'Platform K3 Terintegrasi AI, e-PTW, & Real-Time Emergency Notification',
    category: 'FEATURED',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    shape: 'sphere',
    description: 'Platform K3 terintegrasi AI secara end-to-end dengan sistem Izin Kerja (e-PTW), AI Hazard Prediction, WebSocket & WhatsApp Gateway.',
    fullDescription: 'NURAGA dikembangkan oleh Kuat Riawan sebagai platform keselamatan kerja (K3) industri terintegrasi AI secara end-to-end. Fitur mencakup pembuatan RESTful API, integrasi microservice kecerdasan buatan untuk prediksi bahaya, digitalisasi sistem Izin Kerja (e-PTW), serta notifikasi darurat real-time menggunakan WebSocket dan WhatsApp Gateway yang di-deploy menggunakan Docker.',
    tags: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'WebSocket', 'WhatsApp Gateway', 'AI'],
    metrics: [
      { label: 'Sistem Izin Kerja', value: 'e-PTW Ready' },
      { label: 'Notifikasi Darurat', value: 'Real-Time WS' },
      { label: 'Prediksi Bahaya', value: 'Microservice AI' },
      { label: 'Deployment', value: 'Docker Container' },
    ],
    architecture: [
      'Frontend Dashboard: React.js & Tailwind CSS',
      'Backend Microservices: Node.js & Express.js REST API',
      'Database Layer: PostgreSQL Relational Database',
      'Real-time Channel: WebSocket & WhatsApp Gateway Integration',
      'Containerization: Docker Engine & Multi-Container Setup'
    ],
    codeSnippet: `// NURAGA Safety Emergency Event Dispatcher
import { WebSocketServer } from 'ws';
import { sendWhatsAppAlert } from './whatsappGateway';

export async function handleHazardAlert(incidentData) {
  console.log('[NURAGA AI] Hazard Predicted:', incidentData.riskLevel);
  
  // Dispatch WebSocket Emergency Notification
  wss.broadcast(JSON.stringify({
    type: 'EMERGENCY_K3_ALERT',
    location: incidentData.zone,
    timestamp: new Date().toISOString()
  }));

  // Trigger WhatsApp Emergency Broadcast
  await sendWhatsAppAlert(incidentData.supervisorPhone, incidentData.message);
}`,
    demoUrl: 'https://github.com/kuatriawan',
    githubUrl: 'https://github.com/kuatriawan/nuraga-k3',
    highlightedFeature: '⭐ Proyek Utama - K3 AI Platform',
    certificateData: {
      issuer: 'PT Upaya Riksa Patra & Kuat Riawan OJT',
      issueDate: '2026',
      credentialId: 'CERT-NURAGA-K3-AI-2026',
      verificationUrl: 'https://github.com/kuatriawan/nuraga-k3',
      skillsVerified: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'WebSocket', 'WhatsApp Gateway', 'AI Hazard Prediction'],
      pdfUrl: '/CV_KUAT_RIAWAN.pdf'
    }
  },
  {
    id: 'apps-script-automation',
    code: 'APPS SCRIPT',
    title: 'Otomatisasi Sistem Operasional & Pelaporan Google Apps Script',
    subtitle: 'Otomatisasi Workflow Google Workspace, Auto-Mail, & Database Processing',
    category: 'FEATURED',
    color: '#0f9d58',
    glowColor: 'rgba(15, 157, 88, 0.8)',
    shape: 'sphere',
    description: 'Sistem otomatisasi alur kerja administrasi K3 & operasional menggunakan Google Apps Script, Spreadsheet API, dan otomatisasi email.',
    fullDescription: 'Proyek otomatisasi workflow yang dikembangkan oleh Kuat Riawan untuk mengotomatiskan pengolahan database 3.000+ peserta pelatihan K3, pembuatan laporan On-the-Job Training (OJT) secara otomatis, sinkronisasi data real-time ke Google Sheets, serta pengiriman konfirmasi notifikasi e-mail otomatis.',
    tags: ['Google Apps Script', 'JavaScript', 'Google Sheets API', 'Workflow Automation', 'Gmail API', 'REST Trigger'],
    metrics: [
      { label: 'Otomatisasi Data', value: '3.000+ Peserta K3' },
      { label: 'Alur Kerja', value: 'Auto-Report OJT' },
      { label: 'Platform', value: 'Google Workspace' },
      { label: 'Efisiensi', value: 'Otomatis 100%' }
    ],
    architecture: [
      'Google Apps Script (GAS) JavaScript Engine',
      'Google Sheets API & Triggers (onEdit, Time-driven)',
      'Gmail App Service for Automatic PDF Emailing',
      'Custom Web App Endpoint & Webhook Handler'
    ],
    codeSnippet: `// Google Apps Script - Automated OJT Report Generator & Email Dispatcher
function generateAndSendOJTReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Peserta_K3");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const [nama, email, status, pdfId] = data[i];
    if (status === "APPROVED" && !pdfId) {
      console.log(\`[GAS Automation] Processing OJT Report for \${nama}...\`);
      
      // Auto-Generate PDF Doc & Email Notification
      const pdfBlob = createDocReportBlob(nama);
      GmailApp.sendEmail(email, "Laporan Resmi OJT K3 - Kuat Riawan", "Terlampir hasil sertifikasi OJT K3 Anda.", {
        attachments: [pdfBlob]
      });

      sheet.getRange(i + 1, 4).setValue("SENT_OK");
    }
  }
}`,
    demoUrl: 'https://github.com/kuatriawan',
    githubUrl: 'https://github.com/kuatriawan',
    highlightedFeature: '⚡ Proyek Otomatisasi Workflow GAS',
    certificateData: {
      issuer: 'PT Upaya Riksa Patra & Kuat Riawan',
      issueDate: '2025',
      credentialId: 'GAS-AUTO-2025-KR',
      verificationUrl: 'https://github.com/kuatriawan',
      skillsVerified: ['Google Apps Script', 'JavaScript ES6+', 'Google Workspace API', 'Workflow Automation'],
      pdfUrl: '/CV_KUAT_RIAWAN.pdf'
    }
  },
  {
    id: 'coding-camp-cert',
    code: 'CODING CAMP 2026',
    title: 'Sertifikat Kelulusan Dicoding Coding Camp 2026',
    subtitle: 'Distinction Graduate - Full-Stack Web Development Beasiswa',
    category: 'FEATURED',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.8)',
    shape: 'sphere',
    description: 'Sertifikat resmi kelulusan beasiswa penuh Dicoding Coding Camp 2026 jalur Full-Stack Web Developer.',
    fullDescription: 'Sertifikat kelulusan resmi program Beasiswa Dicoding Coding Camp 2026. Kuat Riawan dinyatakan LULUS dengan predikat Distinction setelah menyelesaikan rangkaian proyek aplikasi web React.js, Back-End Node.js, dan AWS Cloud AI.',
    tags: ['Dicoding 2026', 'Full-Stack', 'React.js', 'Node.js', 'AWS Cloud', 'Distinction'],
    metrics: [
      { label: 'Predikat', value: 'Distinction' },
      { label: 'Credential ID', value: 'CFCC013D6Y1687' },
      { label: 'Program', value: 'Beasiswa Full-Stack' }
    ],
    architecture: ['Kurikulum Industri Dicoding', 'Proyek Akhir React & Back-End Node.js', 'Evaluasi Kode Reviewer Dicoding'],
    codeSnippet: `// Certificate Credential Verification
const cert = {
  recipient: "Kuat Riawan",
  program: "Dicoding Coding Camp 2026",
  status: "GRADUATED WITH DISTINCTION",
  id: "CFCC013D6Y1687"
};`,
    demoUrl: '/certificates/[Coding Camp 2026] Certificate - CFCC013D6Y1687.pdf',
    githubUrl: 'https://www.dicoding.com',
    highlightedFeature: '🏆 Sertifikat Utama Coding Camp 2026',
    certificateData: {
      issuer: 'Dicoding Indonesia (Beasiswa Coding Camp 2026)',
      issueDate: '2026',
      credentialId: 'CFCC013D6Y1687',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Full-Stack Web Development', 'React.js Architecture', 'Node.js REST API', 'AWS Cloud & Gen AI Integration'],
      pdfUrl: '/certificates/[Coding Camp 2026] Certificate - CFCC013D6Y1687.pdf'
    }
  },
  {
    id: 'coding-camp-transcript',
    code: 'TRANSKRIP 2026',
    title: 'Transkrip Nilai Resmi Dicoding Coding Camp 2026',
    subtitle: 'Final Academic Transcript - Distinction Performance Record',
    category: 'FEATURED',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    shape: 'sphere',
    description: 'Transkrip nilai akademik resmi program Beasiswa Coding Camp 2026 dengan seluruh kelulusan modul bintang 5.',
    fullDescription: 'Transkrip nilai akademis kelulusan Dicoding Coding Camp 2026. Memuat daftar lengkap nilai akhir dari seluruh kelas kompetensi Front-End React.js, Back-End Node.js, AWS Cloud Computing, dan Logika Pemrograman.',
    tags: ['Transkrip Nilai', 'Coding Camp 2026', 'Distinction', 'Dicoding', 'Academic Record'],
    metrics: [
      { label: 'Grade', value: 'Distinction' },
      { label: 'ID Transkrip', value: 'CFCC013D6Y1687' },
      { label: 'Status', value: 'LULUS RESMI' }
    ],
    architecture: ['Audit Nilai Reviewer Kode Dicoding', 'Standar Penilaian Industri'],
    codeSnippet: `// Academic Transcript Grade Record
const transcript = {
  student: "Kuat Riawan",
  gpa: "3.50 UT / Distinction Dicoding",
  modulesCompleted: 14,
  verification: "VERIFIED_OFFICIAL"
};`,
    demoUrl: '/certificates/[Coding Camp 2026] Final Transcript - CFCC013D6Y1687.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2026',
      credentialId: 'CFCC013D6Y1687-TRANSCRIPT',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Front-End Development', 'Back-End Microservices', 'Cloud Architecture', 'Software Engineering'],
      pdfUrl: '/certificates/[Coding Camp 2026] Final Transcript - CFCC013D6Y1687.pdf'
    }
  },
  {
    id: 'coding-camp-letter',
    code: 'SKL 2026',
    title: 'Surat Keterangan Lulus (SKL) Coding Camp 2026',
    subtitle: 'Official Graduation & Completion Letter',
    category: 'FEATURED',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.8)',
    shape: 'sphere',
    description: 'Surat Keterangan Lulus (SKL) resmi terverifikasi dari Dicoding Indonesia.',
    fullDescription: 'Dokumen kelulusan resmi (Graduation Letter) yang diterbitkan oleh Dicoding Indonesia menyatakan Kuat Riawan telah menyelesaikan seluruh kewajiban akademik dan tugas akhir program beasiswa Coding Camp 2026.',
    tags: ['Surat Kelulusan', 'SKL', 'Dicoding 2026', 'Official Letter'],
    metrics: [
      { label: 'Dokumen', value: 'Surat Keterangan Lulus' },
      { label: 'ID SKL', value: 'CFCC013D6Y1687' }
    ],
    architecture: ['Legal Accreditation Dicoding Indonesia'],
    codeSnippet: `// Graduation Verification Letter
console.log("Official Graduation Letter Verified for Kuat Riawan");`,
    demoUrl: '/certificates/[Coding Camp 2026] Graduation Letter - CFCC013D6Y1687.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2026',
      credentialId: 'CFCC013D6Y1687-LETTER',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Full-Stack Web Development', 'Graduation Accreditation'],
      pdfUrl: '/certificates/[Coding Camp 2026] Graduation Letter - CFCC013D6Y1687.pdf'
    }
  },
  {
    id: 'react-app-make',
    code: 'REACT WEB APP',
    title: 'Belajar Membuat Aplikasi Web dengan React',
    subtitle: 'Sertifikasi Dicoding - Modern Frontend Architecture & Component State',
    category: 'WEB DEV',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.8)',
    shape: 'sphere',
    description: 'Aplikasi web interaktif berbasis React.js dengan State Management, Component Lifecycle, dan Custom Hooks.',
    fullDescription: 'Proyek kelulusan sertifikasi Dicoding Coding Camp 2026. Mengembangkan aplikasi web SPA modern berkinerja tinggi menggunakan React.js, menerapkan arsitektur komponen atomik, manajemen state terpusat, dan konsumsi RESTful API.',
    tags: ['React.js', 'JavaScript ES6', 'State Management', 'TailwindCSS', 'REST API'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding 2026' },
      { label: 'Score Project', value: '5 / 5 Star' },
      { label: 'Architecture', value: 'Modular React' }
    ],
    architecture: [
      'React Hooks: useState, useEffect, useMemo',
      'Custom API Data Fetching Layer',
      'Responsive Mobile-First UI Components'
    ],
    codeSnippet: `// React Custom Hooks Data Fetcher
import { useState, useEffect } from 'react';

export function usePortfolioProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((projects) => {
        setData(projects);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}`,
    demoUrl: '/certificates/Belajar Membuat Aplikasi Web dengan React.pdf',
    githubUrl: 'https://github.com/kuatriawan/react-web-app',
    certificateData: {
      issuer: 'Dicoding Indonesia (Beasiswa Coding Camp 2026)',
      issueDate: '2026',
      credentialId: 'DICODING-REACT-MAKE-2026',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['React.js', 'Single Page Application (SPA)', 'Component State Management', 'React Hooks'],
      pdfUrl: '/certificates/Belajar Membuat Aplikasi Web dengan React.pdf'
    }
  },
  {
    id: 'react-fundamental',
    code: 'REACT FUNDAMENTAL',
    title: 'Belajar Fundamental Aplikasi Web dengan React',
    subtitle: 'Sertifikasi Dicoding - Advanced React Router & Context State',
    category: 'WEB DEV',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    shape: 'sphere',
    description: 'Penguasaan konsep fundamental React, React Router v6, Context API, dan integrasi backend API.',
    fullDescription: 'Sertifikasi lanjutan React.js dari Dicoding Indonesia. Membangun SPA berskala menengah dengan multi-halaman routing client-side, otentikasi pendaftaran/login pengguna, dan penanganan state global.',
    tags: ['React.js', 'React Router v6', 'Context API', 'Authentication', 'SPA'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding 2026' },
      { label: 'Routing', value: 'React Router v6' },
      { label: 'State', value: 'Context API' }
    ],
    architecture: [
      'React Router Dynamic Routing',
      'Context API Global Auth State',
      'REST API Integration with Bearer Token'
    ],
    codeSnippet: `// React Context API Auth Provider
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}`,
    demoUrl: '/certificates/Belajar Fundamental Aplikasi Web dengan React.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2026',
      credentialId: 'DICODING-REACT-FUNDAMENTAL-2026',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['React.js Architecture', 'React Router v6', 'Context API Global State', 'Authentication Flow'],
      pdfUrl: '/certificates/Belajar Fundamental Aplikasi Web dengan React.pdf'
    }
  },
  {
    id: 'backend-fundamental',
    code: 'BACKEND FUNDAMENTAL',
    title: 'Belajar Fundamental Back-End dengan JavaScript',
    subtitle: 'Sertifikasi Dicoding Coding Camp 2026 - RESTful API Microservice',
    category: 'API SERVICE',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    shape: 'sphere',
    description: 'RESTful API Server performa tinggi dengan Node.js, validasi payload, dan otentikasi JWT.',
    fullDescription: 'Sertifikasi kompetensi backend Dicoding. Mengembangkan API Server tangguh berbasis Node.js yang mampu menangani routing HTTP, otentikasi JWT, validasi payload request, dan pengujian unit API.',
    tags: ['Node.js', 'Express.js', 'RESTful API', 'JWT Auth', 'PostgreSQL'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding 2026' },
      { label: 'Protocol', value: 'HTTP / JSON' },
      { label: 'Security', value: 'JWT & Rate Limit' }
    ],
    architecture: [
      'Express.js Controller & Middleware Pipeline',
      'Data Sanitization & Input Validation',
      'PostgreSQL Relational Storage Integration'
    ],
    codeSnippet: `// Express.js REST API Controller
import express from 'express';
const router = express.Router();

router.get('/api/k3/incidents', async (req, res) => {
  try {
    const incidents = await db.query('SELECT * FROM k3_incidents ORDER BY created_at DESC');
    res.json({ status: 'success', data: incidents.rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});`,
    demoUrl: '/certificates/Belajar Fundamental Back-End dengan JavaScript.pdf',
    githubUrl: 'https://github.com/kuatriawan/backend-javascript',
    certificateData: {
      issuer: 'Dicoding Indonesia (Beasiswa Coding Camp 2026)',
      issueDate: '2026',
      credentialId: 'DICODING-BACKEND-FUNDAMENTAL-2026',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Node.js', 'Express.js', 'RESTful API Design', 'HTTP Routing & JWT Security'],
      pdfUrl: '/certificates/Belajar Fundamental Back-End dengan JavaScript.pdf'
    }
  },
  {
    id: 'backend-pemula',
    code: 'BACKEND PEMULA',
    title: 'Belajar Membuat Aplikasi Back-End untuk Pemula',
    subtitle: 'Sertifikasi Dicoding - Node.js HTTP Server & Web API Basics',
    category: 'API SERVICE',
    color: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.8)',
    shape: 'sphere',
    description: 'Dasar-dasar pembuatan server web HTTP Node.js, routing request, dan manipulasi JSON response.',
    fullDescription: 'Sertifikasi awal pengembangan backend Node.js. Mempelajari konsep client-server, metode HTTP GET/POST/PUT/DELETE, penanganan query parameter, dan penyimpanan data in-memory.',
    tags: ['Node.js', 'HTTP Server', 'JSON API', 'JavaScript', 'Backend Basic'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding Indonesia' },
      { label: 'Runtime', value: 'Node.js Engine' }
    ],
    architecture: ['Native Node.js http module', 'JSON Request/Response Parser'],
    codeSnippet: `// Native Node.js HTTP Server
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'OK', message: 'Backend Server Active' }));
});
server.listen(5000);`,
    demoUrl: '/certificates/Belajar Back-End Pemula dengan JavaScript.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-BACKEND-PEMULA-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Node.js HTTP Server', 'REST Methods (GET/POST)', 'JSON API Basics'],
      pdfUrl: '/certificates/Belajar Back-End Pemula dengan JavaScript.pdf'
    }
  },
  {
    id: 'aws-cloud-ai',
    code: 'AWS CLOUD & AI',
    title: 'Belajar Dasar Cloud dan Gen AI di AWS',
    subtitle: 'Sertifikasi AWS Cloud Computing & Generative AI Infrastructure',
    category: 'CLOUD DEV-OPS',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.8)',
    shape: 'sphere',
    description: 'Arsitektur cloud infrastructure Amazon Web Services (AWS) dan integrasi model Generative AI Amazon Bedrock.',
    fullDescription: 'Sertifikasi resmi AWS & Dicoding mencakup prinsip Cloud Computing, deployment server EC2, penyimpanan S3, serverless Lambda, serta pemanfaatan model Generative AI untuk otomatisasi analisis data.',
    tags: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Amazon Bedrock', 'Cloud Architecture'],
    metrics: [
      { label: 'Provider', value: 'AWS & Dicoding' },
      { label: 'Gen AI', value: 'Amazon Bedrock' },
      { label: 'Cloud Tier', value: 'Serverless Ready' }
    ],
    architecture: [
      'AWS EC2 Compute & VPC Security Grouping',
      'AWS S3 Bucket Cloud Object Storage',
      'AWS Lambda Serverless Event Triggers'
    ],
    codeSnippet: `// AWS Lambda Serverless Event Trigger
exports.handler = async (event) => {
  console.log('[AWS Cloud] Triggering K3 Audit Log Processing...');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'AWS GenAI Analysis Complete!' })
  };
};`,
    demoUrl: '/certificates/Belajar Dasar Cloud dan Gen AI di AWS.pdf',
    githubUrl: 'https://github.com/kuatriawan/aws-cloud-genai',
    certificateData: {
      issuer: 'Amazon Web Services (AWS) & Dicoding',
      issueDate: '2026',
      credentialId: 'AWS-GENAI-CLOUD-2026-KR',
      verificationUrl: 'https://aws.amazon.com',
      skillsVerified: ['AWS Cloud Computing', 'EC2 & S3 Deployment', 'AWS Lambda Serverless', 'Generative AI Bedrock'],
      pdfUrl: '/certificates/Belajar Dasar Cloud dan Gen AI di AWS.pdf'
    }
  },
  {
    id: 'frontend-pemula',
    code: 'FRONTEND PEMULA',
    title: 'Belajar Membuat Front-End Web untuk Pemula',
    subtitle: 'Sertifikasi Dicoding - Responsive Web Design & DOM Manipulation',
    category: 'UI DESIGN',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    shape: 'sphere',
    description: 'Portal web responsif dengan struktur HTML5 semantik, styling CSS3 Flexbox/Grid, dan manipulasi DOM.',
    fullDescription: 'Sertifikasi dasar pengembangan antarmuka web Dicoding. Membangun halaman web responsif lintas perangkat dengan animasi CSS3, struktur layout fleksibel, serta event listener interaktif.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Flexbox', 'DOM API'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding' },
      { label: 'Responsif', value: 'Mobile / Tablet / PC' }
    ],
    architecture: [
      'HTML5 Semantic Markup',
      'CSS3 Flexbox & Grid Layouts',
      'JavaScript DOM Manipulation'
    ],
    codeSnippet: `// DOM Interaction Listener
document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.portfolio-card');
  card.addEventListener('click', () => {
    card.classList.toggle('active-glow');
  });
});`,
    demoUrl: '/certificates/Belajar Membuat Front-End Web untuk Pemula.pdf',
    githubUrl: 'https://github.com/kuatriawan/frontend-web',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-FRONTEND-PEMULA-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['HTML5 Semantics', 'CSS3 Flexbox & Grid', 'JavaScript DOM Event Listeners'],
      pdfUrl: '/certificates/Belajar Membuat Front-End Web untuk Pemula.pdf'
    }
  },
  {
    id: 'js-dasar',
    code: 'JAVASCRIPT ES6+',
    title: 'Belajar Dasar Pemrograman JavaScript',
    subtitle: 'Sertifikasi Kompetensi Dasar Pemrograman JavaScript ES6+',
    category: 'WEB DEV',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.8)',
    shape: 'sphere',
    description: 'Struktur data JavaScript, FP/OOP, Async/Await, dan penanganan Exception Error handling.',
    fullDescription: 'Sertifikasi fondasi pemrograman JavaScript dari Dicoding Indonesia. Menguasai sintaks ES6+, variabel let/const, arrow functions, destructuring, promise async/await, serta Object Oriented Programming (OOP).',
    tags: ['JavaScript ES6+', 'Async/Await', 'OOP', 'Data Structure', 'Functional Programming'],
    metrics: [
      { label: 'Penyelenggara', value: 'Dicoding Indonesia' },
      { label: 'Standar', value: 'ECMAScript 2022' }
    ],
    architecture: ['JavaScript Runtime Mechanics', 'Event Loop & Promises', 'OOP Class Prototypes'],
    codeSnippet: `// JavaScript Async/Await Handling
async function fetchIncidentData() {
  try {
    const res = await fetch('/api/incidents');
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
  }
}`,
    demoUrl: '/certificates/Belajar Dasar Pemrograman JavaScript.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-JS-DASAR-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['JavaScript ES6+', 'Async / Await Promises', 'Data Structures & Control Flow'],
      pdfUrl: '/certificates/Belajar Dasar Pemrograman JavaScript.pdf'
    }
  },
  {
    id: 'web-dasar',
    code: 'PEMROGRAMAN WEB',
    title: 'Belajar Dasar Pemrograman Web',
    subtitle: 'Sertifikasi Dicoding - Fundamental HTML, CSS, & Web Publishing',
    category: 'WEB DEV',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.8)',
    shape: 'sphere',
    description: 'Pengenalan teknologi web, sintaks HTML dasar, pemformatan CSS, dan hosting publik.',
    fullDescription: 'Sertifikasi langkah pertama memasuki dunia pemrograman web dari Dicoding Indonesia. Memahami elemen markup HTML, tata letak CSS, dan prinsip aksesibilitas web dasar.',
    tags: ['HTML', 'CSS', 'Web Basics', 'Publishing', 'Dicoding'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding' },
      { label: 'Fondasi', value: 'Web Developer' }
    ],
    architecture: ['Web Standard HTML5 Structuring', 'CSS Rule Cascade & Specificity'],
    codeSnippet: `<!-- Semantic Web Page Structure -->
<!DOCTYPE html>
<html lang="id">
<head>
  <title>Portofolio Kuat Riawan</title>
</head>
<body>
  <h1>Profil Software Developer</h1>
</body>
</html>`,
    demoUrl: '/certificates/Belajar Dasar Pemrograman Web.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-WEB-DASAR-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['HTML Basics', 'CSS Formatting', 'Web Layout & Publishing'],
      pdfUrl: '/certificates/Belajar Dasar Pemrograman Web.pdf'
    }
  },
  {
    id: 'software-dev-basic',
    code: 'SOFTWARE DEV',
    title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software',
    subtitle: 'Sertifikasi Dicoding - Software Engineering Fundamentals',
    category: 'FEATURED',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.8)',
    shape: 'sphere',
    description: 'Landasan pemikiran rekayasa perangkat lunak, metodologi Agile/Scrum, Git VCS, dan alur pengembangan software.',
    fullDescription: 'Sertifikasi komprehensif mengenai pola pikir software engineer. Meliputi siklus hidup pengembangan sistem (SDLC), prinsip penulisan Clean Code, kerja tim dengan metodologi Agile, dan pengenalan arsitektur perangkat lunak.',
    tags: ['Software Engineering', 'SDLC', 'Clean Code', 'Agile', 'VCS'],
    metrics: [
      { label: 'Penyelenggara', value: 'Dicoding Indonesia' },
      { label: 'Materi', value: 'SDLC & Engineering' }
    ],
    architecture: ['Software Development Life Cycle (SDLC)', 'Clean Code Principles'],
    codeSnippet: `// Clean Code Example - Single Responsibility Principle
function calculateRiskScore(incident) {
  return incident.severity * incident.probability;
}`,
    demoUrl: '/certificates/Memulai Dasar Pemrograman untuk Menjadi Pengembang Software.pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-SOFTWARE-DEV-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Software Engineering Principles', 'SDLC Fundamentals', 'Clean Code', 'Agile Methodology'],
      pdfUrl: '/certificates/Memulai Dasar Pemrograman untuk Menjadi Pengembang Software.pdf'
    }
  },
  {
    id: 'programming-logic-101',
    code: 'LOGIC 101',
    title: 'Pengenalan ke Logika Pemrograman (Programming Logic 101)',
    subtitle: 'Sertifikasi Dicoding - Algorithm & Algorithmic Problem Solving',
    category: 'FEATURED',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.8)',
    shape: 'sphere',
    description: 'Logika matematika dasar, pseudocode, flowchart algoritma, dan teknik komputasional dalam memecahkan masalah.',
    fullDescription: 'Sertifikasi penting mengenai dasar-dasar computational thinking dan penyelesaian masalah logis. Menguasai logika percabangan, perulangan (loops), perancangan algoritma efisien, dan analisis kompleksitas dasar.',
    tags: ['Algorithms', 'Logic', 'Computational Thinking', 'Flowchart', 'Problem Solving'],
    metrics: [
      { label: 'Sertifikasi', value: 'Dicoding' },
      { label: 'Fokus', value: 'Logika & Algoritma' }
    ],
    architecture: ['Algorithmic Logic Design', 'Computational Problem Decomposition'],
    codeSnippet: `// Logic 101 - Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    demoUrl: '/certificates/Pengenalan ke Logika Pemrograman (Programming Logic 101).pdf',
    githubUrl: 'https://www.dicoding.com',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-LOGIC-101-2025',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Computational Thinking', 'Algorithm Logic', 'Pseudocode & Flowcharts', 'Problem Solving'],
      pdfUrl: '/certificates/Pengenalan ke Logika Pemrograman (Programming Logic 101).pdf'
    }
  },
  {
    id: 'git-github-220',
    code: 'GIT & GITHUB',
    title: 'Belajar Dasar Git dengan GitHub',
    subtitle: 'Sertifikasi Version Control System & Collaboration Workflow',
    category: 'CLOUD DEV-OPS',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.8)',
    shape: 'sphere',
    description: 'Manajemen repositori Git, branching strategy, Pull Request (PR), dan kolaboratif GitHub workflows.',
    fullDescription: 'Sertifikasi resmi kompetensi Version Control System (VCS) Dicoding. Menguasai workflow dasar Git (commit, push, pull, rebase, merge conflict resolution) dan GitHub team collaboration.',
    tags: ['Git', 'GitHub', 'Version Control', 'Branching', 'Collaboration'],
    metrics: [
      { label: 'Penyelenggara', value: 'Dicoding Indonesia' },
      { label: 'Module Code', value: '220 Git' }
    ],
    architecture: ['Git Distributed Repository Architecture', 'GitHub Pull Request Code Review', 'Merge Conflict Resolution'],
    codeSnippet: `// Git Feature Branching Command
git checkout -b feature/nuraga-ai-integration
git add .
git commit -m "feat: integrate AI hazard prediction API"
git push origin feature/nuraga-ai-integration`,
    demoUrl: '/certificates/220_.Dicoding8.pdf',
    githubUrl: 'https://github.com/kuatriawan',
    certificateData: {
      issuer: 'Dicoding Indonesia',
      issueDate: '2025',
      credentialId: 'DICODING-GIT-220-KR',
      verificationUrl: 'https://www.dicoding.com',
      skillsVerified: ['Git VCS Commands', 'GitHub Pull Requests', 'Branching & Merge Conflict Handling'],
      pdfUrl: '/certificates/220_.Dicoding8.pdf'
    }
  }
];

