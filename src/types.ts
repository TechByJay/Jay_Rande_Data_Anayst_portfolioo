export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  linkedinUrl: string;
  category: 'Python' | 'SQL' | 'Power BI' | 'Full-stack';
}

export interface Skill {
  name: string;
  rating: number; // percentage level for the progress bar, e.g. 90%
  description?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface Certificate {
  title: string;
  issuer: string;
  image: string;
  verificationUrl?: string;
  linkedinUrl?: string;
  date?: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
}

export interface Education {
  degree: string;
  college: string;
  university: string;
  duration: string;
  cgpa: string;
  achievements?: string[];
}
