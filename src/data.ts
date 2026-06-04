import { Project, SkillCategory, Certificate, Experience, Education } from './types';

import profileImg from './assets/images/regenerated_image_1780485889646.jpg';
import appleSalesImg from './assets/images/regenerated_image_1780485900862.jpg'; // OLA is olaRidesImg, wait let's map properly:
import bankingFraudImg from './assets/images/regenerated_image_1780485891593.png';
import creditCardFraudImg from './assets/images/regenerated_image_1780485896467.png';
import vendorPerfImg from './assets/images/regenerated_image_1780485899217.jpg';
import appleRetailImg from './assets/images/regenerated_image_1780485894971.jpg';
import olaRidesImg from './assets/images/regenerated_image_1780485900862.jpg';

import fccResponsiveImg from './assets/images/responsive_web_design_1780502975642.png';
import udemyDsaImg from './assets/images/dsa_cpp_algorithms_1780502994885.png';
import fccJsImg from './assets/images/javascript_algorithms_1780503012582.png';

export const JAY_PROFILE = {
  name: 'Jay Rande',
  title: [
    'Data Analyst',
    'Business Intelligence Enthusiast',
    'SQL Developer',
    'Python Analyst',
    'Computer Science Graduate'
  ],
  tagline: 'Transforming Raw Data Into Actionable Business Insights Through Analytics, SQL, Python, and Power BI.',
  email: 'jayrandecs@gmail.com',
  phone: '9321778286',
  location: 'Kandivali (West), Mumbai',
  github: 'https://github.com/TechByJay',
  linkedin: 'https://www.linkedin.com/in/jay-rande/',
  profileImg: profileImg,
  resumePdf: '/jj_Resume.pdf',
  stats: [
    { label: 'Projects Completed', value: '5+', icon: 'TrendingUp' },
    { label: 'Certifications Obtained', value: '3+', icon: 'Award' },
    { label: 'Internships Held', value: '1', icon: 'Briefcase' },
    { label: 'Technologies & Tools', value: '20+', icon: 'Cpu' }
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'apple-retail',
    title: 'Apple Retail Sales Analytics (1M+ Records)',
    image: appleRetailImg,
    githubUrl: 'https://github.com/TechByJay/apple-retail-sales-analytics-using-postgresql-with-1m-records',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_sql-postgresql-dataanalytics-activity-7464348133225820160-Lckb',
    description: `• Analyzed over 1 million retail sales records using PostgreSQL to solve real-world business and sales analytics problems.
• Utilized advanced SQL techniques including Joins, CTEs, Window Functions, Subqueries, Aggregations, and Performance Optimization.
• Identified top-performing products, sales trends, customer purchasing behavior, and revenue-driving factors.
• Derived business insights to support inventory planning, sales optimization, and strategic decision-making.
• Demonstrated efficient handling and analysis of large-scale datasets using SQL-based analytical workflows.`,
    technologies: ['PostgreSQL', 'SQL', 'Data Analytics', 'Database Design', 'CTEs'],
    category: 'SQL'
  },
  {
    id: 'banking-fraud',
    title: 'Banking Fraud Detection and Credit Risk Analysis',
    image: bankingFraudImg,
    githubUrl: 'https://github.com/TechByJay/Banking-Fraud-Detection-and-Credit-Risk-Analysis-using-python--EDA--and-Power-BI',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_banking-fraud-detection-using-python-eda-activity-7466802731022704641-ow39',
    description: `• Performed end-to-end analysis of banking transactions and customer credit profiles to identify fraud patterns and high-risk segments.
• Conducted data cleaning, preprocessing, Exploratory Data Analysis (EDA), and statistical analysis using Python libraries.
• Developed interactive Power BI dashboards with DAX measures to monitor fraud trends, credit risk exposure, and customer behavior.
• Generated actionable insights for risk mitigation, fraud prevention, and data-driven lending decisions.
• Applied analytical techniques commonly used in fraud detection and credit risk assessment workflows.`,
    technologies: ['Python', 'Power BI', 'Pandas', 'EDA'],
    category: 'Power BI'
  },
  {
    id: 'credit-card-fraud',
    title: 'Credit Card Fraud Detection & Risk Analytics Platform',
    image: creditCardFraudImg,
    githubUrl: 'https://github.com/TechByJay/Credit_Card_Fraud_Detection_And_Risk_Analytics_Platform',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_powerbi-dataanalytics-businessintelligence-activity-7462843136369709057-obpW',
    description: `• Built a business intelligence platform for monitoring fraudulent transactions, customer risk profiles, and transaction anomalies.
• Performed data transformation, cleaning, and analytical reporting to identify suspicious transaction patterns.
• Developed interactive Power BI dashboards featuring fraud KPIs, risk segmentation, transaction monitoring, and performance metrics.
• Leveraged DAX calculations and visualization techniques to enhance analytical reporting and decision-making capabilities.
• Enabled rapid identification of fraud-prone segments through data-driven insights and dashboard analytics.`,
    technologies: ['Power BI', 'Business Intelligence', 'Risk Analytics', 'DAX', 'Excel'],
    category: 'Power BI'
  },
  {
    id: 'vendor-performance',
    title: 'Vendor Performance & Inventory Analytics System',
    image: vendorPerfImg,
    githubUrl: 'https://github.com/TechByJay/Vendor_Performance_and_Inventory_Analytics_System',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_dataanalytics-powerbi-sql-activity-7462343832634851328-d8Gn',
    description: `• Designed a business intelligence solution to evaluate vendor performance, procurement efficiency, and inventory utilization.
• Analyzed procurement and inventory datasets to identify operational bottlenecks and stock management challenges.
• Created KPI-driven Power BI dashboards to track inventory turnover, vendor contribution, procurement metrics, and supply chain performance.
• Delivered analytical insights supporting inventory optimization, vendor evaluation, and operational planning.
• Improved business visibility through interactive reporting and data-driven performance monitoring.`,
    technologies: ['Power BI', 'DAX', 'SQL', 'Inventory Control', 'Data Modeling'],
    category: 'Power BI'
  },
  {
    id: 'ola-rides',
    title: 'OLA Ride Analytics & Business Intelligence Dashboard',
    image: olaRidesImg,
    githubUrl: 'https://github.com/TechByJay/OLA_Ride_Analytics_and_Business_Intelligence_Dashboard',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_powerbi-dataanalytics-businessintelligence-activity-7461264188359733248-_qMD',
    description: 'Designed a business intelligence dashboard analyzing ride trends, cancellation distributions, revenue lines, and customer feedback for ride-hailing services.',
    technologies: ['Power BI', 'Data Visualization', 'Trend Analysis', 'DAX', 'Excel'],
    category: 'Power BI'
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: 'Data Analytics',
    icon: 'BarChart3',
    skills: [
      { name: 'Data Cleaning', rating: 95, description: 'Filtering noise, structural normalization' },
      { name: 'EDA (Exploratory Data Analysis)', rating: 92, description: 'Data discovery and pattern identification' },
      { name: 'Statistical Analysis', rating: 85, description: 'Distribution analysis, profiling metrics' },
      { name: 'Hypothesis Testing', rating: 80, description: 'A/B checks and confidence evaluation' },
      { name: 'Fraud Detection', rating: 90, description: 'Anomaly identification and risk logic' },
      { name: 'Credit Risk Management', rating: 84, description: 'Outstanding ratios and leverage scoring' }
    ]
  },
  {
    title: 'Programming',
    icon: 'Code2',
    skills: [
      { name: 'Python', rating: 88, description: 'Analyses scripting, web-scraping, cleansing' },
      { name: 'SQL', rating: 95, description: 'Queries optimization, analytics structures' },
      { name: 'PL/SQL', rating: 82, description: 'Procedures, triggers, data scripting' }
    ]
  },
  {
    title: 'Database Engine',
    icon: 'Database',
    skills: [
      { name: 'PostgreSQL', rating: 92, description: 'Relational database administration' },
      { name: 'Oracle SQL Developer', rating: 85, description: 'Enterprise query design' }
    ]
  },
  {
    title: 'Data Visualization',
    icon: 'PieChart',
    skills: [
      { name: 'Power BI', rating: 94, description: 'Corporate dash boarding and ETL flows' },
      { name: 'Microsoft Excel', rating: 90, description: 'Pivot tables, analytical computations' },
      { name: 'DAX', rating: 88, description: 'Measure mapping and calculated columns' }
    ]
  },
  {
    title: 'Python Libraries',
    icon: 'Libraries',
    skills: [
      { name: 'Pandas', rating: 90, description: 'DataFrame wrangling and processing' },
      { name: 'NumPy', rating: 85, description: 'Fast multilinear vector computations' },
      { name: 'Matplotlib', rating: 88, description: 'Plots creation and custom chart logic' },
      { name: 'Seaborn', rating: 87, description: 'High-level aesthetic analytics plots' }
    ]
  },
  {
    title: 'Tools & Protocols',
    icon: 'Wrench',
    skills: [
      { name: 'Google Colab', rating: 90, description: 'Iterative analytics notebooks' },
      { name: 'Data Scraping', rating: 83, description: 'BeautifulSoup & HTML automation extraction' }
    ]
  }
];

