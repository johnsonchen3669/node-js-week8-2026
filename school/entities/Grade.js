const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Grade',
  tableName: 'GRADE',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    score: { type: 'integer', nullable: false },
    retake_score: { type: 'integer', nullable: true }
  },
  relations: {
    student: {
      type: 'many-to-one',
      target: 'Student',
      joinColumn: { name: 'student_id' },
      nullable: false
    },
    subject: {
      type: 'many-to-one',
      target: 'Subject',
      joinColumn: { name: 'subject_id' },
      nullable: false
    },
  }
})