import axios from 'axios';

export interface ExerciseRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  exerciseType: 'multiple-choice' | 'fill-in-blank' | 'sentence-correction' | 'vocabulary' | 'grammar' | 'pronunciation';
  count: number;
  context?: string;
  categories?: string[];
}

export interface Exercise {
  _id?: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  topic: string;
  context?: string;
  author?: {
    _id: string;
    username: string;
    avatar?: string;
    reputation: number;
  };
  isPublic?: boolean;
  tags?: string[];
  usageCount?: number;
  averageScore?: number;
  totalAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseSet {
  exercises: Exercise[];
  metadata: {
    topic: string;
    difficulty: string;
    exerciseType: string;
    totalCount: number;
    estimatedTime: string;
    learningObjectives: string[];
  };
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
  }

  async generateExercises(request: ExerciseRequest): Promise<ExerciseSet> {
    try {
      const prompt = this.buildExercisePrompt(request);
      
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parseExerciseResponse(aiResponse, request);
    } catch (error: any) {
      console.error('AI Exercise Generation Error:', error);
      throw new Error('Failed to generate exercises. Please try again.');
    }
  }

  async generateExercisesFromContent(content: string, request: Partial<ExerciseRequest>): Promise<ExerciseSet> {
    try {
      const prompt = this.buildContentBasedPrompt(content, request);
      
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parseExerciseResponse(aiResponse, request);
    } catch (error: any) {
      console.error('AI Exercise Generation Error:', error);
      throw new Error('Failed to generate exercises from content. Please try again.');
    }
  }

  async generatePersonalizedExercises(request: Partial<ExerciseRequest>): Promise<ExerciseSet> {
    try {
      const prompt = this.buildPersonalizedPrompt(request);
      
      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parseExerciseResponse(aiResponse, request);
    } catch (error: any) {
      console.error('AI Exercise Generation Error:', error);
      throw new Error('Failed to generate personalized exercises. Please try again.');
    }
  }

  private buildExercisePrompt(request: ExerciseRequest): string {
    return `Generate ${request.count} English learning exercises for the topic "${request.topic}" with ${request.difficulty} difficulty level and ${request.exerciseType} format.

Requirements:
- Exercise type: ${request.exerciseType}
- Difficulty: ${request.difficulty}
- Categories: ${request.categories?.join(', ') || 'grammar'}
- Context: ${request.context || 'none'}

IMPORTANT: For the "category" field in each exercise, use ONLY one of these valid values:
grammar, vocabulary, pronunciation, writing, speaking, reading, listening, business, academic, casual, technical, other

Please provide the response in the following JSON format:
{
  "exercises": [
    {
      "type": "${request.exerciseType}",
      "question": "The exercise question here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option",
      "explanation": "Explanation of why this is correct",
      "difficulty": "${request.difficulty}",
      "category": "grammar",
      "topic": "${request.topic}"
    }
  ],
  "metadata": {
    "topic": "${request.topic}",
    "difficulty": "${request.difficulty}",
    "exerciseType": "${request.exerciseType}",
    "totalCount": ${request.count},
    "estimatedTime": "10-15 minutes",
    "learningObjectives": ["objective1", "objective2", "objective3"]
  }
}

Make sure the exercises are engaging, educational, and appropriate for ${request.difficulty} level English learners.`;
  }

