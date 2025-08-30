{
  "name": "LearningModule",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the learning module"
    },
    "disaster_type": {
      "type": "string",
      "enum": [
        "earthquake",
        "fire",
        "flood",
        "cyclone",
        "first_aid",
        "communication",
        "general"
      ],
      "description": "Type of disaster this module covers"
    },
    "target_age_group": {
      "type": "string",
      "enum": [
        "K-2",
        "3-5",
        "6-8",
        "9-12",
        "college",
        "all"
      ],
      "description": "Target age group for the module"
    },
    "content": {
      "type": "string",
      "description": "Main educational content in HTML/Markdown format"
    },
    "interactive_activity": {
      "type": "object",
      "description": "Data for the interactive activity part of the module",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "drag_and_drop_category",
            "virtual_drill_selection",
            "fire_extinguisher_game",
            "pack_emergency_bag",
            "prepare_classroom"
          ]
        },
        "data": {
          "type": "object"
        }
      }
    },
    "duration_minutes": {
      "type": "number",
      "description": "Estimated completion time in minutes"
    },
    "points_reward": {
      "type": "number",
      "description": "Points awarded for completion"
    },
    "badge_reward": {
      "type": "string",
      "description": "Name of the badge awarded upon completion"
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
            "type": "number"
          },
          "explanation": {
            "type": "string"
          }
        }
      }
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "title",
    "disaster_type",
    "target_age_group",
    "content"
  ]
}