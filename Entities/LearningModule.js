{
  "name": "LearningModule",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the learning module"
    },
    "description": {
      "type": "string",
      "description": "Brief description of what the module covers"
    },
    "content": {
      "type": "string",
      "description": "Main learning content (HTML format)"
    },
    "category": {
      "type": "string",
      "enum": [
        "earthquake",
        "fire",
        "flood",
        "cyclone",
        "general_safety",
        "evacuation",
        "first_aid"
      ],
      "description": "Category of emergency preparedness"
    },
    "difficulty_level": {
      "type": "string",
      "enum": [
        "beginner",
        "intermediate",
        "advanced"
      ],
      "default": "beginner"
    },
    "estimated_duration_minutes": {
      "type": "number",
      "description": "Estimated time to complete the module"
    },
    "points_reward": {
      "type": "number",
      "description": "Points awarded for completing the module"
    },
    "prerequisites": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Module IDs that must be completed first"
    },
    "interactive_activity": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "drag_and_drop_category",
            "matching",
            "scenario_choice",
            "timeline_ordering"
          ]
        },
        "data": {
          "type": "object",
          "description": "Activity-specific data and configuration"
        }
      }
    },
    "quiz_questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string"
          },
          "options": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "correct_answer": {
            "type": "number",
            "description": "Index of the correct answer"
          },
          "explanation": {
            "type": "string",
            "description": "Explanation for the correct answer"
          }
        },
        "required": ["question", "options", "correct_answer"]
      }
    },
    "badge_reward": {
      "type": "string",
      "description": "Badge ID awarded upon completion"
    },
    "is_published": {
      "type": "boolean",
      "default": false
    },
    "created_date": {
      "type": "string",
      "format": "date-time"
    },
    "updated_date": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "title",
    "description",
    "content",
    "category",
    "points_reward"
  ]
}
