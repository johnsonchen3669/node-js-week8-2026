/**
 * 任務 5：Seeder，種一些資料，證明你建立的資料表真的能使用。
 * 規則：可重複執行（先清空、再種入資料），即使執行多次也不會有資料疊加的狀況。
 * 執行順序：一定要先 npm run migration:run（沒有資料表，就無法種資料）
 */
const { dataSource } = require('./data-source')

/** 清空：被 FK 指著的表最後刪（GRADE 先刪，CLASS / SUBJECT 最後刪）。
 *  不用 clear()（TRUNCATE 會被 FK 擋）、不用 delete({})（TypeORM 拒絕空條件）。 */
async function clearAll() {
  const ORDER = [
    // FK 依賴反向 — 被指到的表先刪，源頭表最後刪
    //  GRADE 有 student_id → STUDENT、subject_id → SUBJECT，先刪
    //  STUDENT 有 class_id → CLASS，接著刪
    //  CLASS / SUBJECT 沒人指它們，最後刪
    'Grade',
    'Student',
    'Class',
    'Subject',
  ]
  for (const name of ORDER) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute()
    }
  }
}

async function main() {
  await dataSource.initialize()
  await clearAll()

  // ===== 1. 先種 CLASS / SUBJECT（沒有 FK，可獨立存在）=====
  // ===== 2. 再種 STUDENT（接上 class）=====
  // ===== 3. 最後種 GRADE（接上 student + subject）=====

  // 1. 取得四個 repo
  const classRepo   = dataSource.getRepository('Class')
  const subjectRepo = dataSource.getRepository('Subject')
  const studentRepo = dataSource.getRepository('Student')
  const gradeRepo   = dataSource.getRepository('Grade')

  // 2. 先存 CLASS、SUBJECT → 存回變數，後面 STUDENT / GRADE 要用
  //    save 回傳的物件已含自動生成的 id
  const classes = await classRepo.save([
    { name: '一年甲班' },
    { name: '一年乙班' },
  ])

  const subjects = await subjectRepo.save([
    { name: '數學' },
    { name: '國文' },
  ])

  // 3. 再存 STUDENT，每位接上一個 class（放班級物件）
  //    classes 是陣列，用索引取值
  const students = await studentRepo.save([
    { name: '小明', class: classes[0] },
    { name: '小華', class: classes[1] },
  ])

  // 4. 最後存 GRADE，每筆接上 student 與 subject
  //    score 是 integer（整數），不要給字串
  //    students / subjects 是陣列，用索引取值
  await gradeRepo.save([
    { score: 90, student: students[0], subject: subjects[0] },
    { score: 85, student: students[0], subject: subjects[1] },
    { score: 78, student: students[1], subject: subjects[0] },
    { score: 92, student: students[1], subject: subjects[1] },
  ])

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
