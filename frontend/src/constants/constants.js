export const SKILL_SUGGESTIONS = [
    // **Programming Languages**
    "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "Kotlin", "Swift", "Ruby", "PHP", "C#", "Lua", "R", "Solidity",

    // **Web Development**
    "HTML", "CSS", "SASS", "LESS", "Tailwind CSS", "Bootstrap", "React", "Vue.js", "Angular", "Node.js", "Express.js", "Django", "Flask",
    "MERN Stack", "MEAN Stack", "LAMP Stack", "JAMstack", "Web Development", "Full Stack Development", "GraphQL", "RESTful APIs", "API Development",
    "WebSockets", "WebAssembly", "Microservices", "Serverless Architecture", "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD Pipelines",
    "Terraform", "Jenkins", "AWS", "Google Cloud Platform", "Azure", "Firebase", "Digital Ocean", "Heroku",

    // **.NET Technologies**
    ".NET", ".NET Core", ".NET Framework", "C#", "ASP.NET", "ASP.NET Core", "MVC", "Web API", "Blazor", "Entity Framework", "Entity Framework Core",
    "LINQ", "SignalR", "Xamarin", "Mono", "Web Forms", "WPF", "WinForms", "NuGet", "Roslyn", "MSBuild", "Visual Studio", "Visual Studio Code",
    "Azure DevOps", "Azure Functions", "SQL Server", "SQL Server Integration Services (SSIS)", "SQL Server Reporting Services (SSRS)", "SQL Server Analysis Services (SSAS)",
    "Microsoft Azure", "Microsoft Power BI", "C# .NET", "F#",

    // **Cloud & Azure**
    "Microsoft Azure", "Azure App Services", "Azure Functions", "Azure DevOps", "Azure SQL Database", "Azure Blob Storage", "Azure Kubernetes Service",
    "Azure Active Directory", "Azure Key Vault", "Azure Service Bus", "Azure Logic Apps", "Azure Resource Manager", "Azure Storage", "Azure Virtual Machines",
    "Azure Cloud Services", "Azure Container Instances", "Azure DevOps Pipeline", "Azure Kubernetes Service (AKS)",

    // **Frontend Development**
    "React Native", "Vuex", "Redux", "Svelte", "Next.js", "Gatsby", "Flutter", "UX Design", "Figma", "Adobe XD", "Tailwind CSS", "CSS Grid",
    "CSS Flexbox", "Responsive Design", "Progressive Web Apps (PWA)", "Web Performance Optimization", "SEO", "Accessibility (a11y)", "Agile", "Scrum",
    "Kanban",

    // **Backend Development**
    "Node.js", "Express.js", "Django", "Ruby on Rails", "Spring Boot", "Flask", "PHP", "Python", "Java", "Go", "Kotlin", "NestJS", "FastAPI",

    // **Databases & Data Management**
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "NoSQL", "Redis", "Elasticsearch", "SQLite", "Oracle DB", "GraphQL", "Data Warehousing", "ETL",
    "Big Data", "Apache Kafka", "Apache Hadoop", "Spark", "Data Governance", "Data Privacy", "Data Engineering", "Cloud Data Engineering", "Data Science",
    "Data Analysis", "Data Mining", "Data Visualization", "Tableau", "Power BI", "QlikView", "Excel VBA", "R Programming", "Data Modelling",
    "Mathematical Modelling", "Computational Biology", "Artificial Neural Networks",

    // **Machine Learning & AI**
    "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", "Computer Vision", "AI Chatbots", "TensorFlow", "PyTorch", "Keras",
    "OpenCV", "Reinforcement Learning", "MLOps", "AI Ethics", "Neural Networks", "Clustering", "Supervised Learning", "Unsupervised Learning",

    // **Blockchain & Cryptocurrency**
    "Blockchain", "Ethereum", "Solidity", "Smart Contracts", "Decentralized Applications (DApps)", "NFTs", "Polkadot", "Cardano", "DeFi",
    "FinTech", "RegTech", "Digital Currency", "Cryptocurrency", "Blockchain Development", "Smart Contract Development", "Ethereum Development",
    "Solana", "Ripple", "Bitcoin", "NFT Development", "DAO",

    // **Cybersecurity**
    "Penetration Testing", "Ethical Hacking", "Cryptography", "Network Security", "Security Best Practices", "Cybersecurity", "Incident Response",
    "Threat Hunting", "Identity and Access Management (IAM)", "Data Privacy", "Digital Forensics", "Compliance (GDPR, HIPAA)", "Firewalls",
    "Cloud Security", "Penetration Testing", "Security Auditing", "Zero Trust", "SIEM", "Intrusion Detection Systems (IDS)", "Red Teaming",
    "Blue Teaming", "Ransomware Protection",

    // **Cloud Computing & DevOps**
    "Cloud Computing", "DevOps", "Continuous Integration", "Continuous Deployment", "Automation", "Serverless Architecture", "Microservices",
    "CI/CD", "Kubernetes", "Docker Containers", "AWS Lambda", "Terraform", "AWS", "Azure", "Google Cloud Platform", "Vagrant", "Jenkins", "Docker",
    "Cloud-Native Development", "Kubernetes", "HashiCorp", "Terraform", "Puppet", "Ansible", "Azure DevOps", "Jira", "Trello",

    // **Mobile App Development**
    "iOS Development", "Android Development", "Mobile App Development", "React Native", "Flutter", "Xcode", "Swift", "Android Studio", "Kotlin",
    "App Store Optimization (ASO)", "Mobile Testing", "Test Automation", "App Analytics", "Real-Time Systems", "Embedded Systems", "Wearable Technology",
    "Arduino", "Raspberry Pi",

    // **Game Development**
    "Unity", "Unreal Engine", "Game Design", "3D Modeling", "3D Animation", "Game Physics", "Augmented Reality (AR)", "Virtual Reality (VR)",
    "Mixed Reality (MR)", "C#", "Lua", "Shaders", "OpenGL", "DirectX", "Game Engines", "Mobile Game Development",

    // **Systems & Networking**
    "Linux", "Windows Server", "Mac OS Administration", "Network Administration", "System Administration", "VMware", "Virtualization", "AWS Lambda",
    "Terraform", "Cloud-Native Development", "Performance Tuning", "Load Balancing", "VPN", "Firewalls", "DNS", "Networking", "IPv4", "IPv6", "TCP/IP",

    // **Other**
    "Business Analysis", "Product Management", "Technical Project Management", "Agile Methodologies", "Scrum Master", "SAFe", "Jira", "Confluence",
    "Slack", "Zendesk", "ServiceNow", "ITIL", "Digital Transformation", "Robotic Process Automation (RPA)", "Automation", "Digital Forensics", "Cloud Security"
];

