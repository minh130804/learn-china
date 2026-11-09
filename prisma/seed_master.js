const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Executing Master Seed Script according to prompt.txt specifications on MySQL port 3307...');

  // Clean data
  await prisma.reviewLog.deleteMany();
  await prisma.userFlashcard.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.flashcardDeck.deleteMany();
  await prisma.examAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.grammarExample.deleteMany();
  await prisma.grammarPoint.deleteMany();
  await prisma.vocabularyExample.deleteMany();
  await prisma.vocabularyAudio.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.learningLevel.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.speakingAttempt.deleteMany();
  await prisma.speakingScenario.deleteMany();
  await prisma.writingAttempt.deleteMany();
  await prisma.writingExercise.deleteMany();
  await prisma.readingMaterial.deleteMany();
  await prisma.listeningMaterial.deleteMany();
  await prisma.userDailyGoal.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.roleModel.deleteMany();
  await prisma.dataImportLog.deleteMany();
  await prisma.dataSource.deleteMany();

  // 1. Roles
  console.log('1️⃣ Seeding Roles...');
  const roleUser = await prisma.roleModel.upsert({
    where: { code: 'USER' },
    update: {},
    create: { code: 'USER', name: 'Học viên', description: 'Người học tiếng Trung chuẩn quốc tế' },
  });
  const roleAdmin = await prisma.roleModel.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { code: 'ADMIN', name: 'Quản trị viên', description: 'Toàn quyền quản trị hệ sinh thái HanLearn' },
  });
  const roleTeacher = await prisma.roleModel.upsert({
    where: { code: 'TEACHER' },
    update: {},
    create: { code: 'TEACHER', name: 'Giảng viên', description: 'Giáo viên bản ngữ và trợ giảng' },
  });

  // 2. Users
  console.log('2️⃣ Seeding Users & Profiles...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@hanlearn.com',
      passwordHash: hashedPassword,
      name: 'Nguyễn Văn Học',
      role: 'USER',
      roleId: roleUser.id,
      profile: {
        create: {
          targetHskLevel: 'HSK3',
          dailyGoalMinutes: 20,
          streakDays: 7,
          totalPoints: 1250,
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hanlearn.com',
      passwordHash: adminPassword,
      name: 'Quản Trị Viên (Admin)',
      role: 'ADMIN',
      roleId: roleAdmin.id,
      profile: {
        create: {
          targetHskLevel: 'HSK6',
          dailyGoalMinutes: 60,
          streakDays: 45,
          totalPoints: 8900,
        },
      },
    },
  });

  // Daily goals for demo user
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.userDailyGoal.create({
    data: {
      userId: demoUser.id,
      date: todayStr,
      targetMinutes: 20,
      actualMinutes: 15,
      targetWords: 10,
      actualWords: 8,
      isCompleted: false,
    },
  });

  // 3. Learning Levels & Courses
  console.log('3️⃣ Seeding Learning Levels & Curriculum Courses...');
  const levelsData = [
    { code: 'HSK1', name: 'HSK 1 - Nhập môn vỡ lòng', desc: 'Làm quen bảng chữ cái Pinyin, 150 từ vựng và câu giao tiếp căn bản.', order: 1, words: 150, grammar: 45 },
    { code: 'HSK2', name: 'HSK 2 - Sơ cấp giao tiếp', desc: 'Tích lũy 300 từ vựng, diễn đạt nhu cầu đời sống thường nhật.', order: 2, words: 300, grammar: 60 },
    { code: 'HSK3', name: 'HSK 3 - Trung cấp sơ bộ', desc: 'Bỏ hoàn toàn Pinyin, nắm vững 600 từ vựng và kết cấu câu phức.', order: 3, words: 600, grammar: 80 },
    { code: 'HSK4', name: 'HSK 4 - Trung cấp nâng cao', desc: 'Đọc hiểu báo chí cơ bản, 1200 từ vựng, thảo luận chuyên đề xã hội.', order: 4, words: 1200, grammar: 100 },
    { code: 'HSK5', name: 'HSK 5 - Cao cấp học thuật', desc: 'Đọc tiểu luận, nghe phóng sự chuyên sâu, 2500 từ vựng học thuật.', order: 5, words: 2500, grammar: 120 },
    { code: 'HSK6', name: 'HSK 6 - Tinh thông thành thạo', desc: 'Thành thạo trên 5000 từ vựng, viết tóm tắt văn học và tìm lỗi ngữ pháp.', order: 6, words: 5000, grammar: 150 },
    { code: 'HSK7_9', name: 'HSK 7-9 - Chuyên gia nghiên cứu & Dịch thuật', desc: 'Khung năng lực HSK 3.0 cao cấp nhất phục vụ ngoại giao và nghiên cứu.', order: 7, words: 11000, grammar: 200 },
  ];

  for (const lvl of levelsData) {
    const levelRec = await prisma.learningLevel.create({
      data: {
        code: lvl.code,
        name: lvl.name,
        description: lvl.desc,
        order: lvl.order,
        targetWords: lvl.words,
        targetGrammar: lvl.grammar,
      },
    });

    // Create course for this level
    const course = await prisma.course.create({
      data: {
        levelId: levelRec.id,
        title: `Khóa học toàn diện ${lvl.name}`,
        slug: `khoa-hoc-${lvl.code.toLowerCase()}`,
        description: `Lộ trình học chuẩn quốc tế bám sát giáo trình Hanban và đề thi thật CLEC.`,
        order: lvl.order,
      },
    });

    // Add module and lesson
    const module1 = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: `Học phần 1: Từ vựng & Ngữ pháp trọng tâm`,
        order: 1,
      },
    });

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: `Bài 1: Làm quen ngữ âm và chào hỏi tiêu chuẩn`,
        content: `Chào mừng bạn đến với lộ trình chuẩn hóa ${lvl.name}. Trong bài học này, bạn sẽ nắm được hệ thống phát âm và từ vựng cốt lõi.`,
        order: 1,
        durationMinutes: 25,
      },
    });
  }

  // 4. Data Sources
  console.log('4️⃣ Seeding Data Sources...');
  const ds1 = await prisma.dataSource.create({
    data: {
      name: 'CC-CEDICT Open Chinese Dictionary',
      code: 'CC_CEDICT',
      url: 'https://cc-cedict.org',
      licenseType: 'Creative Commons Attribution-ShareAlike 4.0',
      attribution: 'MDBG / CC-CEDICT Community',
      status: 'ACTIVE',
      totalRecords: 121000,
      lastSyncedAt: new Date(),
    },
  });

  const ds2 = await prisma.dataSource.create({
    data: {
      name: 'Chinese Grammar Wiki',
      code: 'CG_WIKI',
      url: 'https://resources.allsetlearning.com/chinese/grammar',
      licenseType: 'CC BY-NC-SA 3.0',
      attribution: 'AllSet Learning',
      status: 'ACTIVE',
      totalRecords: 480,
      lastSyncedAt: new Date(),
    },
  });

  const ds3 = await prisma.dataSource.create({
    data: {
      name: 'CLEC Official Chinese Standard Corpus',
      code: 'CLEC_STANDARD',
      url: 'http://www.chinesetest.cn',
      licenseType: 'Educational Use',
      attribution: 'Center for Language Education and Cooperation (CLEC)',
      status: 'ACTIVE',
      totalRecords: 5000,
      lastSyncedAt: new Date(),
    },
  });

  // 5. Rich Vocabulary across HSK 1 - 6
  console.log('5️⃣ Seeding Comprehensive Core Vocabulary (HSK 1 - 6)...');
  const coreVocab = [
    // HSK 1
    { s: '你好', t: '你好', p: 'nǐ hǎo', mVi: 'Xin chào', mEn: 'Hello', pos: 'Thán từ', hsk: 'HSK1', strokes: 13, rad: '亻', ex: [{ c: '你好，很高兴认识你！', p: 'Nǐ hǎo, hěn gāoxìng rènshí nǐ!', vi: 'Xin chào, rất vui được làm quen với bạn!' }] },
    { s: '谢谢', t: '謝謝', p: 'xièxie', mVi: 'Cảm ơn', mEn: 'Thank you', pos: 'Động từ', hsk: 'HSK1', strokes: 12, rad: '讠', ex: [{ c: '不客气，不用谢。', p: 'Bú kèqi, bú yòng xiè.', vi: 'Không có chi, không cần cảm ơn đâu.' }] },
    { s: '再见', t: '再見', p: 'zàijiàn', mVi: 'Tạm biệt', mEn: 'Goodbye', pos: 'Động từ', hsk: 'HSK1', strokes: 10, rad: '冂', ex: [{ c: '明天见，再见！', p: 'Míngtiān jiàn, zàijiàn!', vi: 'Mai gặp lại nhé, tạm biệt!' }] },
    { s: '学习', t: '學習', p: 'xuéxí', mVi: 'Học tập', mEn: 'To study', pos: 'Động từ', hsk: 'HSK1', strokes: 11, rad: '子', ex: [{ c: '我每天学习汉语。', p: 'Wǒ měitiān xuéxí hànyǔ.', vi: 'Mỗi ngày tôi đều học tiếng Hán.' }] },
    { s: '老师', t: '老師', p: 'lǎoshī', mVi: 'Thầy giáo, cô giáo', mEn: 'Teacher', pos: 'Danh từ', hsk: 'HSK1', strokes: 10, rad: '匕', ex: [{ c: '王老师是我们的汉语老师。', p: 'Wáng lǎoshī shì wǒmen de hànyǔ lǎoshī.', vi: 'Thầy Vương là giáo viên tiếng Hán của chúng tôi.' }] },
    { s: '中国', t: '中國', p: 'Zhōngguó', mVi: 'Trung Quốc', mEn: 'China', pos: 'Danh từ riêng', hsk: 'HSK1', strokes: 12, rad: '丨', ex: [{ c: '我想去中国旅游。', p: 'Wǒ xiǎng qù Zhōngguó lǚyóu.', vi: 'Tôi muốn đi du lịch Trung Quốc.' }] },
    { s: '高兴', t: '高興', p: 'gāoxìng', mVi: 'Vui mừng, phấn khởi', mEn: 'Happy, glad', pos: 'Tính từ', hsk: 'HSK1', strokes: 15, rad: '高', ex: [{ c: '认识你我很高兴。', p: 'Rènshi nǐ wǒ hěn gāoxìng.', vi: 'Quen biết bạn tôi rất vui.' }] },
    { s: '看书', t: '看書', p: 'kàn shū', mVi: 'Đọc sách', mEn: 'To read a book', pos: 'Động từ', hsk: 'HSK1', strokes: 14, rad: '目', ex: [{ c: '他在图书馆看书。', p: 'Tā zài túshūguǎn kàn shū.', vi: 'Anh ấy đang đọc sách ở thư viện.' }] },
    
    // HSK 2
    { s: '跑步', t: '跑步', p: 'pǎobù', mVi: 'Chạy bộ', mEn: 'To run, to jog', pos: 'Động từ', hsk: 'HSK2', strokes: 12, rad: '足', ex: [{ c: '哥哥每天早上跑步。', p: 'Gēge měitiān zǎoshang pǎobù.', vi: 'Anh trai chạy bộ mỗi sáng.' }] },
    { s: '手表', t: '手錶', p: 'shǒubiǎo', mVi: 'Đồng hồ đeo tay', mEn: 'Wristwatch', pos: 'Danh từ', hsk: 'HSK2', strokes: 12, rad: '手', ex: [{ c: '这只手表很漂亮。', p: 'Zhè zhī shǒubiǎo hěn piàoliang.', vi: 'Chiếc đồng hồ này rất đẹp.' }] },
    { s: '运动', t: '運動', p: 'yùndòng', mVi: 'Vận động, thể thao', mEn: 'Exercise, sport', pos: 'Danh từ / Động từ', hsk: 'HSK2', strokes: 16, rad: '辶', ex: [{ c: '多做运动对身体有好处。', p: 'Duō zuò yùndòng duì shēntǐ yǒu hǎochu.', vi: 'Tập thể dục nhiều rất có lợi cho cơ thể.' }] },
    { s: '便宜', t: '便宜', p: 'piányi', mVi: 'Rẻ, giá rẻ', mEn: 'Cheap, inexpensive', pos: 'Tính từ', hsk: 'HSK2', strokes: 11, rad: '亻', ex: [{ c: '这件衣服既好看又便宜。', p: 'Zhè jiàn yīfu jì hǎokàn yòu piányi.', vi: 'Chiếc áo này vừa đẹp lại vừa rẻ.' }] },
    { s: '准备', t: '準備', p: 'zhǔnbèi', mVi: 'Chuẩn bị', mEn: 'To prepare', pos: 'Động từ', hsk: 'HSK2', strokes: 16, rad: '冫', ex: [{ c: '你准备好考试了吗？', p: 'Nǐ zhǔnbèi hǎo kǎoshì le ma?', vi: 'Bạn đã chuẩn bị tốt cho kỳ thi chưa?' }] },

    // HSK 3
    { s: '搬家', t: '搬家', p: 'bānjiā', mVi: 'Chuyển nhà', mEn: 'To move house', pos: 'Động từ', hsk: 'HSK3', strokes: 19, rad: '扌', ex: [{ c: '我们打算这个周末搬家。', p: 'Wǒmen dǎsuàn zhè ge zhōumò bānjiā.', vi: 'Chúng tôi dự định cuối tuần này chuyển nhà.' }] },
    { s: '解决', t: '解決', p: 'jiějué', mVi: 'Giải quyết', mEn: 'To solve', pos: 'Động từ', hsk: 'HSK3', strokes: 19, rad: '角', ex: [{ c: '这个问题终于解决了。', p: 'Zhè ge wèntí zhōngyú jiějué le.', vi: 'Vấn đề này cuối cùng đã được giải quyết.' }] },
    { s: '清楚', t: '清楚', p: 'qīngchu', mVi: 'Rõ ràng, hiểu rõ', mEn: 'Clear, distinct', pos: 'Tính từ', hsk: 'HSK3', strokes: 24, rad: '氵', ex: [{ c: '你看清楚了吗？', p: 'Nǐ kàn qīngchu le ma?', vi: 'Bạn nhìn rõ chưa?' }] },
    { s: '环境', t: '環境', p: 'huánjìng', mVi: 'Môi trường, hoàn cảnh', mEn: 'Environment', pos: 'Danh từ', hsk: 'HSK3', strokes: 18, rad: '王', ex: [{ c: '保护环境人人有责。', p: 'Bǎohù huánjìng rénrén yǒuzé.', vi: 'Bảo vệ môi trường là trách nhiệm của mọi người.' }] },

    // HSK 4
    { s: '坚持', t: '堅持', p: 'jiānchí', mVi: 'Kiên trì', mEn: 'To persist, persevere', pos: 'Động từ', hsk: 'HSK4', strokes: 16, rad: '扌', ex: [{ c: '只要坚持就能取得胜利。', p: 'Zhǐyào jiānchí jiù néng qǔdé shènglì.', vi: 'Chỉ cần kiên trì thì có thể giành thắng lợi.' }] },
    { s: '尊重', t: '尊重', p: 'zūnzhòng', mVi: 'Tôn trọng', mEn: 'To respect', pos: 'Động từ', hsk: 'HSK4', strokes: 18, rad: '寸', ex: [{ c: '人与人之间应该互相尊重。', p: 'Rén yǔ rén zhījiān yīnggāi hùxiāng zūnzhòng.', vi: 'Giữa người với người nên tôn trọng lẫn nhau.' }] },
    { s: '复杂', t: '複雜', p: 'fùzá', mVi: 'Phức tạp', mEn: 'Complex, complicated', pos: 'Tính từ', hsk: 'HSK4', strokes: 16, rad: '夂', ex: [{ c: '情况比我们想象的还要复杂。', p: 'Qíngkuàng bǐ wǒmen xiǎngxiàng de hái yào fùzá.', vi: 'Tình hình còn phức tạp hơn chúng ta tưởng tượng.' }] },

    // HSK 5
    { s: '树立', t: '樹立', p: 'shùlì', mVi: 'Xây dựng, thiết lập', mEn: 'To establish', pos: 'Động từ', hsk: 'HSK5', strokes: 14, rad: '木', ex: [{ c: '树立良好的企业形象。', p: 'Shùlì liánghǎo de qǐyè xíngxiàng.', vi: 'Xây dựng hình ảnh doanh nghiệp tốt đẹp.' }] },
    { s: '潜能', t: '潛能', p: 'qiánnéng', mVi: 'Tiềm năng', mEn: 'Potential', pos: 'Danh từ', hsk: 'HSK5', strokes: 20, rad: '氵', ex: [{ c: '激发每个学生的内在潜能。', p: 'Jīfā měi gè xuésheng de nèizài qiánnéng.', vi: 'Kích thích tiềm năng bên trong của mỗi học sinh.' }] },

    // HSK 6
    { s: '天人合一', t: '天人合一', p: 'tiān rén hé yī', mVi: 'Thiên nhân hợp nhất', mEn: 'Unity of nature and humans', pos: 'Thành ngữ', hsk: 'HSK6', strokes: 14, rad: '大', ex: [{ c: '中国哲学追求天人合一的境界。', p: 'Zhōngguó zhéxué zhuīqiú tiān rén hé yī de jìngjiè.', vi: 'Triết học Trung Quốc mưu cầu cảnh giới thiên nhân hợp nhất.' }] },
    { s: '融会贯通', t: '融會貫通', p: 'róng huì guàn tōng', mVi: 'Dung hội quán thông, hiểu thấu triệt', mEn: 'Master thoroughly', pos: 'Thành ngữ', hsk: 'HSK6', strokes: 36, rad: '虫', ex: [{ c: '将中西文化精髓融会贯通。', p: 'Jiāng zhōng xī wénhuà jīngsuǐ róng huì guàn tōng.', vi: 'Dung hội thấu suốt tinh hoa văn hóa Đông Tây.' }] },
  ];

  let demoFlashcardDeck = await prisma.flashcardDeck.create({
    data: {
      userId: demoUser.id,
      title: 'Từ vựng cốt lõi HSK 1 - HSK 3 của tôi',
      description: 'Bộ thẻ nhớ ôn tập theo thuật toán SuperMemo SM-2',
      hskLevel: 'HSK1',
      isPublic: true,
    },
  });

  for (const item of coreVocab) {
    const vocabRec = await prisma.vocabulary.create({
      data: {
        simplified: item.s,
        traditional: item.t,
        pinyin: item.p,
        meaningVi: item.mVi,
        meaningEn: item.mEn,
        partOfSpeech: item.pos,
        hskLevel: item.hsk,
        strokeCount: item.strokes,
        radical: item.rad,
        dataSourceId: ds1.id,
        examples: {
          create: item.ex.map((e) => ({
            chinese: e.c,
            pinyin: e.p,
            vietnamese: e.vi,
          })),
        },
      },
    });

    // Add to flashcards
    await prisma.flashcard.create({
      data: {
        deckId: demoFlashcardDeck.id,
        vocabularyId: vocabRec.id,
        front: vocabRec.simplified,
        back: `${vocabRec.pinyin} - ${vocabRec.meaningVi}`,
        hint: `Nét: ${vocabRec.strokeCount} | Bộ thủ: ${vocabRec.radical}`,
      },
    });

    // Add to user vocabulary (SM-2 SRS)
    await prisma.userFlashcard.create({
      data: {
        userId: demoUser.id,
        vocabularyId: vocabRec.id,
        interval: 1,
        repetition: 1,
        easeFactor: 2.5,
        state: 'LEARNING',
      },
    });
  }

  // 6. Chinese Grammar Wiki Points (HSK 1 - 6)
  console.log('6️⃣ Seeding Grammar Points from Chinese Grammar Wiki...');
  const grammarPoints = [
    {
      level: 'HSK1',
      title: 'Động từ phán đoán 是 (shì)',
      pattern: 'A + 是 + B',
      expVi: 'Dùng để nối hai danh từ hoặc đại từ, biểu thị quan hệ đồng nhất hoặc định danh (A là B).',
      expEn: 'Used to link two nouns, indicating identity or classification (A is B).',
      notes: 'Phủ định dùng 不是 (bú shì). Không dùng 是 với tính từ.',
      mistakes: 'Lỗi sai phổ biến: Nói "我很好" (Đúng) nhưng nói "我是很好" (Sai).',
      examples: [
        { c: '我是越南人。', p: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
        { c: '他不是我的老师。', p: 'Tā bú shì wǒ de lǎoshī.', vi: 'Anh ấy không phải là giáo viên của tôi.' },
      ],
    },
    {
      level: 'HSK2',
      title: 'Câu so sánh chữ 比 (bǐ)',
      pattern: 'A + 比 + B + Tính từ',
      expVi: 'Biểu thị A có mức độ tính chất cao hơn B (A hơn B).',
      expEn: 'Expresses that A possesses a higher degree of a quality than B.',
      notes: 'Nếu muốn nhấn mạnh mức độ cụ thể, đặt sau tính từ (一点儿 / 得多 / 很多).',
      mistakes: 'Không dùng 很, 非常 trước tính từ trong câu chữ 比 (VD: "他比我很高" là SAI).',
      examples: [
        { c: '今天比昨天冷。', p: 'Jīntiān bǐ zuótiān lěng.', vi: 'Hôm nay lạnh hơn hôm qua.' },
        { c: '哥哥比我大两岁。', p: 'Gēge bǐ wǒ dà liǎng suì.', vi: 'Anh trai lớn hơn tôi 2 tuổi.' },
      ],
    },
    {
      level: 'HSK3',
      title: 'Câu chữ 把 (bǎ - Câu xử trí)',
      pattern: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác',
      expVi: 'Nhấn mạnh hành động tác động lên tân ngữ khiến tân ngữ thay đổi vị trí hoặc trạng thái.',
      expEn: 'Emphasizes an action performed upon an object resulting in a change of state or position.',
      notes: 'Động từ không được đứng đơn độc, phải có bổ ngữ kết quả, bổ ngữ xu hướng hoặc trợ từ 了.',
      mistakes: 'Không đặt từ phủ định 没 sau chữ 把 (Phải đặt trước 把: "我没把作业做完").',
      examples: [
        { c: '请把门关上。', p: 'Qǐng bǎ mén guān shàng.', vi: 'Xin hãy đóng cửa lại.' },
        { c: '他把房间打扫得干干净净。', p: 'Tā bǎ fángjiān dǎsǎo de gāngānjìngjìng.', vi: 'Anh ấy dọn dẹp căn phòng sạch bong kin kít.' },
      ],
    },
    {
      level: 'HSK4',
      title: 'Cấu trúc nhấn mạnh 连...都/也... (lián... dōu/yě...)',
      pattern: '连 + Thành phần nhấn mạnh + 都/也 + Vị ngữ',
      expVi: 'Biểu thị nhấn mạnh ngay cả một trường hợp cực đoan hay đơn giản nhất cũng xảy ra.',
      expEn: 'Emphasizes an extreme or simple example to illustrate a broader point (even...).',
      notes: 'Thành phần nhấn mạnh có thể là chủ ngữ, tân ngữ hoặc trạng ngữ.',
      mistakes: 'Quên dùng 都 hoặc 也 ở vế sau.',
      examples: [
        { c: '这个问题太简单了，连小孩子都知道。', p: 'Zhè ge wèntí tài jiǎndān le, lián xiǎoháizi dōu zhīdào.', vi: 'Câu hỏi này quá đơn giản, ngay cả đứa trẻ cũng biết.' },
      ],
    },
    {
      level: 'HSK5',
      title: 'Liên từ kết quả 从而 (cóng’ér)',
      pattern: 'Mệnh đề 1 + 从而 + Mệnh đề 2 (Kết quả / Mục đích)',
      expVi: 'Biểu thị sự việc ở vế trước là điều kiện tiền đề, từ đó dẫn đến kết quả hoặc phương hướng ở vế sau.',
      expEn: 'Indicates that the preceding action serves as a condition leading to a further result or purpose.',
      notes: 'Chỉ dùng nối giữa hai mệnh đề trong cùng một câu, không đứng đầu câu đơn lập.',
      mistakes: 'Dùng nhầm 从而 thay cho 所以 trong văn nói đời thường.',
      examples: [
        { c: '企业引进了先进技术，从而大幅提高了生产效率。', p: 'Qǐyè yǐnjìn le xiānjìn jìshù, cóng’ér dàfú tígāo le shēngchǎn xiàolǜ.', vi: 'Doanh nghiệp nhập khẩu công nghệ tiên tiến, từ đó nâng cao vượt bậc năng suất sản xuất.' },
      ],
    },
  ];

  for (const gp of grammarPoints) {
    await prisma.grammarPoint.create({
      data: {
        hskLevel: gp.level,
        title: gp.title,
        pattern: gp.pattern,
        explanationVi: gp.expVi,
        explanationEn: gp.expEn,
        usageNotes: gp.notes,
        commonMistakes: gp.mistakes,
        examples: {
          create: gp.examples.map((e) => ({
            chinese: e.c,
            pinyin: e.p,
            translation: e.vi,
          })),
        },
      },
    });
  }

  // 7. Listening Material
  console.log('7️⃣ Seeding Listening Materials...');
  await prisma.listeningMaterial.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Hội thoại sơ cấp: Chào hỏi và làm quen bạn mới',
      description: 'Luyện nghe đoạn hội thoại chuẩn giọng Bắc Kinh tốc độ tự nhiên.',
      transcript: '王老师：你好！我叫王朋，请问你叫什么名字？\n李月：老师您好！我叫李月，我是汉语班的新学生。\n王老师：很高兴认识你！李月，你是哪国人？\n李月：我是越南人，我非常喜欢学习汉语和中国文化。',
      pinyin: 'Wáng lǎoshī: Nǐ hǎo! Wǒ jiào Wáng Péng, qǐngwèn nǐ jiào shénme míngzi?\nLǐ Yuè: Lǎoshī nín hǎo! Wǒ jiào Lǐ Yuè, wǒ shì hànyǔ bān de xīn xuésheng.\nWáng lǎoshī: Hěn gāoxìng rènshí nǐ! Lǐ Yuè, nǐ shì nǎ guó rén?\nLǐ Yuè: Wǒ shì Yuènán rén, wǒ fēicháng xǐhuan xuéxí hànyǔ hé Zhōngguó wénhuà.',
      translationVi: 'Thầy Vương: Xin chào! Thầy tên là Vương Bằng, xin hỏi em tên gì?\nLý Nguyệt: Em chào thầy ạ! Em tên là Lý Nguyệt, em là học sinh mới của lớp tiếng Hán.\nThầy Vương: Rất vui được gặp em! Lý Nguyệt, em là người nước nào?\nLý Nguyệt: Em là người Việt Nam, em rất thích học tiếng Hán và văn hóa Trung Quốc.',
      duration: 50,
      questions: [
        {
          id: 'q1',
          question: '李月是哪国人？(Lý Nguyệt là người nước nào?)',
          options: ['A. 中国人 (Người Trung Quốc)', 'B. 越南人 (Người Việt Nam)', 'C. 美国人 (Người Mỹ)'],
          answer: 'B. 越南人 (Người Việt Nam)',
          explanation: 'Trong bài nghe Lý Nguyệt nói rõ: "我是越南人" (Em là người Việt Nam).',
        },
      ],
    },
  });

  // 8. Reading Material
  console.log('8️⃣ Seeding Reading Materials...');
  await prisma.readingMaterial.create({
    data: {
      hskLevel: 'HSK2',
      title: 'Mỗi ngày của tôi (我的一天)',
      topic: 'Cuộc sống hàng ngày',
      estimatedMinutes: 5,
      contentChinese: '我每天早上七点起床，洗脸刷牙后和家人一起吃早饭。早饭后，我骑自行车去学校上课。下午四点下课后，我和朋友们一起在操场踢足球。晚上，我做完作业后常常看一个小时的中国电影。我觉得学汉语非常有趣。',
      contentPinyin: 'Wǒ měitiān zǎoshang qī diǎn qǐchuáng, xǐliǎn shuāyá hòu hé jiārén yìqǐ chī zǎofàn. Zǎofàn hòu, wǒ qí zìxíngchē qù xuéxiào shàngkè. Xiàwǔ sì diǎn xiàkè hòu, wǒ hé péngyoumen yìqǐ zài cāochǎng tī zúqiú. Wǎnshang, wǒ zuò wán zuòyè hòu chángcháng kàn yí gè xiǎoshí de Zhōngguó diànyǐng. Wǒ juéde xué hànyǔ fēicháng yǒuqù.',
      contentVi: 'Mỗi ngày tôi thức dậy lúc 7 giờ sáng, sau khi rửa mặt đánh răng thì cùng gia đình ăn bữa sáng. Sau bữa sáng, tôi đi xe đạp đến trường học. Buổi chiều sau khi tan học lúc 4 giờ, tôi cùng bạn bè đá bóng ở sân vận động. Buổi tối, sau khi làm xong bài tập tôi thường xem phim Trung Quốc một tiếng. Tôi cảm thấy học tiếng Hán rất thú vị.',
    },
  });

  // 9. Speaking Scenario
  console.log('9️⃣ Seeding Speaking Scenarios...');
  await prisma.speakingScenario.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Gọi món tại nhà hàng Trung Hoa (点餐)',
      description: 'Luyện tập gọi món ăn, hỏi giá tiền và thanh toán bằng tiếng Trung trong nhà hàng.',
      roleAi: 'Người phục vụ quán ăn (服务员)',
      roleUser: 'Khách hàng (顾客)',
      initialPrompt: '你好！欢迎光临！请问几位？想吃点儿什么？',
      systemPrompt: 'Bạn là người phục vụ quán ăn Trung Quốc thân thiện. Hãy lắng nghe câu nói của khách, nhận diện tiếng Trung hoặc nếu khách nói tiếng Việt không hiểu (như "chịu", "không biết"), hãy lịch sự hướng dẫn câu tiếng Trung tương ứng. Sửa phát âm nhẹ nhàng và gợi ý câu tiếp theo.',
    },
  });

  // 10. Writing Exercises
  console.log('🔟 Seeding Writing Exercises (Mễ Tự Cách)...');
  const characters = [
    { char: '你', py: 'nǐ', vi: 'Bạn, anh, chị (ngôi thứ 2)', strokes: 7, rad: '亻' },
    { char: '好', py: 'hǎo', vi: 'Tốt, đẹp, khỏe', strokes: 6, rad: '女' },
    { char: '学', py: 'xué', vi: 'Học tập', strokes: 8, rad: '子' },
    { char: '汉', py: 'hàn', vi: 'Hán (dân tộc Hán, chữ Hán)', strokes: 5, rad: '氵' },
  ];
  for (const c of characters) {
    await prisma.writingExercise.upsert({
      where: { character: c.char },
      update: {},
      create: {
        character: c.char,
        pinyin: c.py,
        meaningVi: c.vi,
        strokeCount: c.strokes,
        radical: c.rad,
      },
    });
  }

  // 11. Achievements
  console.log('1️⃣1️⃣ Seeding Gamification Achievements...');
  const achievements = [
    { code: 'FIRST_LOGIN', title: 'Khởi đầu thuận lợi', desc: 'Đăng nhập vào HanLearn lần đầu tiên.', icon: '🌟', points: 50 },
    { code: 'STREAK_7', title: 'Ngọn lửa kiên trì (7 ngày)', desc: 'Duy trì chuỗi học tập 7 ngày liên tục.', icon: '🔥', points: 150 },
    { code: 'VOCAB_50', title: 'Vốn từ mở rộng', desc: 'Học thành thạo 50 từ vựng trong Flashcard.', icon: '📚', points: 100 },
    { code: 'HSK1_PASS', title: 'Chinh phục HSK 1', desc: 'Đạt điểm chuẩn kỳ thi thử HSK 1 chính thức.', icon: '🏆', points: 200 },
  ];
  for (const ach of achievements) {
    const achRec = await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {},
      create: {
        code: ach.code,
        title: ach.title,
        description: ach.desc,
        icon: ach.icon,
        points: ach.points,
      },
    });

    // Award first login to demo user
    if (ach.code === 'FIRST_LOGIN') {
      await prisma.userAchievement.create({
        data: {
          userId: demoUser.id,
          achievementId: achRec.id,
        },
      });
    }
  }

  console.log('✅ Master Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Master seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
