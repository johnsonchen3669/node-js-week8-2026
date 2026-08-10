const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'USER',
  columns: {
    id: { type: 'uuid', primary: true, generated: 'uuid' },
    name: { type: 'varchar', length: 50, nullable: false },
    email: { type: 'varchar', length: 320, nullable: false, unique: true },
    role: { type: 'varchar', length: 20, nullable: false },
    created_at: { type: 'timestamp', createDate: true },
    updated_at: { type: 'timestamp', updateDate: true },
  }
})