export const PROJECT_TYPES = [
    // **Development Platforms**
    { value: "Web Application", label: "Web Application" },
    { value: "Mobile Application", label: "Mobile Application" },
    { value: "IoT", label: "IoT" },
    { value: "Blockchain Development", label: "Blockchain Development" },
    { value: "Game Development", label: "Game Development" },

    // **AI and Machine Learning**
    { value: "AI/ML", label: "AI/ML" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Deep Learning", label: "Deep Learning" },
    { value: "Natural Language Processing", label: "Natural Language Processing" },
    { value: "Computer Vision", label: "Computer Vision" },

    // **Software Development & Engineering**
    { value: "Full Stack Development", label: "Full Stack Development" },
    { value: "Frontend Development", label: "Frontend Development" },
    { value: "Backend Development", label: "Backend Development" },
    { value: "DevOps & Cloud Engineering", label: "DevOps & Cloud Engineering" },

    // **Cybersecurity**
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Ethical Hacking & Penetration Testing", label: "Ethical Hacking & Penetration Testing" },

    // **Cloud & DevOps**
    { value: "Cloud Computing", label: "Cloud Computing" },
    { value: "Cloud DevOps", label: "Cloud DevOps" },

    // **Data Science & Analytics**
    { value: "Data Science & Engineering", label: "Data Science & Engineering" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "Data Visualization", label: "Data Visualization" },

    // **Networking & Systems**
    { value: "Networking & Systems Administration", label: "Networking & Systems Administration" },

    // **Other**
    { value: "Other", label: "Other" }
];


export const DIFFICULTY_LEVEL = [
    { value: "Easy", label: "Easy" },
    { value: "Moderate", label: "Moderate" },
    { value: "Difficult", label: "Difficult" }
];


// export const SELECTION = [
//     { value: "Individual", label: "Individual" },
//     { value: "Group", label: "Group" },];

export const SELECTION = [
    { value: "Group", label: "Group" }
];

export const UNIVERSITY = [
    { value: "PU", label: "University of the Punjab, Lahore" },
    { value: "KEMU", label: "King Edward Medical University, Lahore" },
    { value: "UETL", label: "University of Engineering and Technology, Lahore" },
    { value: "FCU", label: "Forman Christian College University, Lahore" },
    { value: "NCA", label: "National College of Arts, Lahore" },
    { value: "UVAS", label: "University of Veterinary and Animal Sciences, Lahore" },
    { value: "PTUT", label: "Punjab Tianjin University of Technology, Lahore" },
    { value: "KCWU", label: "Kinnaird College for Women University, Lahore" },
    { value: "GCU", label: "Government College University, Lahore" },
    { value: "LCWU", label: "Lahore College for Women University, Lahore" },
    { value: "FJMU", label: "Fatima Jinnah Medical University, Lahore" },
    { value: "PMASAAUR", label: "Pir Mehr Ali Shah Arid Agriculture University, Rawalpindi" },
    { value: "FJWU", label: "Fatima Jinnah Women University, Rawalpindi" },
    { value: "UMT", label: "University of Management and Technology, Lahore" },
    { value: "NCBAE", label: "National College of Business Administration and Economics, Lahore" },
    { value: "UCP", label: "University of Central Punjab, Lahore" },
    { value: "UOS", label: "University of Sargodha, Sargodha" },
    { value: "UHS", label: "University of Health Sciences, Lahore" },
    { value: "UE", label: "University of Education, Lahore" },
    { value: "NUML", label: "National University of Modern Languages, Islamabad" }
];
