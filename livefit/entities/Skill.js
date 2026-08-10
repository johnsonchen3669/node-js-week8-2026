const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Skill',
  tableName: 'SKILL',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    name: { type: 'varchar', length: 50, nullable: false, unique: true },
  }
})