export const CERTIFICATES_DATA: Certificate[] = [
  {
    title: 'Responsive Web Design',
    issuer: 'FreeCodeCamp',
    image: fccResponsiveImg,
    verificationUrl: 'https://www.freecodecamp.org/certification/fccaaed2169-bb8c-4820-9f50-dc501137a0cc/responsive-web-design',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_certified-frontend-html-activity-7317929321241706496-dEjk',
    date: 'April 2025'
  },
  {
    title: 'Mastering Data Structures & Algorithms Using C and C++',
    issuer: 'Udemy',
    image: udemyDsaImg,
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_datastructures-algorithms-cpp-activity-7319466745822437376-3BFN',
    date: 'April 2025'
  },
  {
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'FreeCodeCamp',
    image: fccJsImg,
    verificationUrl: 'https://www.freecodecamp.org/certification/fccaaed2169-bb8c-4820-9f50-dc501137a0cc/javascript-algorithms-and-data-structures-v8',
    linkedinUrl: 'https://www.linkedin.com/posts/jay-rande_javascript-algorithms-datastructures-activity-7324117220119199745-YtKw',
    date: 'May 2025'
  }
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    company: 'Cinute Digital Pvt Ltd',
    role: 'SEO Intern',
    duration: 'February 2026 – April 2026',
    location: 'Mumbai (Remote / Hybrid)',
    description: [
      'Researched and created technical content on software testing, API testing, security testing, and performance analysis topics.',
      'Conducted content audits, quality reviews, and digital content optimization to improve content accuracy, structure, and user engagement.'
    ]
  }
];

export const EDUCATION_DATA: Education[] = [
  {
    degree: 'Bachelor of Science in Computer Science (B.Sc. CS)',
    college: 'Bhavans College',
    university: 'Mumbai University',
    duration: '2023 – 2026',
    cgpa: '7.0',
    achievements: [
      'Solid command over Database Management Systems (DBMS), Structured Query Design, and SQL triggers.',
      'In-depth coursework in Algorithms, Data Structures, Applied Statistics, and Modern Web architectures.',
      'Completed multiple project modules on Exploratory Data Analysis (EDA) and automated dashboard reporting.'
    ]
  }
];
