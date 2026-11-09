const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding on MySQL (Port 3307)...');

  // 1. Clean existing records if any
  await prisma.reviewLog.deleteMany();
  await prisma.userFlashcard.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.flashcardDeck.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.speakingScenario.deleteMany();
  await prisma.readingMaterial.deleteMany();
  await prisma.listeningMaterial.deleteMany();
  await prisma.writingExercise.deleteMany();
  await prisma.grammarExample.deleteMany();
  await prisma.grammarPoint.deleteMany();
  await prisma.vocabularyExample.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.dataImportLog.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Data Sources
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
      name: 'HSK Official Standard Standardized Corpus',
      code: 'HSK_STANDARD',
      url: 'http://www.chinesetest.cn',
      licenseType: 'Educational Use',
      attribution: 'Center for Language Education and Cooperation (CLEC)',
      status: 'ACTIVE',
      totalRecords: 5000,
      lastSyncedAt: new Date(),
    },
  });

  // 3. Users
  const hashedPassword = await bcrypt.hash('123456', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@hanlearn.com',
      passwordHash: hashedPassword,
      name: 'Nguyễn Văn Học',
      role: 'USER',
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

  console.log('✅ Created users: demo@hanlearn.com / 123456 and admin@hanlearn.com / admin123');

  // 4. Vocabulary (Real HSK 1, 2, 3 items with examples)
  const vocabItems = [
    {
      simplified: '你好',
      traditional: '你好',
      pinyin: 'nǐ hǎo',
      pinyinNoTone: 'ni hao',
      meaningVi: 'Xin chào',
      meaningEn: 'Hello, how are you',
      partOfSpeech: 'Thán từ / Lời chào',
      hskLevel: 'HSK1',
      strokeCount: 13,
      radical: '亻 (Nhân đứng)',
      frequency: 1,
      examples: [
        { chinese: '你好，很高兴认识你！', pinyin: 'Nǐ hǎo, hěn gāoxìng rènshí nǐ!', vietnamese: 'Xin chào, rất vui được làm quen với bạn!' },
        { chinese: '老师，您好！', pinyin: 'Lǎoshī, nín hǎo!', vietnamese: 'Em chào thầy/cô ạ!' }
      ]
    },
    {
      simplified: '谢谢',
      traditional: '謝謝',
      pinyin: 'xièxie',
      pinyinNoTone: 'xie xie',
      meaningVi: 'Cảm ơn',
      meaningEn: 'Thanks, thank you',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK1',
      strokeCount: 12,
      radical: '讠 (Ngôn)',
      frequency: 2,
      examples: [
        { chinese: '非常感谢你的帮助。', pinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù.', vietnamese: 'Vô cùng cảm ơn sự giúp đỡ của bạn.' },
        { chinese: '不客气，不用谢。', pinyin: 'Bú kèqi, bú yòng xiè.', vietnamese: 'Không có chi, không cần cảm ơn đâu.' }
      ]
    },
    {
      simplified: '再见',
      traditional: '再見',
      pinyin: 'zàijiàn',
      pinyinNoTone: 'zai jian',
      meaningVi: 'Tạm biệt, hẹn gặp lại',
      meaningEn: 'Goodbye, see you again',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK1',
      strokeCount: 10,
      radical: '冂 (Quynh)',
      frequency: 3,
      examples: [
        { chinese: '明天见，再见！', pinyin: 'Míngtiān jiàn, zàijiàn!', vietnamese: 'Mai gặp lại nhé, tạm biệt!' }
      ]
    },
    {
      simplified: '学习',
      traditional: '學習',
      pinyin: 'xuéxí',
      pinyinNoTone: 'xue xi',
      meaningVi: 'Học tập, học hỏi',
      meaningEn: 'To study, to learn',
      partOfSpeech: 'Động từ / Danh từ',
      hskLevel: 'HSK1',
      strokeCount: 11,
      radical: '子 (Tử)',
      frequency: 10,
      examples: [
        { chinese: '我每天学习汉语两个小时。', pinyin: 'Wǒ měitiān xuéxí hànyǔ liǎng gè xiǎoshí.', vietnamese: 'Mỗi ngày tôi học tiếng Hán 2 tiếng đồng hồ.' },
        { chinese: '学习是一生的事情。', pinyin: 'Xuéxí shì yìshēng de shìqing.', vietnamese: 'Học tập là việc cả đời.' }
      ]
    },
    {
      simplified: '朋友',
      traditional: '朋友',
      pinyin: 'péngyou',
      pinyinNoTone: 'peng you',
      meaningVi: 'Bạn bè, người bạn',
      meaningEn: 'Friend',
      partOfSpeech: 'Danh từ',
      hskLevel: 'HSK1',
      strokeCount: 8,
      radical: '月 (Nguyệt)',
      frequency: 15,
      examples: [
        { chinese: '他是我的好朋友。', pinyin: 'Tā shì wǒ de hǎo péngyou.', vietnamese: 'Anh ấy là bạn thân của tôi.' }
      ]
    },
    {
      simplified: '中国',
      traditional: '中國',
      pinyin: 'Zhōngguó',
      pinyinNoTone: 'Zhong guo',
      meaningVi: 'Trung Quốc',
      meaningEn: 'China',
      partOfSpeech: 'Danh từ riêng',
      hskLevel: 'HSK1',
      strokeCount: 12,
      radical: '丨 (Sổ)',
      frequency: 5,
      examples: [
        { chinese: '我想去中国旅游。', pinyin: 'Wǒ xiǎng qù Zhōngguó lǚyóu.', vietnamese: 'Tôi muốn đi du lịch Trung Quốc.' }
      ]
    },
    {
      simplified: '吃',
      traditional: '吃',
      pinyin: 'chī',
      pinyinNoTone: 'chi',
      meaningVi: 'Ăn',
      meaningEn: 'To eat',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK1',
      strokeCount: 6,
      radical: '口 (Khẩu)',
      frequency: 12,
      examples: [
        { chinese: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', vietnamese: 'Bạn muốn ăn gì?' },
        { chinese: '我们去吃中国菜吧。', pinyin: 'Wǒmen qù chī Zhōngguó cài ba.', vietnamese: 'Chúng ta đi ăn món Trung Quốc nhé.' }
      ]
    },
    {
      simplified: '喝',
      traditional: '喝',
      pinyin: 'hē',
      pinyinNoTone: 'he',
      meaningVi: 'Uống',
      meaningEn: 'To drink',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK1',
      strokeCount: 12,
      radical: '口 (Khẩu)',
      frequency: 20,
      examples: [
        { chinese: '你喜欢喝茶还是喝咖啡？', pinyin: 'Nǐ xǐhuan hē chá háishì hē kāfēi?', vietnamese: 'Bạn thích uống trà hay uống cà phê?' }
      ]
    },
    {
      simplified: '准备',
      traditional: '準備',
      pinyin: 'zhǔnbèi',
      pinyinNoTone: 'zhun bei',
      meaningVi: 'Chuẩn bị, dự định',
      meaningEn: 'To prepare, ready',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK2',
      strokeCount: 17,
      radical: '冫 (Băng)',
      frequency: 45,
      examples: [
        { chinese: '你考试准备得怎么样了？', pinyin: 'Nǐ kǎoshì zhǔnbèi de zěnmeyàng le?', vietnamese: 'Bạn chuẩn bị bài thi thế nào rồi?' }
      ]
    },
    {
      simplified: '已经',
      traditional: '已經',
      pinyin: 'yǐjīng',
      pinyinNoTone: 'yi jing',
      meaningVi: 'Đã, rồi',
      meaningEn: 'Already',
      partOfSpeech: 'Phó từ',
      hskLevel: 'HSK2',
      strokeCount: 11,
      radical: '己 (Kỷ)',
      frequency: 30,
      examples: [
        { chinese: '他已经回家了。', pinyin: 'Tā yǐjīng huí jiā le.', vietnamese: 'Anh ấy đã về nhà rồi.' }
      ]
    },
    {
      simplified: '环境',
      traditional: '環境',
      pinyin: 'huánjìng',
      pinyinNoTone: 'huan jing',
      meaningVi: 'Môi trường, hoàn cảnh',
      meaningEn: 'Environment, surroundings',
      partOfSpeech: 'Danh từ',
      hskLevel: 'HSK3',
      strokeCount: 16,
      radical: '王 (Ngọc)',
      frequency: 70,
      examples: [
        { chinese: '这里的学习环境非常好。', pinyin: 'Zhèlǐ de xuéxí huánjìng fēicháng hǎo.', vietnamese: 'Môi trường học tập ở đây rất tốt.' }
      ]
    },
    {
      simplified: '提高',
      traditional: '提高',
      pinyin: 'tígāo',
      pinyinNoTone: 'ti gao',
      meaningVi: 'Nâng cao, cải thiện',
      meaningEn: 'To improve, to enhance',
      partOfSpeech: 'Động từ',
      hskLevel: 'HSK3',
      strokeCount: 22,
      radical: '扌 (Thủ)',
      frequency: 60,
      examples: [
        { chinese: '通过练习，我的汉语听力提高了很多。', pinyin: 'Tōngguò liànxí, wǒ de hànyǔ tīnglì tígāo le hěn duō.', vietnamese: 'Qua luyện tập, khả năng nghe tiếng Hán của tôi đã tiến bộ rất nhiều.' }
      ]
    }
  ];

  const createdVocabs = [];
  for (const item of vocabItems) {
    const { examples, ...vocabData } = item;
    const vocab = await prisma.vocabulary.create({
      data: {
        ...vocabData,
        dataSourceId: ds3.id,
        examples: {
          create: examples,
        },
      },
    });
    createdVocabs.push(vocab);
  }
  console.log(`✅ Seeded ${createdVocabs.length} core vocabulary items.`);

  // 5. Flashcard Decks & Spaced Repetition cards
  const deck1 = await prisma.flashcardDeck.create({
    data: {
      userId: demoUser.id,
      title: 'HSK 1: Từ Vựng Thiết Yếu Hàng Ngày',
      description: 'Bộ thẻ ôn luyện từ vựng giao tiếp và cơ bản nhất của HSK 1 với hệ thống lặp lại ngắt quãng (SRS).',
      hskLevel: 'HSK1',
      isPublic: true,
      flashcards: {
        create: createdVocabs.slice(0, 6).map((v) => ({
          vocabularyId: v.id,
          front: v.simplified,
          back: `${v.pinyin} - ${v.meaningVi}`,
          hint: `Số nét: ${v.strokeCount} | Bộ thủ: ${v.radical || 'Cơ bản'}`,
        })),
      },
    },
  });

  // Assign user flashcard SRS progress to demoUser
  for (const v of createdVocabs.slice(0, 4)) {
    await prisma.userFlashcard.create({
      data: {
        userId: demoUser.id,
        vocabularyId: v.id,
        interval: 1,
        repetition: 2,
        easeFactor: 2.5,
        dueDate: new Date(),
        state: 'REVIEW',
      },
    });
  }

  // 6. Grammar Points
  const grammar1 = await prisma.grammarPoint.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Cấu trúc câu khẳng định với 是 (shì)',
      pattern: 'Chủ ngữ + 是 + Tân ngữ',
      explanationVi: 'Từ 是 tương đương với động từ "là" trong tiếng Việt, dùng để liên kết chủ ngữ với một danh từ hoặc cụm danh từ chỉ tính chất, nghề nghiệp, thân phận.',
      explanationEn: 'The verb 是 (shì) functions like the verb "to be" to equate the subject with another noun/phrase.',
      usageNotes: 'Không dùng 是 trước tính từ trực tiếp (Ví dụ: Không nói "我 是 高", mà nói "我 很高").',
      commonMistakes: 'Sai: 我是好 (Wǒ shì hǎo). Đúng: 我很好 (Wǒ hěn hǎo).',
      order: 1,
      examples: {
        create: [
          { chinese: '我是越南人。', pinyin: 'Wǒ shì Yuènán rén.', translation: 'Tôi là người Việt Nam.' },
          { chinese: '他是汉语老师。', pinyin: 'Tā shì hànyǔ lǎoshī.', translation: 'Anh ấy là giáo viên dạy tiếng Trung.' },
        ],
      },
    },
  });

  const grammar2 = await prisma.grammarPoint.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Câu hỏi nghi vấn với trợ từ 吗 (ma)',
      pattern: 'Câu trần thuật + 吗？',
      explanationVi: 'Đặt trợ từ 吗 ở cuối một câu trần thuật bất kỳ để tạo thành câu hỏi Yes/No (Có... không?). Giữ nguyên trật tự từ trong câu.',
      explanationEn: 'Place 吗 (ma) at the end of a statement to transform it into a yes/no question.',
      usageNotes: 'Khi câu đã có đại từ nghi vấn (谁, 什么, 哪儿...) thì TUYỆT ĐỐI không dùng 吗 nữa.',
      commonMistakes: 'Sai: 你是谁吗？. Đúng: 你是谁？',
      order: 2,
      examples: {
        create: [
          { chinese: '你是学生吗？', pinyin: 'Nǐ shì xuéshēng ma?', translation: 'Bạn có phải là học sinh không?' },
          { chinese: '他喜欢喝茶吗？', pinyin: 'Tā xǐhuan hē chá ma?', translation: 'Anh ấy thích uống trà không?' },
        ],
      },
    },
  });

  const grammar3 = await prisma.grammarPoint.create({
    data: {
      hskLevel: 'HSK2',
      title: 'Phân biệt ba trợ từ kết cấu 的、得、地 (de)',
      pattern: 'Định ngữ + 的 + Danh từ | Động từ/Tính từ + 得 + Bổ ngữ | Phó từ/Tính từ + 地 + Động từ',
      explanationVi: 'Ba trợ từ này đồng âm "de" nhưng cách dùng hoàn toàn khác nhau: 的 đi trước Danh từ (sở hữu/tính chất); 得 đi sau Động từ để nối với Bổ ngữ chỉ mức độ; 地 đi trước Động từ (bổ nghĩa cho hành động).',
      explanationEn: 'The three "de" particles: 的 modifies nouns, 得 introduces degree complements after verbs/adjectives, and 地 forms adverbs before verbs.',
      usageNotes: 'Mẹo nhớ nhanh: 的 (chữ Bạch) gắn với Danh từ; 得 (chữ Kép) gắn sau Động từ; 地 (chữ Thổ) gắn trước Động từ.',
      commonMistakes: 'Sai: 跑的很快. Đúng: 跑得很快 (Chạy rất nhanh).',
      order: 3,
      examples: {
        create: [
          { chinese: '这是我的书。', pinyin: 'Zhè shì wǒ de shū.', translation: 'Đây là sách của tôi (的 + Danh từ).' },
          { chinese: '他说汉语说得很好。', pinyin: 'Tā shuō hànyǔ shuō de hěn hǎo.', translation: 'Anh ấy nói tiếng Trung rất tốt (Động từ + 得 + Bổ ngữ).' },
          { chinese: '他慢慢地走。', pinyin: 'Tā mànmàn de zǒu.', translation: 'Anh ấy đi thật chậm (地 + Động từ).' },
        ],
      },
    },
  });

  console.log('✅ Seeded Grammar points.');

  // 7. Listening Materials
  await prisma.listeningMaterial.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Hội thoại 1: Làm quen và chào hỏi tại trường học',
      description: 'Bài nghe ngắn giúp rèn luyện khả năng nhận diện các câu chào hỏi căn bản giữa hai bạn sinh viên.',
      transcript: 'A: 你好！你叫什么名字？\nB: 你好！我叫李明。你呢？\nA: 我叫王芳。很高兴认识你。\nB: 我也很高兴认识你。',
      pinyin: 'A: Nǐ hǎo! Nǐ jiào shénme míngzì?\nB: Nǐ hǎo! Wǒ jiào Lǐ Míng. Nǐ ne?\nA: Wǒ jiào Wáng Fāng. Hěn gāoxìng rènshí nǐ.\nB: Wǒ yě hěn gāoxìng rènshí nǐ.',
      translationVi: 'A: Xin chào! Bạn tên là gì?\nB: Chào bạn! Tôi tên là Lý Minh. Còn bạn?\nA: Tôi tên là Vương Phương. Rất vui được biết bạn.\nB: Tôi cũng rất vui được biết bạn.',
      duration: 35,
      questions: [
        {
          id: 'q1',
          question: 'Người nói B tên là gì?',
          options: ['Vương Phương', 'Lý Minh', 'Trương Vĩ', 'Lưu Cường'],
          correctAnswer: 'Lý Minh',
          explanation: 'Trong hội thoại B nói rõ: "我叫李明" (Tôi tên là Lý Minh).'
        },
        {
          id: 'q2',
          question: 'Hai người trong đoạn hội thoại cảm thấy như thế nào khi gặp nhau?',
          options: ['Rất vui mừng', 'Bình thường', 'Buồn bã', 'Lo lắng'],
          correctAnswer: 'Rất vui mừng',
          explanation: 'Họ nói "很高兴认识你" (Rất vui được làm quen với bạn).'
        }
      ]
    }
  });

  // 8. Reading Materials
  await prisma.readingMaterial.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Một ngày của Tiểu Minh (小明的一天)',
      topic: 'Cuộc sống sinh viên',
      estimatedMinutes: 3,
      contentChinese: '小明是一个大学生。他每天早上七点起床，七点半吃早饭。八点，他去学校上课。小明很喜欢学汉语，他的汉语老师是王老师。下午，他和朋友一起去图书馆看书。晚上，他做作业，十一点睡觉。他觉得每天都很充实。',
      contentPinyin: 'Xiǎomíng shì yí gè dàxuéshēng. Tā měitiān zǎoshang qī diǎn qǐchuáng, qī diǎn bàn chī zǎofàn. Bā diǎn, tā qù xuéxiào shàngkè. Xiǎomíng hěn xǐhuan xué hànyǔ, tā de hànyǔ lǎoshī shì Wáng lǎoshī. Xiàwǔ, tā hé péngyou yìqǐ qù túshūguǎn kànshū. Wǎnshang, tā zuò zuòyè, shíyī diǎn shuìjiào. Tā juéde měitiān dōu hěn chōngshí.',
      contentVi: 'Tiểu Minh là một sinh viên đại học. Mỗi buổi sáng cậu ấy thức dậy lúc 7 giờ, 7 giờ rưỡi ăn sáng. 8 giờ, cậu đến trường vào lớp học. Tiểu Minh rất thích học tiếng Hán, giáo viên tiếng Hán của cậu là thầy Vương. Buổi chiều, cậu cùng bạn bè đến thư viện đọc sách. Buổi tối, cậu làm bài tập, 11 giờ đi ngủ. Cậu cảm thấy mỗi ngày đều rất trọn vẹn.',
      questions: [
        {
          id: 'rq1',
          question: 'Tiểu Minh ăn sáng lúc mấy giờ?',
          options: ['7:00', '7:30', '8:00', '8:30'],
          correctAnswer: '7:30',
          explanation: 'Trong bài có câu: "七点半吃早饭" (7 rưỡi ăn sáng).'
        },
        {
          id: 'rq2',
          question: 'Buổi chiều Tiểu Minh đi đâu cùng bạn bè?',
          options: ['Đi siêu thị', 'Đến thư viện', 'Đi tập thể thao', 'Về ký túc xá'],
          correctAnswer: 'Đến thư viện',
          explanation: 'Trong bài viết: "下午，他和朋友一起去图书馆看书".'
        }
      ]
    }
  });

  // 9. Speaking Scenarios
  await prisma.speakingScenario.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Gọi món tại nhà hàng Trung Hoa (点餐)',
      description: 'Bạn đang ở một quán ăn tại Bắc Kinh. Hãy tương tác với người phục vụ để gọi món, hỏi giá và thanh toán hóa đơn.',
      roleAi: 'Người phục vụ quán ăn (服务员)',
      roleUser: 'Khách hàng (顾客)',
      initialPrompt: '您好！欢迎光临！请问几位？想吃点儿什么？(Xin chào! Hoan nghênh quý khách! Xin hỏi mấy người? Muốn dùng món gì ạ?)',
      systemPrompt: 'Bạn là người phục vụ quán ăn thân thiện tại Trung Quốc tên là Xiao Mei. Nói chuyện bằng tiếng Trung chuẩn HSK 1-2, câu ngắn, rõ ràng, có kèm Pinyin và dịch nghĩa tiếng Việt. Chú ý sửa lỗi nếu người học nói sai ngữ pháp.'
    }
  });

  await prisma.speakingScenario.create({
    data: {
      hskLevel: 'HSK2',
      title: 'Hỏi đường ở sân bay Thượng Hải (问路)',
      description: 'Bạn vừa đáp chuyến bay đến Thượng Hải và cần tìm ga tàu điện ngầm hoặc bến xe buýt về trung tâm thành phố.',
      roleAi: 'Nhân viên hướng dẫn sân bay (工作人员)',
      roleUser: 'Hành khách (旅客)',
      initialPrompt: '您好，请问有什么可以帮您的？您要去哪里？(Xin chào, tôi có thể giúp gì cho bạn? Bạn muốn đi đâu?)',
      systemPrompt: 'Bạn là nhân viên lễ tân sân bay Pudong Thượng Hải. Hướng dẫn hành khách đi tàu điện ngầm tuyến 2 hoặc tàu đệm từ Maglev. Ngữ điệu lịch sự, tiếng Trung HSK 2-3.'
    }
  });

  // 10. Writing Exercises (Hanzi Strokes)
  const writingList = [
    {
      character: '中',
      pinyin: 'zhōng',
      meaningVi: 'Trung (ở giữa, trung tâm, nước Trung Quốc)',
      strokeCount: 4,
      radical: '丨 (Sổ)',
      strokeData: {
        strokes: ['丨 (sổ đứng)', '𠃍 (ngang gập)', '一 (ngang)', '丨 (sổ thẳng giữa)'],
        rule: 'Quy tắc: Ngoài trước trong sau, sổ dọc cuối cùng xuyên giữa.'
      }
    },
    {
      character: '国',
      pinyin: 'guó',
      meaningVi: 'Quốc (đất nước, quốc gia)',
      strokeCount: 8,
      radical: '囗 (Vi bao quanh)',
      strokeData: {
        strokes: ['丨 (sổ trái)', '𠃍 (ngang gập)', '一 (ngang trong)', '一 (ngang ngắn)', '丨 (sổ đứng)', '一 (ngang đáy chữ ngọc)', '丶 (chấm ngọc)', '一 (ngang đóng đáy khung)'],
        rule: 'Quy tắc: Vào trước đóng sau (viết các nét bên trong chữ 玉 trước rồi mới đóng nét ngang dưới của bộ 囗).'
      }
    },
    {
      character: '好',
      pinyin: 'hǎo',
      meaningVi: 'Hảo (tốt, đẹp, hay, thân ái)',
      strokeCount: 6,
      radical: '女 (Nữ)',
      strokeData: {
        strokes: ['ㄑ (phẩy gập)', 'ノ (phẩy)', '一 (ngang chữ nữ)', '㇇ (ngang gập cong móc)', '亅 (sổ móc)', '一 (ngang chữ tử)'],
        rule: 'Quy tắc: Trái trước phải sau (viết bộ Nữ bên trái trước rồi viết chữ Tử bên phải).'
      }
    }
  ];

  for (const w of writingList) {
    await prisma.writingExercise.create({ data: w });
  }

  // 11. Full HSK Mock Exam (HSK 1 Standard Exam)
  const exam = await prisma.exam.create({
    data: {
      hskLevel: 'HSK1',
      title: 'Đề Thi Mô Phỏng Chuẩn HSK 1 Số 01 (HSK 1 Mock Test 01)',
      durationMinutes: 35,
      totalQuestions: 6,
      passingScore: 60,
      isPublished: true,
      sections: {
        create: [
          {
            title: 'Phần 1: Nghe hiểu (Listening Comprehension)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  prompt: 'Nghe đoạn thoại sau và chọn câu trả lời đúng:\n"A: 明天是星期几？\nB: 明天是星期日。"',
                  options: ['Thứ 6', 'Thứ 7', 'Chủ nhật', 'Thứ 2'],
                  correctAnswer: 'Chủ nhật',
                  explanation: '星期日 (xīngqīrì) nghĩa là Chủ nhật.',
                  score: 10,
                },
                {
                  prompt: 'Nghe câu sau và xác định đúng hay sai:\n"我家里有四口人。"',
                  passage: 'Âm thanh: Wǒ jiā lǐ yǒu sì kǒu rén.',
                  options: ['Gia đình có 3 người', 'Gia đình có 4 người', 'Gia đình có 5 người', 'Gia đình có 6 người'],
                  correctAnswer: 'Gia đình có 4 người',
                  explanation: '四 (sì) là số 4, 四口人 là 4 nhân khẩu.',
                  score: 10,
                },
              ]
            }
          },
          {
            title: 'Phần 2: Đọc hiểu (Reading Comprehension)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  prompt: 'Chọn chữ Hán tương ứng với Pinyin "xuéxiào" (Trường học):',
                  options: ['医院', '学校', '饭店', '商店'],
                  correctAnswer: '学校',
                  explanation: '学校 (xuéxiào) = Trường học. 医院 = Bệnh viện; 饭店 = Nhà hàng; 商店 = Cửa hàng.',
                  score: 10,
                },
                {
                  prompt: 'Điền từ còn thiếu vào chỗ trống: "桌子上有两个____。"',
                  options: ['只', '位', '个', '杯子'],
                  correctAnswer: '杯子',
                  explanation: 'Trước đó đã có lượng từ "个", sau "两个" cần danh từ "杯子" (cái cốc).',
                  score: 10,
                },
                {
                  prompt: 'Đọc câu: "今天天气很好，不太冷。" Hỏi thời tiết hôm nay thế nào?',
                  options: ['Rất lạnh', 'Thời tiết đẹp, không lạnh lắm', 'Đang mưa to', 'Nhiệt độ rất cao'],
                  correctAnswer: 'Thời tiết đẹp, không lạnh lắm',
                  explanation: '天气很好 (thời tiết rất đẹp), 不太冷 (không lạnh lắm).',
                  score: 10,
                },
                {
                  prompt: 'Từ nào đồng nghĩa với "再见"?',
                  options: ['明天见', '对不起', '没关系', '不用谢'],
                  correctAnswer: '明天见',
                  explanation: '明天见 (Ngày mai gặp lại) là lời chào tạm biệt tương đồng với 再见.',
                  score: 10,
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✅ Seeded Mock Exam ID: ${exam.id}`);
  console.log('🎉 Seeding successfully completed on MySQL Port 3307!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

