db.createCollection("attendee", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "year_of_birth", "email", "gender"],
      properties: {
        name: {
          bsonType: "string",
          description: "Required and must be attendee's fullname",
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+$",
          description: "Required and must be a valid email address",
        },
        year_of_birth: {
          bsonType: "string",
          pattern: "^(19|20)\\d{2}$",
          description: "The value must be grater than or equal to 1900",
        },
        gender: {
          enum: ["M", "F"],
          description: "Can be only M or F",
        },
      },
    },
  },
});
