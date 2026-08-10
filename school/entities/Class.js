const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Class',
  tableName: 'CLASS',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    name: { type: 'varchar', length: 50, nullable: false }
  }
})