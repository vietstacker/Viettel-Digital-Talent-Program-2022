db.createCollection("attendee", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["num", "name", "year_of_birth", "school", "major"],
      properties: {
        num: {
          bsonType: "int",
          description: "Required",
        },
        name: {
          bsonType: "string",
          description: "Required and must be attendee's fullname",
        },
        school: {
          bsonType: "string",
          description: "Required",
        },
        year_of_birth: {
          bsonType: "int",
          description: "Required",
        },
        major: {
          bsonType: "string",
          description: "Required",
        },
      },
    },
  },
});
