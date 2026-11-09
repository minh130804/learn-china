const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📝 Seeding Authentic Official HSK Exam Papers...');

  // Delete previous test data
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();

  // ==========================================
  // EXAM 1: HSK 1 CHUẨN QUỐC TẾ (CODE: H11001)
  // ==========================================
  const hsk1Exam = await prisma.exam.create({
    data: {
      code: 'H11001',
      hskLevel: 'HSK1',
      title: '新汉语水平考试 HSK（一级）真题模考卷 H11001',
      durationMinutes: 35,
      totalQuestions: 40,
      totalScore: 200,
      passingScore: 120,
      isPublished: true,
      sections: {
        create: [
          // ----------------------------------------
          // PHẦN 1: NGHE HIỂU (听力) - 20 CÂU (100 ĐIỂM)
          // ----------------------------------------
          {
            title: '一、听力 (Phần 1: Nghe hiểu - 100 điểm)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                // Part 1: Câu 1-5 (Phán đoán Đúng / Sai)
                {
                  questionNumber: 1,
                  questionType: 'TRUE_FALSE',
                  prompt: '看书 (kàn shū)',
                  pinyin: 'kàn shū',
                  passage: 'Đoạn băng đọc: "看书 (kàn shū)" — Nghĩa đề thi cho: Đọc sách',
                  audioScript: '看书',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Âm thanh đọc "看书" (kàn shū) hoàn toàn trùng khớp với cụm từ "Đọc sách" trong đề.',
                  score: 5,
                },
                {
                  questionNumber: 2,
                  questionType: 'TRUE_FALSE',
                  prompt: '吃米饭 (chī mǐfàn)',
                  pinyin: 'chī mǐfàn',
                  passage: 'Đoạn băng đọc: "喝茶 (hē chá)" — Nghĩa đề thi cho: Ăn cơm (吃米饭)',
                  audioScript: '喝茶',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: 'Âm thanh đọc là "喝茶" (Uống trà), nhưng đề thi lại cho "吃米饭" (Ăn cơm) nên phán đoán là SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 3,
                  questionType: 'TRUE_FALSE',
                  prompt: '坐飞机 (zuò fēijī)',
                  pinyin: 'zuò fēijī',
                  passage: 'Đoạn băng đọc: "坐飞机 (zuò fēijī)" — Nghĩa đề thi cho: Đi máy bay',
                  audioScript: '坐飞机',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Âm thanh đọc "坐飞机" trùng khớp với nghĩa đi máy bay.',
                  score: 5,
                },
                {
                  questionNumber: 4,
                  questionType: 'TRUE_FALSE',
                  prompt: '五个人 (wǔ gè rén)',
                  pinyin: 'wǔ gè rén',
                  passage: 'Đoạn băng đọc: "三个人 (sān gè rén)" — Nghĩa đề thi cho: 5 người (五个人)',
                  audioScript: '三个人',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: 'Băng phát âm "三个人" (3 người), đề bài ghi "五个人" (5 người) -> SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 5,
                  questionType: 'TRUE_FALSE',
                  prompt: '打电话 (dǎ diànhuà)',
                  pinyin: 'dǎ diànhuà',
                  passage: 'Đoạn băng đọc: "打电话 (dǎ diànhuà)" — Nghĩa đề thi cho: Gọi điện thoại',
                  audioScript: '打电话',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Âm thanh đọc đúng cụm "打电话" (Gọi điện thoại).',
                  score: 5,
                },

                // Part 2: Câu 6-10 (Chọn đáp án A, B, C)
                {
                  questionNumber: 6,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '他在医院工作。问：他在哪儿工作？',
                  pinyin: 'Tā zài yīyuàn gōngzuò. Wèn: Tā zài nǎr gōngzuò?',
                  passage: 'Băng đọc: "他在医院工作。(Tā zài yīyuàn gōngzuò.)"',
                  audioScript: '他在医院工作。',
                  options: ['A. 医院 (yīyuàn)', 'B. 学校 (xuéxiào)', 'C. 饭馆 (fànguǎn)'],
                  correctAnswer: 'A. 医院 (yīyuàn)',
                  explanation: 'Trong câu băng nói rõ: "在医院工作" (làm việc ở bệnh viện).',
                  score: 5,
                },
                {
                  questionNumber: 7,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '今天星期五，明天是星期六。问：明天是星期几？',
                  pinyin: 'Jīntiān xīngqīwǔ, míngtiān shì xīngqīliù. Wèn: Míngtiān shì xīngqī jǐ?',
                  passage: 'Băng đọc: "今天星期五，明天是星期六。"',
                  audioScript: '今天星期五，明天是星期六。',
                  options: ['A. 星期四 (xīngqīsì)', 'B. 星期五 (xīngqīwǔ)', 'C. 星期六 (xīngqīliù)'],
                  correctAnswer: 'C. 星期六 (xīngqīliù)',
                  explanation: 'Đoạn băng nêu rõ: "明天是星期六" (Ngày mai là thứ Bảy).',
                  score: 5,
                },
                {
                  questionNumber: 8,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '桌子上有两个苹果。问：桌子上有什么？',
                  pinyin: 'Zhuōzi shang yǒu liǎng gè píngguǒ. Wèn: Zhuōzi shang yǒu shénme?',
                  passage: 'Băng đọc: "桌子上有两个苹果。"',
                  audioScript: '桌子上有两个苹果。',
                  options: ['A. 两个苹果 (liǎng gè píngguǒ)', 'B. 三本书 (sān běn shū)', 'C. 一个杯子 (yí gè bēizi)'],
                  correctAnswer: 'A. 两个苹果 (liǎng gè píngguǒ)',
                  explanation: 'Băng đọc "两个苹果" (2 quả táo).',
                  score: 5,
                },
                {
                  questionNumber: 9,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '外面下雨了，不要出去了。问：现在天气怎么样？',
                  pinyin: 'Wàimiàn xià yǔ le, bú yào chūqù le. Wèn: Xiànzài tiānqì zěnmeyàng?',
                  passage: 'Băng đọc: "外面下雨了，不要出去了。"',
                  audioScript: '外面下雨了，不要出去了。',
                  options: ['A. 很热 (hěn rè)', 'B. 下雨 (xià yǔ)', 'C. 晴天 (qíngtiān)'],
                  correctAnswer: 'B. 下雨 (xià yǔ)',
                  explanation: '"外面下雨了" nghĩa là ngoài trời đang đổ mưa.',
                  score: 5,
                },
                {
                  questionNumber: 10,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我有三个中国朋友。问：他有几个中国朋友？',
                  pinyin: 'Wǒ yǒu sān gè Zhōngguó péngyou. Wèn: Tā yǒu jǐ gè Zhōngguó péngyou?',
                  passage: 'Băng đọc: "我有三个中国朋友。"',
                  audioScript: '我有三个中国朋友。',
                  options: ['A. 一个 (yí gè)', 'B. 两个 (liǎng gè)', 'C. 三个 (sān gè)'],
                  correctAnswer: 'C. 三个 (sān gè)',
                  explanation: 'Số lượng là "三个" (3 người).',
                  score: 5,
                },

                // Part 3: Câu 11-15 (Nghe đối thoại ngắn A / B)
                {
                  questionNumber: 11,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：你想喝点儿什么？\n女：我想喝茶，谢谢。\n问：女的想喝什么？',
                  pinyin: 'Nán: Nǐ xiǎng hē diǎnr shénme? Nǚ: Wǒ xiǎng hē chá, xièxie. Wèn: Nǚ de xiǎng hē shénme?',
                  passage: 'Băng đọc hội thoại hai người.',
                  audioScript: '男：你想喝点儿什么？女：我想喝茶，谢谢。',
                  options: ['A. 茶 (chá)', 'B. 水 (shuǐ)', 'C. 牛奶 (niúnǎi)'],
                  correctAnswer: 'A. 茶 (chá)',
                  explanation: 'Người nữ trả lời: "我想喝茶" (Tôi muốn uống trà).',
                  score: 5,
                },
                {
                  questionNumber: 12,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：你什么时候去北京？\n女：下个星期一。\n问：女的什么时候去北京？',
                  pinyin: 'Nán: Nǐ shénme shíhou qù Běijīng? Nǚ: Xià gè xīngqīyī. Wèn: Nǚ de shénme shíhou qù Běijīng?',
                  passage: 'Băng đọc đối thoại.',
                  audioScript: '男：你什么时候去北京？女：下个星期一。',
                  options: ['A. 明天 (míngtiān)', 'B. 下个星期一 (xià gè xīngqīyī)', 'C. 下个月 (xià gè yuè)'],
                  correctAnswer: 'B. 下个星期一 (xià gè xīngqīyī)',
                  explanation: 'Thời gian nêu ra là "下个星期一" (Thứ 2 tuần tới).',
                  score: 5,
                },
                {
                  questionNumber: 13,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：这些衣服多少钱？\n男：一共一百块。\n问：衣服一共多少钱？',
                  pinyin: 'Nǚ: Zhèxiē yīfu duōshao qián? Nán: Yígòng yìbǎi kuài. Wèn: Yīfu yígòng duōshao qián?',
                  passage: 'Băng đọc đối thoại hỏi giá tiền.',
                  audioScript: '女：这些衣服多少钱？男：一共一百块。',
                  options: ['A. 10块 (shí kuài)', 'B. 50块 (wǔshí kuài)', 'C. 100块 (yìbǎi kuài)'],
                  correctAnswer: 'C. 100块 (yìbǎi kuài)',
                  explanation: 'Giá tiền là "一共一百块" (Tổng cộng 100 tệ).',
                  score: 5,
                },
                {
                  questionNumber: 14,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：喂，李老师在吗？\n男：他不在，他在学校上课呢。\n问：李老师在哪儿？',
                  pinyin: 'Nǚ: Wèi, Lǐ lǎoshī zài ma? Nán: Tā búzài, tā zài xuéxiào shàngkè ne. Wèn: Lǐ lǎoshī zài nǎr?',
                  passage: 'Băng đọc đối thoại gọi điện.',
                  audioScript: '女：喂，李老师在吗？男：他不在，他在学校上课呢。',
                  options: ['A. 家里 (jiālǐ)', 'B. 学校 (xuéxiào)', 'C. 医院 (yīyuàn)'],
                  correctAnswer: 'B. 学校 (xuéxiào)',
                  explanation: 'Thầy Lý "在学校上课" (đang dạy học ở trường).',
                  score: 5,
                },
                {
                  questionNumber: 15,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：这个汉字怎么读？\n女：对不起，我也不认识。\n问：关于这个汉字，女的怎么样？',
                  pinyin: 'Nán: Zhè ge hànzì zěnme dú? Nǚ: Duìbuqǐ, wǒ yě bú rènshí. Wèn: Guānyú zhè ge hànzì, nǚ de zěnmeyàng?',
                  passage: 'Băng đọc đối thoại học chữ Hán.',
                  audioScript: '男：这个汉字怎么读？女：对不起，我也不认识。',
                  options: ['A. 会写 (huì xiě)', 'B. 会读 (huì dú)', 'C. 不认识 (bú rènshí)'],
                  correctAnswer: 'C. 不认识 (bú rènshí)',
                  explanation: 'Người nữ nói "我也不认识" (tôi cũng không nhận biết chữ này).',
                  score: 5,
                },

                // Part 4: Câu 16-20 (Nghe trần thuật trả lời câu hỏi)
                {
                  questionNumber: 16,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '她是我女儿，今年八岁了。问：女儿几岁？',
                  pinyin: 'Tā shì wǒ nǚér, jīnnián bā suì le. Wèn: Nǚér jǐ suì?',
                  passage: 'Băng đọc câu trần thuật.',
                  audioScript: '她是我女儿，今年八岁了。',
                  options: ['A. 6岁 (liù suì)', 'B. 8岁 (bā suì)', 'C. 10岁 (shí suì)'],
                  correctAnswer: 'B. 8岁 (bā suì)',
                  explanation: '"八岁" là 8 tuổi.',
                  score: 5,
                },
                {
                  questionNumber: 17,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我上午去商场买了衣服，下午在家看电视。问：他下午做什么了？',
                  pinyin: 'Wǒ shàngwǔ qù shāngchǎng mǎi le yīfu, xiàwǔ zài jiā kàn diànshì. Wèn: Tā xiàwǔ zuò shénme le?',
                  passage: 'Băng đọc kể hoạt động trong ngày.',
                  audioScript: '我上午去商场买了衣服，下午在家看电视。',
                  options: ['A. 买衣服 (mǎi yīfu)', 'B. 去商场 (qù shāngchǎng)', 'C. 看电视 (kàn diànshì)'],
                  correctAnswer: 'C. 看电视 (kàn diànshì)',
                  explanation: 'Buổi chiều (下午) cậu ấy "在家看电视" (xem tivi ở nhà).',
                  score: 5,
                },
                {
                  questionNumber: 18,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '那家饭馆的中国菜非常好吃，也很便宜。问：那家饭馆的菜怎么样？',
                  pinyin: 'Nà jiā fànguǎn de Zhōngguó cài fēicháng hǎochī, yě hěn piányi. Wèn: Nà jiā fànguǎn de cài zěnmeyàng?',
                  passage: 'Băng đọc nhận xét món ăn.',
                  audioScript: '那家饭馆的中国菜非常好吃，也很便宜。',
                  options: ['A. 很贵 (hěn guì)', 'B. 不好吃 (bù hǎochī)', 'C. 很好吃 (hěn hǎochī)'],
                  correctAnswer: 'C. 很好吃 (hěn hǎochī)',
                  explanation: 'Món ăn "非常好吃" (rất ngon).',
                  score: 5,
                },
                {
                  questionNumber: 19,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我们八点开会，现在已经七点五十了。问：离会议还有几分钟？',
                  pinyin: 'Wǒmen bā diǎn kāihuì, xiànzài yǐjīng qī diǎn wǔshí le. Wèn: Lí huìyì hái yǒu jǐ fēnzhōng?',
                  passage: 'Băng đọc thời gian họp.',
                  audioScript: '我们八点开会，现在已经七点五十了。',
                  options: ['A. 10分钟 (shí fēnzhōng)', 'B. 20分钟 (èrshí fēnzhōng)', 'C. 30分钟 (sānshí fēnzhōng)'],
                  correctAnswer: 'A. 10分钟 (shí fēnzhōng)',
                  explanation: 'Từ 7h50 đến 8h00 là còn 10 phút (10分钟).',
                  score: 5,
                },
                {
                  questionNumber: 20,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '大卫在学汉语，他说汉语说得很好。问：大卫在学什么？',
                  pinyin: 'Dàwèi zài xué hànyǔ, tā shuō hànyǔ shuō de hěn hǎo. Wèn: Dàwèi zài xué shénme?',
                  passage: 'Băng đọc về học tập.',
                  audioScript: '大卫在学汉语，他说汉语说得很好。',
                  options: ['A. 英语 (Yīngyǔ)', 'B. 汉语 (Hànyǔ)', 'C. 电脑 (diànnǎo)'],
                  correctAnswer: 'B. 汉语 (Hànyǔ)',
                  explanation: 'David đang học "汉语" (tiếng Hán).',
                  score: 5,
                },
              ]
            }
          },

          // ----------------------------------------
          // PHẦN 2: ĐỌC HIỂU (阅读) - 20 CÂU (100 ĐIỂM)
          // ----------------------------------------
          {
            title: '二、阅读 (Phần 2: Đọc hiểu - 100 điểm)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                // Part 1: Câu 21-25 (Phán đoán Đúng / Sai giữa chữ và nghĩa)
                {
                  questionNumber: 21,
                  questionType: 'TRUE_FALSE',
                  prompt: '米饭 (mǐfàn) —— [Cơm trắng]',
                  pinyin: 'mǐfàn',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '米饭 (mǐfàn) đúng là Cơm trắng.',
                  score: 5,
                },
                {
                  questionNumber: 22,
                  questionType: 'TRUE_FALSE',
                  prompt: '飞机 (fēijī) —— [Xe buýt công cộng]',
                  pinyin: 'fēijī',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: '飞机 (fēijī) là Máy bay. Xe buýt là 公共汽车 (gōnggòng qìchē) nên phán đoán là SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 23,
                  questionType: 'TRUE_FALSE',
                  prompt: '看书 (kàn shū) —— [Đọc sách]',
                  pinyin: 'kàn shū',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '看书 chính xác là Đọc sách.',
                  score: 5,
                },
                {
                  questionNumber: 24,
                  questionType: 'TRUE_FALSE',
                  prompt: '苹果 (píngguǒ) —— [Quả chuối]',
                  pinyin: 'píngguǒ',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: '苹果 (píngguǒ) là Quả táo, Quả chuối là 香蕉 (xiāngjiāo) -> SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 25,
                  questionType: 'TRUE_FALSE',
                  prompt: '打电话 (dǎ diànhuà) —— [Gọi điện thoại]',
                  pinyin: 'dǎ diànhuà',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '打电话 chính xác là Gọi điện thoại.',
                  score: 5,
                },

                // Part 2: Câu 26-30 (Nối câu / Chọn đáp án tương ứng)
                {
                  questionNumber: 26,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你叫什么名字？” 选择合适的回应：',
                  pinyin: 'Nǐ jiào shénme míngzì?',
                  options: ['A. 我叫王芳。(Wǒ jiào Wáng Fāng.)', 'B. 我很大。(Wǒ hěn dà.)', 'C. 很高兴。(Hěn gāoxìng.)'],
                  correctAnswer: 'A. 我叫王芳。(Wǒ jiào Wáng Fāng.)',
                  explanation: 'Hỏi tên dùng câu trả lời: 我叫... (Tôi tên là...).',
                  score: 5,
                },
                {
                  questionNumber: 27,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“今天天气冷不冷？” 选择合适的回应：',
                  pinyin: 'Jīntiān tiānqì lěng bu lěng?',
                  options: ['A. 今天不太冷，很舒服。', 'B. 我很喜欢喝水。', 'C. 他是学生。'],
                  correctAnswer: 'A. 今天不太冷，很舒服。',
                  explanation: 'Hỏi về thời tiết lạnh hay không, đáp án phù hợp là "不太冷" (không lạnh lắm).',
                  score: 5,
                },
                {
                  questionNumber: 28,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你什么时候回家？” 选择合适的回应：',
                  pinyin: 'Nǐ shénme shíhou huí jiā?',
                  options: ['A. 下午五点。(Xiàwǔ wǔ diǎn.)', 'B. 家里有人。(Jiālǐ yǒu rén.)', 'C. 在北京。(Zài Běijīng.)'],
                  correctAnswer: 'A. 下午五点。(Xiàwǔ wǔ diǎn.)',
                  explanation: 'Hỏi "什么时候" (khi nào) cần trả lời mốc thời gian "下午五点" (5 giờ chiều).',
                  score: 5,
                },
                {
                  questionNumber: 29,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你喜欢吃中国菜吗？” 选择合适的回应：',
                  pinyin: 'Nǐ xǐhuan chī Zhōngguó cài ma?',
                  options: ['A. 非常喜欢，很好吃。', 'B. 不是中国人。', 'C. 明天见。'],
                  correctAnswer: 'A. 非常喜欢，很好吃。',
                  explanation: 'Hỏi có thích món ăn Trung Quốc không -> Đáp án A.',
                  score: 5,
                },
                {
                  questionNumber: 30,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“那个人是谁？” 选择合适的回应：',
                  pinyin: 'Nà gè rén shì shéi?',
                  options: ['A. 他是我的大学老师。', 'B. 他去商店了。', 'C. 他二十岁。'],
                  correctAnswer: 'A. 他是我的大学老师。',
                  explanation: 'Hỏi "谁" (ai) trả lời về quan hệ thân phận: "他是我的大学老师".',
                  score: 5,
                },

                // Part 3: Câu 31-35 (Ghép câu hỏi - câu đáp)
                {
                  questionNumber: 31,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“他在哪儿工作？” 对应的回答是：',
                  pinyin: 'Tā zài nǎr gōngzuò?',
                  options: ['A. 他在医院当医生。', 'B. 他今年二十五岁。', 'C. 他喜欢看电影。'],
                  correctAnswer: 'A. 他在医院当医生。',
                  explanation: 'Hỏi nơi làm việc "在哪儿工作" trả lời địa điểm "在医院".',
                  score: 5,
                },
                {
                  questionNumber: 32,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“你看见我的小猫了吗？” 对应的回答是：',
                  pinyin: 'Nǐ kànjiàn wǒ de xiǎomāo le ma?',
                  options: ['A. 在椅子下面呢。(Zài yǐzi xiàmiàn ne.)', 'B. 小猫两岁了。', 'C. 我没有小狗。'],
                  correctAnswer: 'A. 在椅子下面呢。(Zài yǐzi xiàmiàn ne.)',
                  explanation: 'Hỏi vị trí của con mèo -> Trả lời "在椅子下面呢" (Ở dưới ghế ấy).',
                  score: 5,
                },
                {
                  questionNumber: 33,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“这台电脑多少钱？” 对应的回答是：',
                  pinyin: 'Zhè tái diànnǎo duōshao qián?',
                  options: ['A. 三千块钱。(Sānqiān kuài qián.)', 'B. 电脑很好用。', 'C. 这是我的电脑。'],
                  correctAnswer: 'A. 三千块钱。(Sānqiān kuài qián.)',
                  explanation: 'Hỏi giá tiền "多少钱" trả lời số tiền "三千块钱" (3.000 tệ).',
                  score: 5,
                },
                {
                  questionNumber: 34,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“你想吃米饭还是面条？” 对应的回答是：',
                  pinyin: 'Nǐ xiǎng chī mǐfàn háishì miàntiáo?',
                  options: ['A. 我想吃面条。(Wǒ xiǎng chī miàntiáo.)', 'B. 我吃了。', 'C. 不太好吃。'],
                  correctAnswer: 'A. 我想吃面条。(Wǒ xiǎng chī miàntiáo.)',
                  explanation: 'Câu hỏi lựa chọn "A 还是 B" trả lời chọn 1 trong 2: "我想吃面条".',
                  score: 5,
                },
                {
                  questionNumber: 35,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“我们怎么去学校？” 对应的回答是：',
                  pinyin: 'Wǒmen zěnme qù xuéxiào?',
                  options: ['A. 坐出租车去吧。(Zuò chūzūchē qù ba.)', 'B. 学校很大。', 'C. 明天去。'],
                  correctAnswer: 'A. 坐出租车去吧。(Zuò chūzūchē qù ba.)',
                  explanation: 'Hỏi phương thức đi lại "怎么去" trả lời "坐出租车去吧" (Đi taxi đi).',
                  score: 5,
                },

                // Part 4: Câu 36-40 (Điền từ vào chỗ trống - 选词填空)
                // Hộp từ vựng mẫu: A. 喜欢 (xǐhuan)  B. 多少 (duōshao)  C. 谢谢 (xièxie)  D. 怎么 (zěnme)  E. 明天 (míngtiān)
                {
                  questionNumber: 36,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：我很____学汉语，我觉得汉语很有意思。',
                  pinyin: 'Wǒ hěn ____ xué hànyǔ, wǒ juéde hànyǔ hěn yǒu yìsi.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'A. 喜欢 (xǐhuan)',
                  explanation: 'Cụm "很喜欢" (rất thích) phù hợp với ý "rất thú vị" phía sau.',
                  score: 5,
                },
                {
                  questionNumber: 37,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：请问这个杯子____钱？',
                  pinyin: 'Qǐngwèn zhè ge bēizi ____ qián?',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'B. 多少 (duōshao)',
                  explanation: 'Cấu trúc hỏi giá tiền: "多少钱" (Bao nhiêu tiền).',
                  score: 5,
                },
                {
                  questionNumber: 38,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：非常感谢你的帮助！—— 不客气，不用____。',
                  pinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù! —— Bú kèqi, bú yòng ____.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'C. 谢谢 (xièxie)',
                  explanation: 'Cụm đáp lại lời cảm ơn: "不用谢" (không cần cảm ơn).',
                  score: 5,
                },
                {
                  questionNumber: 39,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：这个汉字____读？你可以教我吗？',
                  pinyin: 'Zhè ge hànzì ____ dú? Nǐ kěyǐ jiāo wǒ ma?',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'D. 怎么 (zěnme)',
                  explanation: 'Cấu trúc "怎么 + Động từ": "怎么读" (đọc như thế nào).',
                  score: 5,
                },
                {
                  questionNumber: 40,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：今天星期日，____是星期一。',
                  pinyin: 'Jīntiān xīngqīrì, ____ shì xīngqīyī.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'E. 明天 (míngtiān)',
                  explanation: 'Hôm nay Chủ nhật, "明天" (ngày mai) là thứ Hai.',
                  score: 5,
                },
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✅ Seeded Standard HSK 1 Paper: ${hsk1Exam.code} with 40 authentic questions (200 pts).`);

  // ==========================================
  // EXAM 2: HSK 2 CHUẨN QUỐC TẾ (CODE: H21001)
  // ==========================================
  const hsk2Exam = await prisma.exam.create({
    data: {
      code: 'H21001',
      hskLevel: 'HSK2',
      title: '新汉语水平考试 HSK（二级）真题模考卷 H21001',
      durationMinutes: 50,
      totalQuestions: 10,
      totalScore: 200,
      passingScore: 120,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力 (Phần nghe HSK 2)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'TRUE_FALSE',
                  prompt: '哥哥在跑步。(Gēge zài pǎobù.)',
                  pinyin: 'Gēge zài pǎobù.',
                  passage: 'Băng đọc: "哥哥每天早上都去跑步。(Anh trai mỗi sáng đều đi chạy bộ.)"',
                  audioScript: '哥哥每天早上都去跑步。',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Khớp ý anh trai chạy bộ -> Đúng (对).',
                  score: 10,
                },
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：你看见我的手表了吗？\n男：在桌子上，电脑旁边。\n问：手表在哪儿？',
                  pinyin: 'Nǚ: Nǐ kànjiàn wǒ de shǒubiǎo le ma? Nán: Zài zhuōzi shang, diànnǎo pángbiān. Wèn: Shǒubiǎo zài nǎr?',
                  passage: 'Hội thoại hỏi đồng hồ.',
                  audioScript: '女：你看见我的手表了吗？男：在桌子上，电脑旁边。',
                  options: ['A. 桌子上 (zhuōzi shang)', 'B. 椅子下 (yǐzi xià)', 'C. 包里 (bāo lǐ)'],
                  correctAnswer: 'A. 桌子上 (zhuōzi shang)',
                  explanation: 'Đồng hồ ở "在桌子上" (trên bàn).',
                  score: 10,
                },
              ]
            }
          },
          {
            title: '二、阅读 (Phần đọc HSK 2)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 3,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '选词填空：虽然天气很冷，____他还是坚持去跑步。',
                  pinyin: 'Suīrán tiānqì hěn lěng, ____ tā háishì jiānchí qù pǎobù.',
                  options: ['A. 但是 (dànshì)', 'B. 因为 (yīnwèi)', 'C. 所以 (suǒyǐ)'],
                  correctAnswer: 'A. 但是 (dànshì)',
                  explanation: 'Cặp liên từ: 虽然...但是... (Tuy... nhưng...).',
                  score: 10,
                },
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✅ Seeded Standard HSK 2 Paper: ${hsk2Exam.code}.`);
  console.log('🎉 Seeding Authentic Standard HSK Form successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding standard HSK:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

