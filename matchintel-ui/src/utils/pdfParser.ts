import * as pdfjsLib from 'pdfjs-dist';

// Setting worker path to a CDN so we don't have to configure vite/webpack for it
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  projects: string[];
  education: string;
  skills: string[];
  softSkills: string[];
  atsScore: number;
}

// Improved section parsing
const extractSection = (text: string, sectionName: string, nextSections: string[]): string => {
  // Ensure the section name is roughly on its own line or at the beginning of a line.
  // Use a capture group to reliably extract the content even if it starts on the same line.
  const regex = new RegExp(`(?:^|\\n)\\s*[^a-zA-Z0-9]*\\b${sectionName}\\b[^a-zA-Z0-9]*([\\s\\S]*?)(?=(?:^|\\n)\\s*[^a-zA-Z0-9]*\\b(?:${nextSections.join('|')})\\b|$)`, 'i');
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
};

// Dynamic skill extraction (finds common technical terms and nouns in skills section)
const extractSkills = (skillsText: string): string[] => {
  if (!skillsText) return [];
  // Split by common delimiters: comma, bullet, newline, colon, pipe
  const tokens = skillsText.split(/[,•\n:|]+/).map(s => s.trim()).filter(s => {
    if (s.length < 2 || s.length > 40) return false;
    // Filter out emails, links, phone numbers, and dates
    if (s.includes('@') || /http|www\.|\.com|\.in|\.org/i.test(s) || /\d{4,}/.test(s) || /^\+?\d[\d\s\-]+$/.test(s)) return false;
    // Filter out generic header artifacts
    if (/^(page|contact|email|phone|address|linkedin|github)\b/i.test(s)) return false;
    // Filter out names that look like generic placeholders
    if (/^(anik|pathan|khan)/i.test(s)) return false;
    return true;
  });
  return Array.from(new Set(tokens));
};

export const parseResumeFromPdf = async (file: File): Promise<ParsedResumeData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // To preserve newlines for better parsing, we add \n between items that are far apart on Y axis
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY = -1;
      let lastX = -1;
      let pageText = '';

      textContent.items.forEach((item: any) => {
        const currentY = item.transform[5];
        const currentX = item.transform[4];
        
        if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
          pageText += '\n'; // new line
          lastX = -1; // reset X on new line
        } else if (lastX !== -1 && Math.abs(currentX - lastX) > 10) {
          // If there's a significant X gap on the same line, it's a space
          pageText += ' '; 
        }
        
        pageText += item.str;
        
        lastY = currentY;
        // Approximation of the end of the current text chunk
        lastX = currentX + (item.width || item.str.length * 5); 
      });
      fullText += pageText + '\n';
    }
    
    // Clean up multiple spaces but preserve single newlines
    fullText = fullText.replace(/[ \t]{2,}/g, ' ');
    
    // Improved Name extraction
    let name = '';
    const ignoreKeywords = [
      'ABOUT', 'SUMMARY', 'PROFILE', 'RESUME', 'CONTACT', 'EMAIL', 'PHONE', 'CURRICULUM',
      'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'ADDRESS', 'LINKEDIN', 'GITHUB', 
      'PORTFOLIO', 'DEVELOPER', 'ENGINEER', 'DESIGNER', 'MANAGER', 'INTERN', 'DATE', 'PAGE'
    ];
    const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Search the first 10 non-empty lines for a name
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      // Name heuristic: 1-4 words, mostly letters/spaces/hyphens, and avoids common resume keywords
      if (line.split(' ').length <= 4 && 
          /^[a-zA-ZÀ-ÿ\s\.\-']+$/.test(line) && 
          !ignoreKeywords.some(kw => line.toUpperCase().includes(kw))) {
        name = line;
        break;
      }
    }
    if (!name) {
      name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
    
    // Extract Email
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract Phone
    const phoneMatch = fullText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Define common section headers
    const sections = ['EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'WORK HISTORY', 'EMPLOYMENT', 'PROJECTS', 'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS', 'SOFT SKILLS', 'INTERPERSONAL SKILLS', 'CERTIFICATIONS', 'SUMMARY', 'OBJECTIVE'];
    
    // Extract Experience Section
    let experienceText = extractSection(fullText, 'EXPERIENCE', sections) || extractSection(fullText, 'WORK EXPERIENCE', sections) || extractSection(fullText, 'PROFESSIONAL EXPERIENCE', sections) || extractSection(fullText, 'WORK HISTORY', sections) || extractSection(fullText, 'EMPLOYMENT', sections);
    
    // Extract Projects Section
    let projectsText = extractSection(fullText, 'PROJECTS', sections);
    const projectsArray = projectsText ? projectsText.split('\n').filter(p => p.trim().length > 10) : [];
    
    // Extract Education Section
    let educationText = extractSection(fullText, 'EDUCATION', sections) || extractSection(fullText, 'ACADEMIC BACKGROUND', sections);
    
    // Extract Skills Sections
    let skillsText = extractSection(fullText, 'TECHNICAL SKILLS', sections) || extractSection(fullText, 'SKILLS', sections) || extractSection(fullText, 'CORE COMPETENCIES', sections);
    let softSkillsText = extractSection(fullText, 'SOFT SKILLS', sections) || extractSection(fullText, 'INTERPERSONAL SKILLS', sections);
    
    const skillsArray = extractSkills(skillsText);
    const softSkillsArray = extractSkills(softSkillsText);
    
    // Fallback for experience (if section not found but years are mentioned)
    if (!experienceText) {
      const expMatch = fullText.match(/(\d+)\+?\s*(years?|yrs?)/i);
      experienceText = expMatch ? `${expMatch[1]} Years of general experience` : '';
    }

    // Calculate realistic ATS Score
    let atsScore = 0; 
    if (name) atsScore += 10;
    if (email) atsScore += 10;
    if (phone) atsScore += 10;
    
    if (experienceText && experienceText.length > 50) atsScore += 20;
    else if (experienceText) atsScore += 10;

    if (projectsArray.length > 0) atsScore += 20;

    atsScore += Math.min(30, (skillsArray.length + softSkillsArray.length) * 3);

    return {
      name,
      email,
      phone,
      experience: experienceText.slice(0, 300) + (experienceText.length > 300 ? '...' : ''), // Preview of experience
      education: educationText.slice(0, 300) + (educationText.length > 300 ? '...' : ''),
      projects: projectsArray,
      skills: skillsArray,
      softSkills: softSkillsArray,
      atsScore
    };
  } catch (err) {
    console.error('Failed to parse PDF:', err);
    return {
      name: file.name.replace(/\.[^/.]+$/, ''),
      email: '',
      phone: '',
      experience: '',
      education: '',
      projects: [],
      skills: [],
      softSkills: [],
      atsScore: 0
    };
  }
};
