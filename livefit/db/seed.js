/**
 * 任務 4：Seeder，種一些資料，證明你建立的資料表真的能使用。
 * 規則：可重複執行（先清空、再種入資料），即使執行多次也不會有資料疊加的狀況。
 * 執行順序：一定要先 npm run migration:run（沒有資料表，就無法種資料）
 */
const { dataSource } = require('./data-source')

/** 清空：被 FK 指著的表最後刪（先刪 COURSE，再 USER / SKILL）。
 *  不用 clear()（TRUNCATE 會被 FK 擋）、不用 delete({})（TypeORM 拒絕空條件）。 */
async function clearAll() {
  for (const name of ['Course', 'User', 'Skill']) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute()
    }
  }
}

async function main() {
  await dataSource.initialize()
  await clearAll()

  // ===== 1. SKILL 三筆：重訓、瑜珈、飛輪 =====
  // ===== 2. USER 兩位教練，role 都是 'COACH' =====
  // ===== 3. COURSE 四堂課：肌力入門班、週末飛輪、晨間瑜珈、核心特訓 =====
  //    每堂課接上教練(user)與技能(skill)，直接放前面存好的物件


  const skillRepo  = dataSource.getRepository('Skill')
  const userRepo   = dataSource.getRepository('User')
  const courseRepo = dataSource.getRepository('Course')

  const skills = await skillRepo.save([
    { name: '重訓' },
    { name: '瑜珈' },
    { name: '飛輪' },
  ])

  const coaches = await userRepo.save([
    { name: '海格教練', email: 'coach1@livefit.tw', role: 'COACH' },
    { name: '小美教練', email: 'coach2@livefit.tw', role: 'COACH' },
  ])

  await courseRepo.save([
    {
      name: '肌力入門班',
      description: '基礎肌力訓練，適合健身新手。',
      start_at: '2026-01-01 10:00:00',
      end_at:   '2026-01-01 11:00:00',
      max_participants: 10,
      user: coaches[0],   // 海格教練
      skill: skills[0],   // 重訓
    },
    {
      name: '週末飛輪',
      description: '週末高強度飛輪有氧，燃脂挑戰。',
      start_at: '2026-01-03 09:00:00',
      end_at:   '2026-01-03 10:00:00',
      max_participants: 15,
      user: coaches[0],   // 海格教練
      skill: skills[2],   // 飛輪
    },
    {
      name: '晨間瑜珈',
      description: '清晨瑜珈舒展，喚醒身心。',
      start_at: '2026-01-02 07:00:00',
      end_at:   '2026-01-02 08:00:00',
      max_participants: 12,
      user: coaches[1],   // 小美教練
      skill: skills[1],   // 瑜珈
    },
    {
      name: '核心特訓',
      description: '核心肌群強化，穩定身體基礎。',
      start_at: '2026-01-04 19:00:00',
      end_at:   '2026-01-04 20:00:00',
      max_participants: 8,
      user: coaches[1],   // 小美教練
      skill: skills[0],   // 重訓
    },
  ])

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