  private buildContentBasedPrompt(content: string, request: Partial<ExerciseRequest>): string {
    return `Generate ${request.count || 5} English learning exercises based on the following content:

Content:
${content}

Requirements:
- Exercise type: ${request.exerciseType || 'multiple-choice'}
- Difficulty: ${request.difficulty || 'intermediate'}
- Categories: ${request.categories?.join(', ') || 'grammar'}

IMPORTANT: For the "category" field in each exercise, use ONLY one of these valid values:
grammar, vocabulary, pronunciation, writing, speaking, reading, listening, business, academic, casual, technical, other

Please provide the response in the following JSON format:
{
  "exercises": [
    {
      "type": "${request.exerciseType || 'multiple-choice'}",
      "question": "The exercise question here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option",
      "explanation": "Explanation of why this is correct",
      "difficulty": "${request.difficulty || 'intermediate'}",
      "category": "grammar",
      "topic": "Content-based exercise"
    }
  ],
  "metadata": {
    "topic": "Content-based exercise",
    "difficulty": "${request.difficulty || 'intermediate'}",
    "exerciseType": "${request.exerciseType || 'multiple-choice'}",
    "totalCount": ${request.count || 5},
    "estimatedTime": "10-15 minutes",
    "learningObjectives": ["objective1", "objective2", "objective3"]
  }
}

Create exercises that directly relate to the provided content and test comprehension, vocabulary, grammar, or other relevant English skills.`;
  }

  private buildPersonalizedPrompt(request: Partial<ExerciseRequest>): string {
    return `Generate ${request.count || 5} personalized English learning exercises with the following parameters:

Requirements:
- Exercise type: ${request.exerciseType || 'multiple-choice'}
- Difficulty: ${request.difficulty || 'intermediate'}
- Categories: ${request.categories?.join(', ') || 'grammar'}

IMPORTANT: For the "category" field in each exercise, use ONLY one of these valid values:
grammar, vocabulary, pronunciation, writing, speaking, reading, listening, business, academic, casual, technical, other

Please provide the response in the following JSON format:
{
  "exercises": [
    {
      "type": "${request.exerciseType || 'multiple-choice'}",
      "question": "The exercise question here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option",
      "explanation": "Explanation of why this is correct",
      "difficulty": "${request.difficulty || 'intermediate'}",
      "category": "grammar",
      "topic": "Personalized exercise"
    }
  ],
  "metadata": {
    "topic": "Personalized exercise",
    "difficulty": "${request.difficulty || 'intermediate'}",
    "exerciseType": "${request.exerciseType || 'multiple-choice'}",
    "totalCount": ${request.count || 5},
    "estimatedTime": "10-15 minutes",
    "learningObjectives": ["objective1", "objective2", "objective3"]
  }
}

Create exercises that are engaging and appropriate for the specified difficulty level and categories.`;
  }

  private parseExerciseResponse(aiResponse: string, request: Partial<ExerciseRequest>): ExerciseSet {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI service');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
        throw new Error('Invalid exercise data structure');
      }

      // Validate and clean exercises
      const exercises = parsed.exercises.map((exercise: any) => this.validateExercise(exercise));
      
      // Ensure metadata exists
      const metadata = parsed.metadata || {
        topic: request.topic || 'Generated Exercise',
        difficulty: request.difficulty || 'intermediate',
        exerciseType: request.exerciseType || 'multiple-choice',
        totalCount: exercises.length,
        estimatedTime: '10-15 minutes',
        learningObjectives: ['Improve English skills', 'Practice exercises', 'Enhance learning']
      };

      return { exercises, metadata };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  private validateExercise(exercise: any): Exercise {
    const requiredFields = ['question', 'correctAnswer', 'explanation'];
    
    for (const field of requiredFields) {
      if (!exercise[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Valid categories from the Exercise model enum
    const validCategories = ['grammar', 'vocabulary', 'pronunciation', 'writing', 'speaking', 'reading', 'listening', 'business', 'academic', 'casual', 'technical', 'other'];
    
    // Ensure category is valid, default to 'grammar' if invalid
    let validCategory = exercise.category;
    if (!validCategories.includes(validCategory)) {
      validCategory = 'grammar';
    }

    return {
      type: exercise.type || 'multiple-choice',
      question: exercise.question,
      options: exercise.options || [],
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      difficulty: exercise.difficulty || 'intermediate',
      category: validCategory,
      topic: exercise.topic || 'Generated Exercise',
      context: exercise.context,
      tags: exercise.tags || [],
      isPublic: exercise.isPublic !== false,
      usageCount: 0,
      averageScore: 0,
      totalAttempts: 0
    };
  }
}

export default new AIService();
