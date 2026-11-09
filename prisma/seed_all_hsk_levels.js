const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📝 Seeding Comprehensive Exams from HSK 1 to HSK 9...');

  // Clean previous exam data
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();

  // 1. HSK 1 (H11001) - 40 questions, 200 points
  await prisma.exam.create({
    data: {
      code: 'H11001',
      hskLevel: 'HSK1',
      title: '新汉语水平考试 HSK（一级）官方标准模考卷 H11001',
      durationMinutes: 35,
      totalQuestions: 40,
      totalScore: 200,
      passingScore: 120,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力 (Phần Nghe hiểu HSK 1 - 100 điểm)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'TRUE_FALSE',
                  prompt: '看书 (kàn shū)',
                  pinyin: 'kàn shū',
                  passage: 'Băng đọc: "看书 (kàn shū)" — Đề bài ghi: Đọc sách',
                  audioScript: '看书',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Âm thanh đọc "看书" (kàn shū) hoàn toàn khớp với cụm "Đọc sách".',
                  score: 5,
                },
                {
                  questionNumber: 2,
                  questionType: 'TRUE_FALSE',
                  prompt: '吃米饭 (chī mǐfàn)',
                  pinyin: 'chī mǐfàn',
                  passage: 'Băng đọc: "喝茶 (hē chá)" — Đề bài ghi: Ăn cơm (吃米饭)',
                  audioScript: '喝茶',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: 'Âm thanh phát "喝茶" (uống trà), đề cho "吃米饭" (ăn cơm) -> SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 3,
                  questionType: 'TRUE_FALSE',
                  prompt: '坐飞机 (zuò fēijī)',
                  pinyin: 'zuò fēijī',
                  passage: 'Băng đọc: "坐飞机 (zuò fēijī)" — Đề bài ghi: Đi máy bay',
                  audioScript: '坐飞机',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Trùng khớp đi máy bay -> ĐÚNG (对).',
                  score: 5,
                },
                {
                  questionNumber: 4,
                  questionType: 'TRUE_FALSE',
                  prompt: '五个人 (wǔ gè rén)',
                  pinyin: 'wǔ gè rén',
                  passage: 'Băng đọc: "三个人 (sān gè rén)" — Đề ghi: Năm người (5 người)',
                  audioScript: '三个人',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: 'Băng đọc 3 người, đề ghi 5 người -> SAI (错).',
                  score: 5,
                },
                {
                  questionNumber: 5,
                  questionType: 'TRUE_FALSE',
                  prompt: '打电话 (dǎ diànhuà)',
                  pinyin: 'dǎ diànhuà',
                  passage: 'Băng đọc: "打电话 (dǎ diànhuà)" — Đề ghi: Gọi điện thoại',
                  audioScript: '打电话',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Khớp nghĩa gọi điện thoại -> ĐÚNG (对).',
                  score: 5,
                },
                {
                  questionNumber: 6,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '他在医院工作。问：他在哪儿工作？',
                  pinyin: 'Tā zài yīyuàn gōngzuò. Wèn: Tā zài nǎr gōngzuò?',
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
                  audioScript: '今天星期五，明天是星期六。',
                  options: ['A. 星期四', 'B. 星期五', 'C. 星期六'],
                  correctAnswer: 'C. 星期六',
                  explanation: 'Ngày mai là thứ Bảy (星期六).',
                  score: 5,
                },
                {
                  questionNumber: 8,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '桌子上有两个苹果。问：桌子上有什么？',
                  pinyin: 'Zhuōzi shang yǒu liǎng gè píngguǒ. Wèn: Zhuōzi shang yǒu shénme?',
                  audioScript: '桌子上有两个苹果。',
                  options: ['A. 两个苹果', 'B. 三本书', 'C. 一个杯子'],
                  correctAnswer: 'A. 两个苹果',
                  explanation: 'Có 2 quả táo (两个苹果).',
                  score: 5,
                },
                {
                  questionNumber: 9,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '外面下雨了，不要出去了。问：现在天气怎么样？',
                  pinyin: 'Wàimiàn xià yǔ le, bú yào chūqù le. Wèn: Xiànzài tiānqì zěnmeyàng?',
                  audioScript: '外面下雨了，不要出去了。',
                  options: ['A. 很热', 'B. 下雨', 'C. 晴天'],
                  correctAnswer: 'B. 下雨',
                  explanation: 'Thời tiết đang mưa (下雨).',
                  score: 5,
                },
                {
                  questionNumber: 10,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我有三个中国朋友。问：他有几个中国朋友？',
                  pinyin: 'Wǒ yǒu sān gè Zhōngguó péngyou. Wèn: Tā yǒu jǐ gè Zhōngguó péngyou?',
                  audioScript: '我有三个中国朋友。',
                  options: ['A. 一个', 'B. 两个', 'C. 三个'],
                  correctAnswer: 'C. 三个',
                  explanation: 'Có 3 người bạn (三个).',
                  score: 5,
                },
                {
                  questionNumber: 11,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：你想喝点儿什么？\n女：我想喝茶，谢谢。\n问：女的想喝什么？',
                  pinyin: 'Nán: Nǐ xiǎng hē diǎnr shénme? Nǚ: Wǒ xiǎng hē chá, xièxie. Wèn: Nǚ de xiǎng hē shénme?',
                  audioScript: '男：你想喝点儿什么？女：我想喝茶，谢谢。',
                  options: ['A. 茶', 'B. 水', 'C. 牛奶'],
                  correctAnswer: 'A. 茶',
                  explanation: 'Nữ nói: "我想喝茶" (Tôi muốn uống trà).',
                  score: 5,
                },
                {
                  questionNumber: 12,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：你什么时候去北京？\n女：下个星期一。\n问：女的什么时候去北京？',
                  pinyin: 'Nán: Nǐ shénme shíhou qù Běijīng? Nǚ: Xià gè xīngqīyī.',
                  audioScript: '男：你什么时候去北京？女：下个星期一。',
                  options: ['A. 明天', 'B. 下个星期一', 'C. 下个月'],
                  correctAnswer: 'B. 下个星期一',
                  explanation: 'Thứ Hai tuần tới (下个星期一).',
                  score: 5,
                },
                {
                  questionNumber: 13,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：这些衣服多少钱？\n男：一共一百块。\n问：衣服一共多少钱？',
                  pinyin: 'Nǚ: Zhèxiē yīfu duōshao qián? Nán: Yígòng yìbǎi kuài.',
                  audioScript: '女：这些衣服多少钱？男：一共一百块。',
                  options: ['A. 10块', 'B. 50块', 'C. 100块'],
                  correctAnswer: 'C. 100块',
                  explanation: '100 tệ (一百块).',
                  score: 5,
                },
                {
                  questionNumber: 14,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：喂，李老师在吗？\n男：他不在，他在学校上课呢。\n问：李老师在哪儿？',
                  pinyin: 'Nǚ: Wèi, Lǐ lǎoshī zài ma? Nán: Tā búzài, tā zài xuéxiào shàngkè ne.',
                  audioScript: '女：喂，李老师在吗？男：他不在，他在学校上课呢。',
                  options: ['A. 家里', 'B. 学校', 'C. 医院'],
                  correctAnswer: 'B. 学校',
                  explanation: 'Ở trường học (学校).',
                  score: 5,
                },
                {
                  questionNumber: 15,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：这个汉字怎么读？\n女：对不起，我也不认识。\n问：关于这个汉字，女的怎么样？',
                  pinyin: 'Nán: Zhè ge hànzì zěnme dú? Nǚ: Duìbuqǐ, wǒ yě bú rènshí.',
                  audioScript: '男：这个汉字怎么读？女：对不起，我也不认识。',
                  options: ['A. 会写', 'B. 会读', 'C. 不认识'],
                  correctAnswer: 'C. 不认识',
                  explanation: 'Không nhận biết (不认识).',
                  score: 5,
                },
                {
                  questionNumber: 16,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '她是我女儿，今年八岁了。问：女儿几岁？',
                  pinyin: 'Tā shì wǒ nǚér, jīnnián bā suì le. Wèn: Nǚér jǐ suì?',
                  audioScript: '她是我女儿，今年八岁了。',
                  options: ['A. 6岁', 'B. 8岁', 'C. 10岁'],
                  correctAnswer: 'B. 8岁',
                  explanation: '8 tuổi (八岁).',
                  score: 5,
                },
                {
                  questionNumber: 17,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我上午去商场买了衣服，下午在家看电视。问：他下午做什么了？',
                  pinyin: 'Wǒ shàngwǔ qù shāngchǎng mǎi le yīfu, xiàwǔ zài jiā kàn diànshì.',
                  audioScript: '我上午去商场买了衣服，下午在家看电视。',
                  options: ['A. 买衣服', 'B. 去商场', 'C. 看电视'],
                  correctAnswer: 'C. 看电视',
                  explanation: 'Xem tivi (看电视).',
                  score: 5,
                },
                {
                  questionNumber: 18,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '那家饭馆的中国菜非常好吃，也很便宜。问：那家饭馆的菜怎么样？',
                  pinyin: 'Nà jiā fànguǎn de Zhōngguó cài fēicháng hǎochī, yě hěn piányi.',
                  audioScript: '那家饭馆的中国菜非常好吃，也很便宜。',
                  options: ['A. 很贵', 'B. 不好吃', 'C. 很好吃'],
                  correctAnswer: 'C. 很好吃',
                  explanation: 'Rất ngon (很好吃).',
                  score: 5,
                },
                {
                  questionNumber: 19,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我们八点开会，现在已经七点五十了。问：离会议还有几分钟？',
                  pinyin: 'Wǒmen bā diǎn kāihuì, xiànzài yǐjīng qī diǎn wǔshí le.',
                  audioScript: '我们八点开会，现在已经七点五十了。',
                  options: ['A. 10分钟', 'B. 20分钟', 'C. 30分钟'],
                  correctAnswer: 'A. 10分钟',
                  explanation: 'Còn 10 phút (10分钟).',
                  score: 5,
                },
                {
                  questionNumber: 20,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '大卫在学汉语，他说汉语说得很好。问：大卫在学什么？',
                  pinyin: 'Dàwèi zài xué hànyǔ, tā shuō hànyǔ shuō de hěn hǎo.',
                  audioScript: '大卫在学汉语，他说汉语说得很好。',
                  options: ['A. 英语', 'B. 汉语', 'C. 电脑'],
                  correctAnswer: 'B. 汉语',
                  explanation: 'Đang học tiếng Trung (汉语).',
                  score: 5,
                },
              ],
            },
          },
          {
            title: '二、阅读 (Phần Đọc hiểu HSK 1 - 100 điểm)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 21,
                  questionType: 'TRUE_FALSE',
                  prompt: '米饭 (mǐfàn) —— [Cơm trắng]',
                  pinyin: 'mǐfàn',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '米饭 là Cơm trắng.',
                  score: 5,
                },
                {
                  questionNumber: 22,
                  questionType: 'TRUE_FALSE',
                  prompt: '飞机 (fēijī) —— [Xe buýt công cộng]',
                  pinyin: 'fēijī',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: '飞机 là Máy bay.',
                  score: 5,
                },
                {
                  questionNumber: 23,
                  questionType: 'TRUE_FALSE',
                  prompt: '看书 (kàn shū) —— [Đọc sách]',
                  pinyin: 'kàn shū',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '看书 là Đọc sách.',
                  score: 5,
                },
                {
                  questionNumber: 24,
                  questionType: 'TRUE_FALSE',
                  prompt: '苹果 (píngguǒ) —— [Quả chuối]',
                  pinyin: 'píngguǒ',
                  options: ['对', '错'],
                  correctAnswer: '错',
                  explanation: '苹果 là Quả táo.',
                  score: 5,
                },
                {
                  questionNumber: 25,
                  questionType: 'TRUE_FALSE',
                  prompt: '打电话 (dǎ diànhuà) —— [Gọi điện thoại]',
                  pinyin: 'dǎ diànhuà',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: '打电话 là Gọi điện.',
                  score: 5,
                },
                {
                  questionNumber: 26,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你叫什么名字？” 选择合适的回应：',
                  pinyin: 'Nǐ jiào shénme míngzì?',
                  options: ['A. 我叫王芳。', 'B. 我很大。', 'C. 很高兴。'],
                  correctAnswer: 'A. 我叫王芳。',
                  explanation: 'Trả lời tên: 我叫...',
                  score: 5,
                },
                {
                  questionNumber: 27,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“今天天气冷不冷？” 选择合适的回应：',
                  pinyin: 'Jīntiān tiānqì lěng bu lěng?',
                  options: ['A. 今天不太冷，很舒服。', 'B. 我很喜欢喝水。', 'C. 他是学生。'],
                  correctAnswer: 'A. 今天不太冷，很舒服。',
                  explanation: 'Thời tiết không lạnh lắm (不太冷).',
                  score: 5,
                },
                {
                  questionNumber: 28,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你什么时候回家？” 选择合适的回应：',
                  pinyin: 'Nǐ shénme shíhou huí jiā?',
                  options: ['A. 下午五点。', 'B. 家里有人。', 'C. 在北京。'],
                  correctAnswer: 'A. 下午五点。',
                  explanation: '5 giờ chiều (下午五点).',
                  score: 5,
                },
                {
                  questionNumber: 29,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“你喜欢吃中国菜吗？” 选择合适的回应：',
                  pinyin: 'Nǐ xǐhuan chī Zhōngguó cài ma?',
                  options: ['A. 非常喜欢，很好吃。', 'B. 不是中国人。', 'C. 明天见。'],
                  correctAnswer: 'A. 非常喜欢，很好吃。',
                  explanation: 'Rất thích (非常喜欢).',
                  score: 5,
                },
                {
                  questionNumber: 30,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '问句：“那个人是谁？” 选择合适的回应：',
                  pinyin: 'Nà gè rén shì shéi?',
                  options: ['A. 他是我的大学老师。', 'B. 他去商店了。', 'C. 他二十岁。'],
                  correctAnswer: 'A. 他是我的大学老师。',
                  explanation: 'Là giáo viên đại học của tôi (他是我的大学老师).',
                  score: 5,
                },
                {
                  questionNumber: 31,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“他在哪儿工作？” 对应的回答是：',
                  pinyin: 'Tā zài nǎr gōngzuò?',
                  options: ['A. 他在医院当医生。', 'B. 他今年二十五岁。', 'C. 他喜欢看电影。'],
                  correctAnswer: 'A. 他在医院当医生。',
                  explanation: 'Làm việc ở bệnh viện (在医院).',
                  score: 5,
                },
                {
                  questionNumber: 32,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“你看见我的小猫了吗？” 对应的回答是：',
                  pinyin: 'Nǐ kànjiàn wǒ de xiǎomāo le ma?',
                  options: ['A. 在椅子下面呢。', 'B. 小猫两岁了。', 'C. 我没有小狗。'],
                  correctAnswer: 'A. 在椅子下面呢。',
                  explanation: 'Ở dưới ghế (在椅子下面呢).',
                  score: 5,
                },
                {
                  questionNumber: 33,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“这台电脑多少钱？” 对应的回答是：',
                  pinyin: 'Zhè tái diànnǎo duōshao qián?',
                  options: ['A. 三千块钱。', 'B. 电脑很好用。', 'C. 这是我的电脑。'],
                  correctAnswer: 'A. 三千块钱。',
                  explanation: '3000 tệ (三千块钱).',
                  score: 5,
                },
                {
                  questionNumber: 34,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“你想吃米饭还是面条？” 对应的回答是：',
                  pinyin: 'Nǐ xiǎng chī mǐfàn háishì miàntiáo?',
                  options: ['A. 我想吃面条。', 'B. 我吃了。', 'C. 不太好吃。'],
                  correctAnswer: 'A. 我想吃面条。',
                  explanation: 'Chọn ăn mì (我想吃面条).',
                  score: 5,
                },
                {
                  questionNumber: 35,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '“我们怎么去学校？” 对应的回答是：',
                  pinyin: 'Wǒmen zěnme qù xuéxiào?',
                  options: ['A. 坐出租车去吧。', 'B. 学校很大。', 'C. 明天去。'],
                  correctAnswer: 'A. 坐出租车去吧。',
                  explanation: 'Đi taxi (坐出租车去吧).',
                  score: 5,
                },
                {
                  questionNumber: 36,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：我很____学汉语，我觉得汉语很有意思。',
                  pinyin: 'Wǒ hěn ____ xué hànyǔ, wǒ juéde hànyǔ hěn yǒu yìsi.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'A. 喜欢 (xǐhuan)',
                  explanation: 'Rất thích học tiếng Hán (很喜欢学汉语).',
                  score: 5,
                },
                {
                  questionNumber: 37,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：请问这个杯子____钱？',
                  pinyin: 'Qǐngwèn zhè ge bēizi ____ qián?',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'B. 多少 (duōshao)',
                  explanation: 'Bao nhiêu tiền (多少钱).',
                  score: 5,
                },
                {
                  questionNumber: 38,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：非常感谢你的帮助！—— 不客气，不用____。',
                  pinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù! —— Bú kèqi, bú yòng ____.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'C. 谢谢 (xièxie)',
                  explanation: 'Không có chi, không cần cảm ơn (不用谢).',
                  score: 5,
                },
                {
                  questionNumber: 39,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：这个汉字____读？你可以教我吗？',
                  pinyin: 'Zhè ge hànzì ____ dú? Nǐ kěyǐ jiāo wǒ ma?',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'D. 怎么 (zěnme)',
                  explanation: 'Đọc như thế nào (怎么读).',
                  score: 5,
                },
                {
                  questionNumber: 40,
                  questionType: 'FILL_BLANK',
                  prompt: '选词填空：今天星期日，____是星期一。',
                  pinyin: 'Jīntiān xīngqīrì, ____ shì xīngqīyī.',
                  options: ['A. 喜欢 (xǐhuan)', 'B. 多少 (duōshao)', 'C. 谢谢 (xièxie)', 'D. 怎么 (zěnme)', 'E. 明天 (míngtiān)'],
                  correctAnswer: 'E. 明天 (míngtiān)',
                  explanation: 'Ngày mai là thứ Hai (明天是星期一).',
                  score: 5,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. HSK 2 (H21001) - 200 points
  await prisma.exam.create({
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
            title: '一、听力 (Phần Nghe hiểu HSK 2 - 100 điểm)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'TRUE_FALSE',
                  prompt: '哥哥在跑步。(Gēge zài pǎobù.)',
                  pinyin: 'Gēge zài pǎobù.',
                  passage: 'Băng đọc: "哥哥每天早上都去跑步。"',
                  audioScript: '哥哥每天早上都去跑步。',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Khớp ý anh trai đi chạy bộ mỗi sáng -> ĐÚNG (对).',
                  score: 20,
                },
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '女：你看见我的手表了吗？\n男：在桌子上，电脑旁边。\n问：手表在哪儿？',
                  pinyin: 'Nǚ: Nǐ kànjiàn wǒ de shǒubiǎo le ma? Nán: Zài zhuōzi shang, diànnǎo pángbiān.',
                  audioScript: '女：你看见我的手表了吗？男：在桌子上，电脑旁边。',
                  options: ['A. 桌子上', 'B. 椅子下', 'C. 包里'],
                  correctAnswer: 'A. 桌子上',
                  explanation: 'Đồng hồ ở trên bàn (在桌子上).',
                  score: 20,
                },
              ],
            },
          },
          {
            title: '二、阅读 (Phần Đọc hiểu HSK 2 - 100 điểm)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 3,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '虽然天气很冷，____他还是坚持去上班。',
                  pinyin: 'Suīrán tiānqì hěn lěng, ____ tā háishì jiānchí qù shàngbān.',
                  options: ['A. 但是 (dànshì)', 'B. 因为 (yīnwèi)', 'C. 所以 (suǒyǐ)'],
                  correctAnswer: 'A. 但是 (dànshì)',
                  explanation: 'Cặp liên từ biểu thị quan hệ chuyển ý: 虽然...但是... (Tuy... nhưng...).',
                  score: 20,
                },
                {
                  questionNumber: 4,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '他是坐火车来的，还是坐____来的？',
                  pinyin: 'Tā shì zuò huǒchē lái de, háishì zuò ____ lái de?',
                  options: ['A. 飞机 (fēijī)', 'B. 苹果 (píngguǒ)', 'C. 衣服 (yīfu)'],
                  correctAnswer: 'A. 飞机 (fēijī)',
                  explanation: 'Sau "坐" cần phương tiện giao thông (飞机 - máy bay).',
                  score: 20,
                },
                {
                  questionNumber: 5,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '我今天比昨天____，所以起得更早。',
                  pinyin: 'Wǒ jīntiān bǐ zuótiān ____, suǒyǐ qǐ de gèng zǎo.',
                  options: ['A. 忙 (máng)', 'B. 冷 (lěng)', 'C. 贵 (guì)'],
                  correctAnswer: 'A. 忙 (máng)',
                  explanation: 'Hôm nay bận hơn hôm qua (比昨天忙).',
                  score: 20,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. HSK 3 (H31001) - 300 points (Nghe + Đọc + Viết)
  await prisma.exam.create({
    data: {
      code: 'H31001',
      hskLevel: 'HSK3',
      title: '新汉语水平考试 HSK（三级）全真模考卷 H31001',
      durationMinutes: 85,
      totalQuestions: 10,
      totalScore: 300,
      passingScore: 180,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力 (Phần Nghe hiểu HSK 3 - 100 điểm)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'TRUE_FALSE',
                  prompt: '他们打算周末去爬山。',
                  passage: 'Băng đọc: "这个周末天气很好，我们一起去爬香山吧。"',
                  audioScript: '这个周末天气很好，我们一起去爬香山吧。',
                  options: ['对', '错'],
                  correctAnswer: '对',
                  explanation: 'Họ dự định cuối tuần đi leo núi -> ĐÚNG (对).',
                  score: 25,
                },
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '男：你昨天的数学考试考得怎么样？\n女：挺好的，有一道题没做完，其他都写对了。\n问：女的的数学考试怎么样？',
                  audioScript: '男：你昨天的数学考试考得怎么样？女：挺好的，有一道题没做完，其他都写对了。',
                  options: ['A. 考得很好', 'B. 考得很差', 'C. 没去参加'],
                  correctAnswer: 'A. 考得很好',
                  explanation: 'Khá tốt (挺好的), hầu hết đều làm đúng.',
                  score: 25,
                },
              ],
            },
          },
          {
            title: '二、阅读 (Phần Đọc hiểu HSK 3 - 100 điểm)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 3,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '请把桌子上的书本____书架上去。',
                  options: ['A. 放回', 'B. 走去', 'C. 站着'],
                  correctAnswer: 'A. 放回',
                  explanation: 'Câu chữ 把: "把...放回...去" (đặt... trở lại...).',
                  score: 25,
                },
                {
                  questionNumber: 4,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '为了提高汉语水平，他每天都坚持看半个小时的中文新闻。这段话主要告诉我们：',
                  options: ['A. 他每天看中文新闻', 'B. 他不喜欢学中文', 'C. 他打算去中国留学'],
                  correctAnswer: 'A. 他每天看中文新闻',
                  explanation: 'Nội dung cốt lõi: Mỗi ngày đều kiên trì xem 30 phút tin tức tiếng Trung.',
                  score: 25,
                },
              ],
            },
          },
          {
            title: '三、书写 (Phần Viết HSK 3 - 100 điểm)',
            type: 'WRITING',
            order: 3,
            questions: {
              create: [
                {
                  questionNumber: 5,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '组句（连词成句）：①把  ②作业  ③弟弟  ④写完了',
                  options: ['A. ③①②④ (弟弟把作业写完了)', 'B. ①②③④', 'C. ②①③④'],
                  correctAnswer: 'A. ③①②④ (弟弟把作业写完了)',
                  explanation: 'Công thức câu chữ 把: S (弟弟) + 把 + Tân ngữ (作业) + Động từ + Kết quả (写完了).',
                  score: 50,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. HSK 4 (H41001) - 300 points
  await prisma.exam.create({
    data: {
      code: 'H41001',
      hskLevel: 'HSK4',
      title: '新汉语水平考试 HSK（四级）真题模考卷 H41001',
      durationMinutes: 105,
      totalQuestions: 6,
      totalScore: 300,
      passingScore: 180,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力 (Phần Nghe hiểu HSK 4)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '根据听到的一段话：经理决定将原定于周三的会议推迟到周五下午。问：会议改在什么时候举行？',
                  audioScript: '各位同事，由于经理出差，原定于周三上午的部门会议推迟到周五下午两点举行。',
                  options: ['A. 周三上午', 'B. 周四下午', 'C. 周五下午'],
                  correctAnswer: 'C. 周五下午',
                  explanation: 'Đoạn văn nêu rõ cuộc họp lùi lại đến chiều thứ Sáu (周五下午).',
                  score: 50,
                },
              ],
            },
          },
          {
            title: '二、阅读 (Phần Đọc hiểu HSK 4)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '阅读短文：“失败并不可怕，可怕的是失去了重新站起来的勇气。” 这句话告诉我们面对困难时应该：',
                  options: ['A. 坚持勇敢面对', 'B. 轻易放弃', 'C. 避开所有挑战'],
                  correctAnswer: 'A. 坚持勇敢面对',
                  explanation: 'Nội dung khuyên người học phải có dũng khí đứng lên kiên trì đối mặt.',
                  score: 50,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. HSK 5 (H51001) - 300 points
  await prisma.exam.create({
    data: {
      code: 'H51001',
      hskLevel: 'HSK5',
      title: '新汉语水平考试 HSK（五级）高阶实战真题卷 H51001',
      durationMinutes: 120,
      totalQuestions: 4,
      totalScore: 300,
      passingScore: 180,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力理解 (Listening Comprehension - HSK 5)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '听力长对话：关于现代都市人推崇的“绿色低碳生活”，女方主要采取了哪种做法？',
                  audioScript: '随着环保意识增强，越来越多的人选择骑自行车上下班，减少私家车尾气排放。',
                  options: ['A. 骑自行车上下班', 'B. 经常乘坐飞机', 'C. 拒绝垃圾分类'],
                  correctAnswer: 'A. 骑自行车上下班',
                  explanation: 'Đi xe đạp đi làm để giảm khí thải bảo vệ môi trường.',
                  score: 75,
                },
              ],
            },
          },
          {
            title: '二、阅读理解 (Reading Comprehension - HSK 5)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '选词填空：在激烈的市场竞争中，企业唯有不断创新，才能在行业中立于不败之____。',
                  options: ['A. 地 (dì)', 'B. 处 (chù)', 'C. 点 (diǎn)'],
                  correctAnswer: 'A. 地 (dì)',
                  explanation: 'Thành ngữ cố định: "立于不败之地" (đứng ở vị thế bất bại).',
                  score: 75,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. HSK 6 (H61001) - 300 points
  await prisma.exam.create({
    data: {
      code: 'H61001',
      hskLevel: 'HSK6',
      title: '新汉语水平考试 HSK（六级）精通级全真试卷 H61001',
      durationMinutes: 135,
      totalQuestions: 4,
      totalScore: 300,
      passingScore: 180,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、听力理解 (HSK 6)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '听学术访谈：关于人工智能与人类创造力的关系，受访教授的核心观点是什么？',
                  audioScript: '人工智能能够大幅提升数据处理效率，但人类的情感体验和直觉顿悟依然是机器无法复制的独特禀赋。',
                  options: ['A. 机器终将完全取代人类情感', 'B. 人类的直觉与情感具有不可替代性', 'C. 人工智能无法处理大数据'],
                  correctAnswer: 'B. 人类的直觉与情感具有不可替代性',
                  explanation: 'Giáo sư khẳng định cảm xúc và trực giác con người là độc nhất máy móc không thể thay thế.',
                  score: 75,
                },
              ],
            },
          },
          {
            title: '二、阅读理解（病句辨析）(HSK 6)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '请选出有语病的一项（病句判断）：',
                  options: [
                    'A. 能否贯彻落实科学发展观，是构建社会主义和谐社会的关键。',
                    'B. 这座历史悠久的古桥见证了数百年来的岁月沧桑。',
                    'C. 经过专家组的反复论证，这项工程方案终于顺利通过。',
                  ],
                  correctAnswer: 'A. 能否贯彻落实科学发展观，是构建社会主义和谐社会的关键。',
                  explanation: 'Lỗi đối xứng hai mặt - một mặt: "能否" (hai mặt: có thể hay không) nhưng vế sau lại là "是关键" (khẳng định một mặt).',
                  score: 75,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 7. HSK 7-9 (H79001 - HSK 3.0 Chuyên gia & Dịch giả) - 300 points
  await prisma.exam.create({
    data: {
      code: 'H79001',
      hskLevel: 'HSK7_9',
      title: 'HSK 3.0 高等水平考试（七—九级）学术研究与专业翻译真题卷 H79001',
      durationMinutes: 150,
      totalQuestions: 4,
      totalScore: 300,
      passingScore: 180,
      isPublished: true,
      sections: {
        create: [
          {
            title: '一、高等听力与学术报告理解 (HSK 7–9)',
            type: 'LISTENING',
            order: 1,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '听古典文献学专题报告：发言学者对于先秦出土简帛文献在校勘传世典籍中的价值作出了怎样的评价？',
                  audioScript: '清华简与郭店楚简的出土，不仅印证了传世本《老子》《尚书》的部分篇章流变，更为了解战国时期学术思想演进提供了无可替代的第一手真确材料。',
                  options: [
                    'A. 具有无可替代的第一手实证学术价值',
                    'B. 证明传世典籍皆为后人伪作',
                    'C. 毫无实际校勘校订意义',
                  ],
                  correctAnswer: 'A. 具有无可替代的第一手实证学术价值',
                  explanation: 'Báo cáo khẳng định giá trị thực chứng bậc nhất không thể thay thế của cổ thư phục vụ hiệu khám điển tịch.',
                  score: 75,
                },
              ],
            },
          },
          {
            title: '二、文言典籍与专业文献阅读 (HSK 7–9)',
            type: 'READING',
            order: 2,
            questions: {
              create: [
                {
                  questionNumber: 2,
                  questionType: 'MULTIPLE_CHOICE',
                  prompt: '阅读《论语》选段：“君子和而不同，小人同而不和。” 其中“和而不同”蕴含的核心哲学智慧是：',
                  options: [
                    'A. 追求内在和谐并包容多元差异',
                    'B. 盲目盲从他人的言行见解',
                    'C. 凡事固执己见拒绝交流',
                  ],
                  correctAnswer: 'A. 追求内在和谐并包容多元差异',
                  explanation: '"Hòa nhi bất đồng" thể hiện tinh thần bao dung sự khác biệt nhưng vẫn đạt được sự hài hòa cao quý.',
                  score: 75,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('🎉 Successfully seeded ALL official exams from HSK 1 to HSK 9!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding exams:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

