
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
  details?: string;
  gallery?: string[];
  features?: string[];
}

export interface Skill {
  name: string;
  type: 'resistor' | 'capacitor' | 'ic' | 'diode';
  level: number;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  socials: Social[];
  image?: string;
  heroSubtitle?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
  tech: string[];
  gallery?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Social {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'telegram' | 'instagram' | 'x';
  url: string;
}
