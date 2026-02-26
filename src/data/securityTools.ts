export interface SecurityTool {
  id: string;
  name: string;
  description: string;
  features: string[];
  status: "ready" | "not-connected";
  category: string;
}

export interface ToolCategory {
  id: string;
  label: string;
  tools: SecurityTool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "vuln-assessment",
    label: "Vulnerability Assessment",
    tools: [
      {
        id: "openvas",
        name: "OpenVAS",
        description: "Vulnerability scanner with misconfiguration and CVE detection.",
        features: ["Vulnerability scanning", "Misconfiguration detection", "CVE detection"],
        status: "not-connected",
        category: "Vulnerability Assessment",
      },
      {
        id: "nikto",
        name: "Nikto",
        description: "Web server vulnerability scanner.",
        features: ["Web server scanning", "Outdated software detection", "Server misconfiguration checks"],
        status: "not-connected",
        category: "Vulnerability Assessment",
      },
    ],
  },
  {
    id: "pentest",
    label: "Penetration Testing",
    tools: [
      {
        id: "metasploit",
        name: "Metasploit Framework",
        description: "Exploit testing framework for penetration testing.",
        features: ["Exploit modules", "Payload generation", "Post-exploitation"],
        status: "not-connected",
        category: "Penetration Testing",
      },
      {
        id: "sqlmap",
        name: "SQLmap",
        description: "Automated SQL injection testing tool.",
        features: ["SQL injection detection", "Database fingerprinting", "Data extraction"],
        status: "not-connected",
        category: "Penetration Testing",
      },
      {
        id: "john",
        name: "John the Ripper",
        description: "Password strength testing tool.",
        features: ["Password cracking", "Hash analysis", "Wordlist attacks"],
        status: "not-connected",
        category: "Penetration Testing",
      },
    ],
  },
  {
    id: "web-security",
    label: "Web Application Security",
    tools: [
      {
        id: "owasp-zap",
        name: "OWASP ZAP",
        description: "Automated and manual web application scanning.",
        features: ["Active scanning", "Passive scanning", "API testing"],
        status: "ready",
        category: "Web Application Security",
      },
      {
        id: "wapiti",
        name: "Wapiti",
        description: "Detects XSS, SQLi, and file disclosure vulnerabilities.",
        features: ["XSS detection", "SQL injection testing", "File disclosure scanning"],
        status: "not-connected",
        category: "Web Application Security",
      },
    ],
  },
  {
    id: "siem",
    label: "SIEM & Monitoring",
    tools: [
      {
        id: "wazuh",
        name: "Wazuh",
        description: "Open-source SIEM/XDR platform.",
        features: ["Log analysis", "Intrusion detection", "Compliance monitoring"],
        status: "ready",
        category: "SIEM & Monitoring",
      },
      {
        id: "snort",
        name: "Snort",
        description: "Network IDS/IPS monitoring system.",
        features: ["Real-time traffic analysis", "Packet logging", "Rule-based detection"],
        status: "not-connected",
        category: "SIEM & Monitoring",
      },
    ],
  },
  {
    id: "forensics",
    label: "Digital Forensics",
    tools: [
      {
        id: "autopsy",
        name: "Autopsy",
        description: "GUI-based digital forensic analysis platform.",
        features: ["Disk analysis", "Timeline analysis", "Keyword search"],
        status: "not-connected",
        category: "Digital Forensics",
      },
      {
        id: "volatility",
        name: "Volatility",
        description: "Memory analysis framework for incident response.",
        features: ["Memory dump analysis", "Process inspection", "Malware detection"],
        status: "not-connected",
        category: "Digital Forensics",
      },
    ],
  },
];

export function getAllTools(): SecurityTool[] {
  return toolCategories.flatMap((c) => c.tools);
}

export function getToolById(id: string): SecurityTool | undefined {
  return getAllTools().find((t) => t.id === id);
}
