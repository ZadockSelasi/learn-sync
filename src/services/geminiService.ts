import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'missing_api_key_check_env' });

export const generateCareerRoadmap = async (careerGoal: string, profile?: any) => {
  let prompt = `Generate a detailed career roadmap for someone who wants to become a "${careerGoal}".`;
  
  if (profile) {
    prompt += `\n\nHere is the user's current profile context to tailor the roadmap to their specific situation:
    - Current Education/Level: ${profile.level || 'Unknown'}
    - Program/Major: ${profile.program || 'Unknown'}
    - School/University: ${profile.school || 'Unknown'}
    - Current Skills: ${profile.skills || 'None listed'}
    - Interests: ${profile.interests || 'None listed'}
    - Preferred Industries: ${profile.preferredIndustries || 'None listed'}
    - Preferred Locations: ${profile.preferredLocations || 'None listed'}
    - Bio: ${profile.bio || 'None listed'}`;
  }

  prompt += `\n\nInclude:
  1. Required skills
  2. Beginner to advanced milestones
  3. Recommended certifications
  4. Recommended projects
  5. Estimated timeline
  
  Format the output as a JSON object with the following structure:
  {
    "careerGoal": "string",
    "timeline": "string",
    "skills": ["string"],
    "milestones": [
      { "title": "string", "description": "string", "level": "Beginner|Intermediate|Advanced" }
    ],
    "certifications": ["string"],
    "projects": [
      { "title": "string", "description": "string" }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerGoal: { type: Type.STRING },
            timeline: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  level: { type: Type.STRING }
                },
                required: ["title", "description", "level"]
              }
            },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["careerGoal", "timeline", "skills", "milestones", "certifications", "projects"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};

export const generateQuiz = async (subject: string, content: string, file?: { data: string, mimeType: string }) => {
  const prompt = `Generate a quiz based on the following content for the subject "${subject}".
  Create 5 multiple choice questions, 3 true/false questions, and 2 short answer questions.
  
  Content:
  ${content || 'See attached document.'}
  
  Format the output as a JSON object.`;

  const parts: any[] = [];
  if (file) {
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "multiple_choice, true_false, or short_answer" },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Only for multiple_choice" },
                  answer: { type: Type.STRING, description: "The correct answer" },
                  explanation: { type: Type.STRING }
                },
                required: ["type", "question", "answer", "explanation"]
              }
            }
          },
          required: ["subject", "questions"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const generateFlashcards = async (subject: string, content: string, file?: { data: string, mimeType: string }) => {
  const prompt = `Generate 10 flashcards based on the following content for the subject "${subject}".
  
  Content:
  ${content || 'See attached document.'}
  
  Format the output as a JSON object.`;

  const parts: any[] = [];
  if (file) {
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: "The question or concept" },
                  back: { type: Type.STRING, description: "The answer or definition" }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["subject", "cards"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const generateStudyPlan = async (weakSubjects: string[], availableHours: number) => {
  const prompt = `Generate a weekly study plan for a student.
  They have ${availableHours} hours available this week.
  Their weak subjects are: ${weakSubjects.join(', ')}.
  
  Format the output as a JSON object with tasks distributed across the week.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  dayOfWeek: { type: Type.STRING, description: "Monday, Tuesday, etc." },
                  description: { type: Type.STRING }
                },
                required: ["title", "subject", "durationMinutes", "dayOfWeek", "description"]
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

