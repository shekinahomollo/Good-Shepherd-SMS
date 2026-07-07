import { PrismaClient } from '@prisma/client'
import { PrismaPg }     from '@prisma/adapter-pg'
import bcrypt           from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Good Shepherd SMS...')

  // ── Grade Levels ──────────────────────────────────────────
  const gradeLevels = await Promise.all([
    prisma.gradeLevel.upsert({
      where: { code: 'KG' }, update: {},
      create: { name:'Kindergarten', code:'KG', gradingType:'DESCRIPTIVE', sortOrder:0 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G1' }, update: {},
      create: { name:'Grade 1', code:'G1', gradingType:'NUMERICAL', sortOrder:1 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G2' }, update: {},
      create: { name:'Grade 2', code:'G2', gradingType:'NUMERICAL', sortOrder:2 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G3' }, update: {},
      create: { name:'Grade 3', code:'G3', gradingType:'NUMERICAL', sortOrder:3 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G4' }, update: {},
      create: { name:'Grade 4', code:'G4', gradingType:'NUMERICAL', sortOrder:4 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G5' }, update: {},
      create: { name:'Grade 5', code:'G5', gradingType:'NUMERICAL', sortOrder:5 },
    }),
    prisma.gradeLevel.upsert({
      where: { code: 'G6' }, update: {},
      create: { name:'Grade 6', code:'G6', gradingType:'NUMERICAL', sortOrder:6 },
    }),
  ])
  console.log('✅ Grade levels seeded')

  // ── Academic Year ─────────────────────────────────────────
  const academicYear = await prisma.academicYear.upsert({
    where: { label: '2024-2025' }, update: {},
    create: {
      label:     '2024-2025',
      startDate: new Date('2025-01-06'),
      endDate:   new Date('2025-10-31'),
      isCurrent: true,
    },
  })
  console.log('✅ Academic year seeded')

  // ── Terms ─────────────────────────────────────────────────
  await Promise.all([
    prisma.term.upsert({
      where: { id: 'term-1-2025' }, update: {},
      create: { id:'term-1-2025', academicYearId:academicYear.id, termNumber:1, startDate:new Date('2025-01-06'), endDate:new Date('2025-04-04'), label:'Term 1' },
    }),
    prisma.term.upsert({
      where: { id: 'term-2-2025' }, update: {},
      create: { id:'term-2-2025', academicYearId:academicYear.id, termNumber:2, startDate:new Date('2025-04-28'), endDate:new Date('2025-07-04'), label:'Term 2' },
    }),
    prisma.term.upsert({
      where: { id: 'term-3-2025' }, update: {},
      create: { id:'term-3-2025', academicYearId:academicYear.id, termNumber:3, startDate:new Date('2025-08-04'), endDate:new Date('2025-10-31'), label:'Term 3' },
    }),
  ])
  console.log('✅ Terms seeded')

  // ── Users ─────────────────────────────────────────────────
  const hash = (p: string) => bcrypt.hash(p, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@goodshepherd.ac.ke' }, update: {},
    create: {
      email: 'admin@goodshepherd.ac.ke',
      passwordHash: await hash('Admin1234!'),
      role: 'ADMIN', firstName: 'Grace', lastName: 'Wanjiku',
    },
  })

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@goodshepherd.ac.ke' }, update: {},
    create: {
      email: 'teacher@goodshepherd.ac.ke',
      passwordHash: await hash('Teacher1234!'),
      role: 'TEACHER', firstName: 'David', lastName: 'Omondi',
    },
  })

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@goodshepherd.ac.ke' }, update: {},
    create: {
      email: 'parent@goodshepherd.ac.ke',
      passwordHash: await hash('Parent1234!'),
      role: 'PARENT', firstName: 'Faith', lastName: 'Kamau',
    },
  })
  console.log('✅ Users seeded')

  // ── Classes ───────────────────────────────────────────────
  const g4Level = gradeLevels.find(g => g.code === 'G4')!
  const kgLevel = gradeLevels.find(g => g.code === 'KG')!

  const grade4Class = await prisma.class.upsert({
    where: { id: 'class-g4-maple' }, update: {},
    create: {
      id:             'class-g4-maple',
      name:           'Grade 4 Maple',
      gradeLevelId:   g4Level.id,
      academicYearId: academicYear.id,
      classTeacherId: teacherUser.id,
      roomNumber:     'Room 5',
      capacity:       32,
    },
  })

  const kgClass = await prisma.class.upsert({
    where: { id: 'class-kg-a' }, update: {},
    create: {
      id:             'class-kg-a',
      name:           'Kindergarten A',
      gradeLevelId:   kgLevel.id,
      academicYearId: academicYear.id,
      classTeacherId: teacherUser.id,
      roomNumber:     'Room 1',
      capacity:       25,
    },
  })
  console.log('✅ Classes seeded')

  // ── Subjects ──────────────────────────────────────────────
  const g4Subjects = await Promise.all([
    'Mathematics', 'English', 'Science', 'Social Studies', 'Creative Arts',
  ].map((name, i) =>
    prisma.subject.upsert({
      where:  { id: `subj-g4-${i}` },
      update: {},
      create: { id: `subj-g4-${i}`, name, code: name.slice(0,3).toUpperCase(), gradeLevelId: g4Level.id, isCore: true },
    })
  ))
  console.log('✅ Subjects seeded')

  // ── Students ──────────────────────────────────────────────
  const studentData = [
    { id:'stu-1', firstName:'Amara',   lastName:'Mutua',    admissionNumber:'GSS/2024/001', gender:'FEMALE' as const, dob:'2015-03-12' },
    { id:'stu-2', firstName:'Brian',   lastName:'Kiplagat', admissionNumber:'GSS/2024/002', gender:'MALE'   as const, dob:'2015-07-22' },
    { id:'stu-3', firstName:'Cynthia', lastName:'Njoroge',  admissionNumber:'GSS/2024/003', gender:'FEMALE' as const, dob:'2015-01-05' },
    { id:'stu-4', firstName:'Daniel',  lastName:'Otieno',   admissionNumber:'GSS/2024/004', gender:'MALE'   as const, dob:'2015-09-18' },
    { id:'stu-5', firstName:'Eunice',  lastName:'Wambui',   admissionNumber:'GSS/2024/005', gender:'FEMALE' as const, dob:'2015-11-30' },
  ]

  for (const s of studentData) {
    const student = await prisma.student.upsert({
      where:  { admissionNumber: s.admissionNumber },
      update: {},
      create: {
        id: s.id, firstName: s.firstName, lastName: s.lastName,
        admissionNumber: s.admissionNumber,
        dateOfBirth: new Date(s.dob),
        gender: s.gender,
      },
    })

    // Enroll in Grade 4
    await prisma.studentEnrollment.upsert({
      where:  { studentId_academicYearId: { studentId: student.id, academicYearId: academicYear.id } },
      update: {},
      create: { studentId: student.id, classId: grade4Class.id, academicYearId: academicYear.id },
    })
  }

  // Link parent to first student
  await prisma.parentStudentLink.upsert({
    where:  { id: 'psl-faith-amara' },
    update: {},
    create: {
      id:              'psl-faith-amara',
      parentUserId:    parentUser.id,
      studentId:       'stu-1',
      relationship:    'Mother',
      isPrimaryContact: true,
    },
  })
  console.log('✅ Students seeded')

  // ── Announcement ──────────────────────────────────────────
  await prisma.announcement.upsert({
    where:  { id: 'ann-welcome' },
    update: {},
    create: {
      id:          'ann-welcome',
      title:       'Welcome to Good Shepherd School Portal',
      body:        'Dear parents and guardians, welcome to the Good Shepherd School management portal. You can now view your child\'s attendance, assignments, grades, and report cards here.',
      createdById: adminUser.id,
      audience:    'ALL',
      isPublished: true,
    },
  })
  console.log('✅ Announcement seeded')

  console.log('\n🎉 Seeding complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:   admin@goodshepherd.ac.ke   / Admin1234!')
  console.log('Teacher: teacher@goodshepherd.ac.ke / Teacher1234!')
  console.log('Parent:  parent@goodshepherd.ac.ke  / Parent1234!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())