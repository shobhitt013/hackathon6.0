{
  "name": "UserProgress",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Reference to the user"
    },
    "module_id": {
      "type": "string",
      "description": "Reference to the learning module"
    },
    "completion_status": {
      "type": "string",
      "enum": [
        "not_started",
        "in_progress",
        "completed"
      ],
      "default": "not_started"
    },
    "last_completed_step": {
      "type": "string",
      "enum": [
        "learning",
        "activity",
        "quiz"
      ],
      "description": "The last step the user successfully completed"
    },
    "quiz_score": {
      "type": "number",
      "description": "Score achieved in the quiz (percentage)"
    },
    "completion_date": {
      "type": "string",
      "format": "date-time",
      "description": "When the module was completed"
    },
    "time_spent_minutes": {
      "type": "number",
      "description": "Time spent on the module in minutes"
    }
  },
  "required": [
    "user_id",
    "module_id"
  ]
}