export const getUniversityProgramsAndLevels = async (universityName: string) => {
  const prompt = `Provide a list of the most common degree levels and top 30 programs/majors offered by ${universityName}.
  For the degree levels, prefer the format "Level 100", "Level 200", "Level 300", "Level 400" etc. if applicable to the region.
  If the university is unknown, provide a generic list of common degree levels (e.g., Level 100, Level 200) and programs.
  
  Format the output as a JSON object with the following structure:
  {
    "levels": ["string"],
    "programs": ["string"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            levels: { type: Type.ARRAY, items: { type: Type.STRING } },
            programs: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["levels", "programs"]
        }
      }
    });

    return JSON.parse(response.text || '{"levels":[],"programs":[]}');
  } catch (error) {
    console.error("Error fetching university programs:", error);
    return { levels: [], programs: [] };
  }
};

export const generateCV = async (cvData: any, targetJob: string) => {
  const prompt = `Generate a professional, ATS-friendly CV for someone targeting a "${targetJob}" role.
  Use the following detailed profile data provided by the user:
  ${JSON.stringify(cvData, null, 2)}
  
  Enhance the descriptions, responsibilities, and achievements to be more impactful, action-oriented, and tailored to the target role where appropriate, while keeping the facts accurate.
  Format the output as a JSON object with the following structure. Only include sections that have data.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                title: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                portfolio: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["fullName", "email", "summary"]
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["school", "degree", "startDate", "endDate"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  type: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["jobTitle", "company", "startDate", "endDate", "responsibilities"]
              }
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                soft: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                languages: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  issueDate: { type: Type.STRING },
                  expiryDate: { type: Type.STRING }
                },
                required: ["name", "issuer"]
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  role: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  link: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            },
            awards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "issuer"]
              }
            },
            volunteer: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["role", "organization"]
              }
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  email: { type: Type.STRING },
                  relationship: { type: Type.STRING }
                },
                required: ["name", "relationship"]
              }
            }
          },
          required: ["personalInfo"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
};

export const generateSkillGapAnalysis = async (profile: any, targetJob: string) => {
  const prompt = `Perform a skill gap analysis for someone targeting a "${targetJob}" role.
  Here is their current profile:
  - Current Skills: ${profile.skills || 'None listed'}
  - Education: ${profile.level || ''} in ${profile.program || ''}
  
  Identify what skills they already have that match the role, what critical skills they are missing, and provide actionable recommendations on how to acquire the missing skills.
  
  Format the output as a JSON object with the following structure:
  {
    "targetRole": "string",
    "matchingSkills": ["string"],
    "missingSkills": ["string"],
    "recommendations": [
      { "skill": "string", "actionPlan": "string", "resources": ["string"] }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  actionPlan: { type: Type.STRING },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["skill", "actionPlan", "resources"]
              }
            }
          },
          required: ["targetRole", "matchingSkills", "missingSkills", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating skill gap analysis:", error);
    throw error;
  }
};

export const generateSkillDetails = async (skill: string, careerGoal: string) => {
  const prompt = `Generate a comprehensive learning module for the skill "${skill}" in the context of becoming a "${careerGoal}".
  
  Provide:
  1. A concise summary of what this skill is and why it's important for this career.
  2. 4 curated study materials (videos, articles, tutorials). Use realistic URLs.
  3. 3 practical exercises (Beginner, Intermediate, Advanced) with clear tasks.
  4. A 3-question multiple-choice quiz to test knowledge on this skill.
  
  Format as JSON:
  {
    "summary": "string",
    "materials": [{ "title": "string", "type": "video|article", "url": "string", "description": "string" }],
    "exercises": [{ "title": "string", "difficulty": "Beginner|Intermediate|Advanced", "description": "string", "task": "string" }],
    "quiz": [{ "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": 0, "explanation": "string" }]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            materials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  url: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "type", "url", "description"]
              }
            },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  description: { type: Type.STRING },
                  task: { type: Type.STRING }
                },
                required: ["title", "difficulty", "description", "task"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["summary", "materials", "exercises", "quiz"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating skill details:", error);
    throw error;
  }
};

export const chatWithStudyBuddy = async (message: string, history: { role: string, text: string }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a virtual study buddy. You answer study questions, motivate students, give study tips, and remind them of unfinished tasks. Be encouraging, concise, and helpful."
      }
    });
    
    // In a real app, we'd load the history into the chat session, 
    // but for simplicity we'll just send the latest message with context.
    const context = history.map(h => `${h.role}: ${h.text}`).join('\n');
    const fullMessage = history.length > 0 ? `Previous conversation:\n${context}\n\nUser: ${message}` : message;
    
    const response = await chat.sendMessage({ message: fullMessage });
    return response.text;
  } catch (error) {
    console.error("Error chatting with study buddy:", error);
    throw error;
  }
};
