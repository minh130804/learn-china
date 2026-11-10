const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Rich Multi-Level Curriculum (Reading, Listening, Writing, Grammar)...');

  // ==========================================
  // 1. READING MATERIALS (HSK 1 - HSK 6)
  // ==========================================
  console.log('📚 Seeding 12 Graded Reading Materials (HSK 1 - 6)...');
  const readingList = [
    {
      hskLevel: 'HSK1',
      title: 'Đi siêu thị mua hoa quả (在超市买水果)',
      topic: 'Đời sống hàng ngày',
      estimatedMinutes: 3,
      contentChinese: '今天星期六，我和妈妈去超市。超市里有很多新鲜的水果。妈妈买了三个苹果和五个香蕉。一共二十块钱。苹果很甜，香蕉也很好吃。我们都很高兴。',
      contentPinyin: 'Jīntiān xīngqīliù, wǒ hé māma qù chāoshì. Chāoshì lǐ yǒu hěn duō xīnxiān de shuǐguǒ. Māma mǎi le sān gè píngguǒ hé wǔ gè xiāngjiāo. Yígòng èrshí kuài qián. Píngguǒ hěn tián, xiāngjiāo yě hěn hǎochī. Wǒmen dōu hěn gāoxìng.',
      contentVi: 'Hôm nay là thứ Bảy, tôi cùng mẹ đi siêu thị. Trong siêu thị có rất nhiều hoa quả tươi ngon. Mẹ đã mua 3 quả táo và 5 quả chuối. Tổng cộng hết 20 tệ. Táo rất ngọt, chuối cũng rất ngon. Chúng tôi đều rất vui vẻ.',
      questions: [
        {
          id: 'r1_q1',
          question: '我和谁去超市？(Tôi đi siêu thị cùng ai?)',
          options: ['爸爸 (Bố)', '妈妈 (Mẹ)', '朋友 (Bạn bè)', '老师 (Thầy giáo)'],
          correctAnswer: '妈妈 (Mẹ)',
          explanation: 'Trong bài có câu: "我和妈妈去超市" (Tôi cùng mẹ đi siêu thị).'
        },
        {
          id: 'r1_q2',
          question: '一共花了多少钱？(Tổng cộng hết bao nhiêu tiền?)',
          options: ['十块钱 (10 tệ)', '十五块钱 (15 tệ)', '二十块钱 (20 tệ)', '三十块钱 (30 tệ)'],
          correctAnswer: '二十块钱 (20 tệ)',
          explanation: 'Trong bài ghi rõ: "一共二十块钱" (Tổng cộng 20 tệ).'
        }
      ]
    },
    {
      hskLevel: 'HSK1',
      title: 'Gia đình nhỏ của tôi (我的小家)',
      topic: 'Gia đình & Bản thân',
      estimatedMinutes: 4,
      contentChinese: '我家有四口人：爸爸、妈妈、哥哥和我。爸爸是医生，在医院工作。妈妈是老师，在学校教中文。哥哥是大学生，他喜欢看书。我今年八岁，读小学三年级。我们家有一只可爱的小猫。',
      contentPinyin: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ. Bàba shì yīshēng, zài yīyuàn gōngzuò. Māma shì lǎoshī, zài xuéxiào jiāo zhōngwén. Gēge shì dàxuéshēng, tā xǐhuan kàn shū. Wǒ jīnnián bā suì, dú xiǎoxué sān niánjí. Wǒmen jiā yǒu yì zhī kě\'ài de xiǎomāo.',
      contentVi: 'Gia đình tôi có 4 người: bố, mẹ, anh trai và tôi. Bố là bác sĩ, làm việc ở bệnh viện. Mẹ là giáo viên, dạy tiếng Trung ở trường học. Anh trai là sinh viên đại học, anh ấy thích đọc sách. Năm nay tôi 8 tuổi, học lớp 3 tiểu học. Nhà chúng tôi có một chú mèo nhỏ rất dễ thương.',
      questions: [
        {
          id: 'r1_q3',
          question: '妈妈的工作是什么？(Nghề nghiệp của mẹ là gì?)',
          options: ['医生 (Bác sĩ)', '老师 (Giáo viên)', '学生 (Học sinh)', '护士 (Y tá)'],
          correctAnswer: '老师 (Giáo viên)',
          explanation: 'Trong bài viết: "妈妈是老师，在学校教中文" (Mẹ là giáo viên, dạy tiếng Trung ở trường).'
        }
      ]
    },
    {
      hskLevel: 'HSK2',
      title: 'Mỗi ngày của tôi (我的一天)',
      topic: 'Cuộc sống hàng ngày',
      estimatedMinutes: 5,
      contentChinese: '我每天早上七点起床，洗脸刷牙后和家人一起吃早饭。早饭后，我骑自行车去学校上课。下午四点下课后，我和朋友们一起在操场踢足球。晚上，我做完作业后常常看一个小时的中国电影。我觉得汉语非常有趣。',
      contentPinyin: 'Wǒ měitiān zǎoshang qī diǎn qǐchuáng, xǐliǎn shuāyá hòu hé jiārén yìqǐ chī zǎofàn. Zǎofàn hòu, wǒ qí zìxíngchē qù xuéxiào shàngkè. Xiàwǔ sì diǎn xiàkè hòu, wǒ hé péngyoumen yìqǐ zài cāochǎng tī zúqiú. Wǎnshang, wǒ zuò wán zuòyè hòu chángcháng kàn yí gè xiǎoshí de zhōngguó diànyǐng. Wǒ juéde hànyǔ fēicháng yǒuqù.',
      contentVi: 'Mỗi ngày tôi thức dậy lúc 7 giờ sáng, sau khi rửa mặt đánh răng thì cùng gia đình ăn bữa sáng. Sau bữa sáng, tôi đi xe đạp đến trường học. Buổi chiều sau khi tan học lúc 4 giờ, tôi cùng bạn bè đá bóng ở sân vận động. Buổi tối, sau khi làm xong bài tập tôi thường xem phim Trung Quốc một tiếng. Tôi cảm thấy học tiếng Hán rất thú vị.',
      questions: [
        {
          id: 'r2_q1',
          question: '我几点起床？(Tôi dậy lúc mấy giờ?)',
          options: ['六点 (6 giờ)', '七点 (7 giờ)', '八点 (8 giờ)', '九点 (9 giờ)'],
          correctAnswer: '七点 (7 giờ)',
          explanation: 'Câu đầu tiên: "我每天早上七点起床" (Tôi thức dậy lúc 7 giờ sáng mỗi ngày).'
        },
        {
          id: 'r2_q2',
          question: '我下午四点做什么？(Buổi chiều 4 giờ tôi làm gì?)',
          options: ['踢足球 (Đá bóng)', '看电影 (Xem phim)', '去超市 (Đi siêu thị)', '做作业 (Làm bài tập)'],
          correctAnswer: '踢足球 (Đá bóng)',
          explanation: 'Bài viết nêu: "下午四点下课后，我和朋友们一起在操场踢足球" (Sau khi tan học lúc 4h, tôi đá bóng cùng bạn bè).'
        }
      ]
    },
    {
      hskLevel: 'HSK2',
      title: 'Một chuyến du lịch Bắc Kinh (去北京旅游)',
      topic: 'Du lịch & Khám phá',
      estimatedMinutes: 5,
      contentChinese: '去年秋天，我和同班同学坐高铁去了北京。北京的天气非常晴朗，空气很舒服。我们先去了故宫，那里的古老建筑非常壮观。第二天，我们登上了长城，看到了美丽的风景。虽然爬山很累，但是我们都觉得非常值得。在王府井大街，我们还品尝了著名的北京烤鸭，味道好极了！',
      contentPinyin: 'Qùnián qiūtiān, wǒ hé tóngbān tóngxué zuò gāotiě qù le Běijīng. Běijīng de tiānqì fēicháng qínglǎng, kōngqì hěn shūfu. Wǒmen xiān qù le Gùgōng, nàlǐ de gǔlǎo jiànzhù fēicháng zhuàngguān. Dì-èr tiān, wǒmen dēngshàng le Chángchéng, kàndào le měilì de fēngjǐng. Suīrán páshān hěn lèi, dànshì wǒmen dōu juéde fēicháng zhíde. Zài Wángfǔjǐng Dàjiē, wǒmen hái pǐncháng le zhùmíng de Běijīng kǎoyā, wèidào hǎo jí le!',
      contentVi: 'Mùa thu năm ngoái, tôi cùng các bạn cùng lớp đi tàu cao tốc đến Bắc Kinh. Thời tiết Bắc Kinh rất trong xanh, không khí dễ chịu. Chúng tôi đến Cố Cung trước tiên, những công trình kiến trúc cổ ở đó vô cùng tráng lệ. Ngày thứ hai, chúng tôi leo lên Vạn Lý Trường Thành, ngắm nhìn phong cảnh tuyệt đẹp. Dù leo núi khá mệt nhưng chúng tôi thấy rất xứng đáng. Ở phố Vương Phủ Tỉnh, chúng tôi còn thưởng thức món Vịt quay Bắc Kinh trứ danh, hương vị ngon tuyệt đỉnh!',
      questions: [
        {
          id: 'r2_q3',
          question: '我们是怎么去北京的？(Chúng tôi đến Bắc Kinh bằng phương tiện gì?)',
          options: ['坐飞机 (Đi máy bay)', '坐高铁 (Đi tàu cao tốc)', '坐汽车 (Đi xe khách)', '骑车 (Đi xe đạp)'],
          correctAnswer: '坐高铁 (Đi tàu cao tốc)',
          explanation: 'Trong bài có câu: "我和同班同学坐高铁去了北京" (Tôi cùng bạn đi tàu cao tốc đến Bắc Kinh).'
        }
      ]
    },
    {
      hskLevel: 'HSK3',
      title: 'Trải nghiệm văn hóa trà đạo Trung Hoa (中国茶文化体验)',
      topic: 'Văn hóa truyền thống',
      estimatedMinutes: 6,
      contentChinese: '茶在中国已经有数千年的历史。中国人不仅喜欢喝茶，还把饮茶发展成了一种优雅的艺术。常见的中国茶主要分为六大类：绿茶、红茶、乌龙茶、白茶、黄茶和黑茶。喝绿茶可以清热降火，适合炎热的夏天；而红茶和黑茶性质温和，适合寒冷的冬季。泡茶时，水温、茶具以及浸泡时间都大有讲究。通过品茶，人们能够放松身心，感悟生活的宁静与美好。',
      contentPinyin: 'Chá zài zhōngguó yǐjīng yǒu shù qiān nián de lìshǐ. Zhōngguórén bùjǐn xǐhuan hē chá, hái bǎ yǐnchá fāzhǎn chéng le yì zhǒng yōuyǎ de yìshù. Chángjiàn de zhōngguó chá zhǔyào fēnwéi liù dà lèi: lǜchá, hóngchá, wūlóngchá, báichá, huángchá hé hēichá. Hē lǜchá kěyǐ qīngrè jiànghuǒ, shìhé yánrè de xiàtiān; ér hóngchá hé hēichá xìngzhì wēnhé, shìhé hánlěng de dōngjì. Pào chá shí, shuǐwēn, chájù yǐjí jìnpào shíjiān dōu dàyǒu jiǎngjiu. Tōngguò pǐnchá, rénmen nénggòu fàngsōng shēnxīn, gǎnwù shēnghuó de níngjìng yǔ měihǎo.',
      contentVi: 'Trà ở Trung Quốc đã có lịch sử hàng nghìn năm. Người Trung Quốc không chỉ thích uống trà mà còn phát triển việc thưởng trà thành một môn nghệ thuật tao nhã. Các loại trà phổ biến được chia thành sáu nhóm chính: trà xanh, hồng trà, trà ô long, bạch trà, hoàng trà và hắc trà. Uống trà xanh giúp thanh nhiệt, thích hợp cho mùa hè oi bức; trong khi hồng trà và hắc trà tính ấm, hợp với mùa đông lạnh giá. Khi pha trà, nhiệt độ nước, dụng cụ pha trà và thời gian ngâm đều đòi hỏi sự tinh tế. Thông qua việc thưởng trà, con người có thể thư thái tâm hồn, cảm nhận sự an yên và tươi đẹp của cuộc sống.',
      questions: [
        {
          id: 'r3_q1',
          question: '夏天适合喝什么茶？(Mùa hè thích hợp uống loại trà nào?)',
          options: ['绿茶 (Trà xanh)', '红茶 (Hồng trà)', '黑茶 (Hắc trà)', '奶茶 (Trà sữa)'],
          correctAnswer: '绿茶 (Trà xanh)',
          explanation: 'Bài viết nêu: "喝绿茶可以清热降火，适合炎热的夏天" (Uống trà xanh có thể thanh nhiệt, thích hợp với mùa hè).'
        }
      ]
    },
    {
      hskLevel: 'HSK3',
      title: 'Kỳ nghỉ cuối tuần bổ ích (充实的周末)',
      topic: 'Đời sống hiện đại',
      estimatedMinutes: 6,
      contentChinese: '对于上班族来说，周末是恢复精力最好的时光。上个周末，李明并没有整天待在家里睡觉玩手机，而是早早起床去公园晨跑。跑步结束后，他和大学同学约在一家安静的书店见面。他们一边喝咖啡，一边交流最近读过的好书和工作中的收获。周日下午，李明还去参加了一次中文书法兴趣班。他觉得，合理安排周末可以让生活变得更有意义，也能以更饱满的状态迎接周一的工作。',
      contentPinyin: 'Duìyú shàngbānzú láishuō, zhōumò shì huīfù jīnglì zuì hǎo de shíguāng. Shàng gè zhōumò, Lǐ Míng bìng méiyǒu zhěngtiān dāi zài jiālǐ shuìjiào wán shǒujī, érshì zǎozǎo qǐchuáng qù gōngyuán chénpǎo. Pǎobù jiéshù hòu, tā hé dàxué tóngxué yuē zài yì jiā ānjìng de shūdiàn jiànmiàn. Tāmen yìbiān hē kāfēi, yìbiān jiāoliú zuìjìn dú guò de hǎoshū hé gōngzuò zhōng de shōuhuò. Zhōurì xiàwǔ, Lǐ Míng hái qù cānjiā le yí cì zhōngwén shūfǎ xìngqù bān. Tā juéde, hélǐ ānpái zhōumò kěyǐ ràng shēnghuó biàn de gèng yǒu yìyì, yě néng yǐ gèng bǎomǎn de zhuàngtài yíngjiē zhōuyī de gōngzuò.',
      contentVi: 'Đối với dân công sở, cuối tuần là thời gian tốt nhất để phục hồi năng lượng. Cuối tuần trước, Lý Minh không ở nhà cả ngày để ngủ và nghịch điện thoại, mà dậy từ sớm để chạy bộ trong công viên. Chạy xong, anh hẹn gặp bạn học đại học tại một hiệu sách yên tĩnh. Họ vừa uống cà phê vừa chia sẻ về những cuốn sách hay đọc gần đây và những thu hoạch trong công việc. Chiều Chủ nhật, Lý Minh còn tham gia một lớp thư pháp chữ Hán. Anh cảm thấy rằng, sắp xếp cuối tuần hợp lý giúp cuộc sống ý nghĩa hơn nhiều.',
      questions: [
        {
          id: 'r3_q2',
          question: '李明周日早上去做什么？(Sáng Chủ nhật Lý Minh làm gì?)',
          options: ['睡觉 (Ngủ)', '晨跑 (Chạy bộ sáng)', '写书法 (Viết thư pháp)', '打游戏 (Chơi game)'],
          correctAnswer: '晨跑 (Chạy bộ sáng)',
          explanation: 'Trong bài có: "早早起床去公园晨跑" (Dậy sớm ra công viên chạy bộ).'
        }
      ]
    },
    {
      hskLevel: 'HSK4',
      title: 'Bí quyết bảo vệ môi trường trong đời sống (低碳生活与环境保护)',
      topic: 'Xã hội & Môi trường',
      estimatedMinutes: 7,
      contentChinese: '近年来，“低碳生活”已经成为现代社会的一种新风尚。所谓低碳生活，就是指在日常生活中尽量减少能量消耗和二氧化碳排放。我们可以从许多小事做起：例如出门尽量选择步行、骑自行车或乘坐公共交通工具，减少开私家车的频率；购物时自带环保购物袋，减少塑料袋的使用；随手关灯、节约用水，养成随手关闭不用电器的良好习惯。只要每个人都能贡献一份微小的力量，地球的环境就会变得更加清澈美丽。',
      contentPinyin: 'Jìnnián lái, “dītàn shēnghuó” yǐjīng chéngwéi xiàndài shèhuì de yì zhǒng xīn fēngshàng. Suǒwèi dītàn shēnghuó, jiùshì zhǐ zài rìcháng shēnghuó zhōng jìnliàng jiǎnshǎo néngliàng xiāohào hé èryǎnghuàtàn páifàng. Wǒmen kěyǐ cóng xǔduō xiǎoshì zuòqǐ: lìrú chūmén jìnliàng xuǎnzé bùxíng, qí zìxíngchē huò chéngzuò gōnggòng jiāotōng gōngjù, jiǎnshǎo kāi sījiāchē de pínlǜ; gòuwù shí zìdài huánbǎo gòuwùdài, jiǎnshǎo sùliàodài de shǐyòng; suíshǒu guāndēng, jiéyuē yòngshuǐ, yǎngchéng suíshǒu guānbì bù yòng diànqì de liánghǎo xíguàn. Zhǐyào měi gè rén dōu néng gòngxiàn yí fèn wēixiǎo de lìliàng, dìqiú de huánjìng jiù huì biàn de gèngjiā qīngchè měilì.',
      contentVi: 'Những năm gần đây, "sống xanh phát thải thấp" (Low-carbon living) đã trở thành một lối sống mới trong xã hội hiện đại. Chúng ta có thể bắt đầu từ những điều rất nhỏ: di chuyển bằng xe đạp, xe buýt công cộng thay vì xe cá nhân; mang theo túi vải bảo vệ môi trường khi mua sắm; tắt các thiết bị điện khi không sử dụng và tiết kiệm nước. Chỉ cần mỗi cá nhân cùng chung tay, môi trường trái đất sẽ ngày càng xanh tươi.',
      questions: [
        {
          id: 'r4_q1',
          question: '什么是“低碳生活”？(Sống phát thải thấp là gì?)',
          options: ['减少能量消耗与碳排放 (Giảm tiêu hao năng lượng & khí thải)', '多买便宜的东西 (Mua nhiều đồ rẻ)', '不吃肉只吃素 (Ăn chay không ăn thịt)', '天天待在家里 (Ở nhà suốt ngày)'],
          correctAnswer: '减少能量消耗与碳排放 (Giảm tiêu hao năng lượng & khí thải)',
          explanation: 'Định nghĩa trong bài: "在日常生活中尽量减少能量消耗和二氧化碳排放".'
        }
      ]
    },
    {
      hskLevel: 'HSK5',
      title: 'Kỷ nguyên kinh tế số và thanh toán di động (数字经济与移动支付时代)',
      topic: 'Kinh tế & Công nghệ',
      estimatedMinutes: 8,
      contentChinese: '随着移动互联网和智能手机的飞速普及，中国已经步入了名副其实的“无现金社会”。无论是高端商场、星级酒店，还是街头小吃摊、菜市场，微信支付和支付宝的二维码随处可见。移动支付不仅彻底革新了消费者的购物结算方式，也大幅度降低了商业交易的成本。与传统的现金交易相比，手机扫码支付极大地提高了资金流转的效率，杜绝了收到假币的风险，同时也带动了电子商务、外卖配送和共享单车等新兴产业的爆发式增长。',
      contentPinyin: 'Suízhe yídòng hùliánwǎng hé zhìnéng shǒujī de fēisù pǔjí, Zhōngguó yǐjīng bùrù le míng fù qí shí de “wú xiànjīn shèhuì”. Wúlùn shì gāoduān shāngchǎng, xīngjí jiǔdiàn, háishì jiētóu xiǎochītān, càishìchǎng, Wēixìn zhīfù hé Zhīfùbǎo de èrwéimǎ suíchù kějiàn. Yídòng zhīfù bùjǐn chèdǐ géxīn le xiāofèizhě de gòuwù jiésuàn fāngshì, yě dàfúdù jiàngdī le shāngyè jiāoyì de chéngběn. Yǔ chuántǒng de xiànjīn jiāoyì xiāngbǐ, shǒujī sǎomǎ zhīfù jídà de tígāo le zījīn liúzhuǎn de xiàolǜ, dùjué le shōudào jiǎbì de fēngxiǎn, tóngshí yě dàidòng le diànzǐ shāngwù, wàimài pèisòng hé gòngxiǎng dānchē děng xīnxīng chǎnyè de bàofā shì zēngzhǎng.',
      contentVi: 'Cùng với sự bùng nổ của Internet di động và điện thoại thông minh, Trung Quốc đã chính thức bước vào một "xã hội không tiền mặt" đúng nghĩa. Dù ở trung tâm thương mại cao cấp hay sạp hàng ven đường, mã QR WeChat Pay và Alipay xuất hiện khắp mọi nơi. Thanh toán di động không chỉ thay đổi hành vi thanh toán của người tiêu dùng mà còn giảm thiểu chi phí giao dịch, tăng tốc độ luân chuyển dòng tiền và thúc đẩy thương mại điện tử bùng nổ mạnh mẽ.',
      questions: [
        {
          id: 'r5_q1',
          question: '移动支付的主要优点不包括哪一项？(Ưu điểm nào KHÔNG phải của thanh toán di động?)',
          options: ['杜绝收到假币 (Tránh nguy cơ tiền giả)', '提高资金流转效率 (Tăng hiệu suất lưu chuyển dòng tiền)', '必须随身携带大量零钱 (Bắt buộc phải mang theo nhiều tiền lẻ)', '带动电商与外卖产业 (Thúc đẩy ngành thương mại điện tử & giao đồ ăn)'],
          correctAnswer: '必须随身携带大量零钱 (Bắt buộc phải mang theo nhiều tiền lẻ)',
          explanation: 'Thanh toán di động loại bỏ hoàn toàn việc phải mang tiền mặt hay tiền lẻ.'
        }
      ]
    },
    {
      hskLevel: 'HSK4',
      title: 'Văn hóa chia sẻ kinh tế và xe đạp công cộng (共享单车与绿色出行)',
      topic: 'Xã hội hiện đại',
      estimatedMinutes: 6,
      contentChinese: '在中国各大城市的街头，随处可见整齐停放的共享单车。市民只需用智能手机扫描车身上的二维码，就能几秒钟内开锁骑行。共享单车的普及不仅解决了公共交通中“最后一公里”的接驳难题，还有效缓解了城市早晚高峰的交通拥堵，减少了碳排放。然而，单车乱停乱放、损毁以及运维调度成本高昂等问题，也对城市精细化治理提出了全新的考验。如今，借助大数据和北斗高精度定位技术，许多城市划定了“电子围栏”，引导市民规范停放。',
      contentPinyin: 'Zài Zhōngguó gè dà chéngshì de jiētóu, suíchù kějiàn zhěngqí tíngfàng de gòngxiǎng dānchē. Shìmín zhǐ xū yòng zhìnéng shǒujī sǎomiáo chēshēn shang de èrwéimǎ, jiù néng jǐ miǎozhōng nèi kāisuǒ qíxíng. Gòngxiǎng dānchē de pǔjí bùjǐn jiějué le gōnggòng jiāotōng zhōng “zuìhòu yì gōnglǐ” de jiēbó nántí, hái yǒuxiào huǎnjiě le chéngshì zǎowǎn gāofēng de jiāotōng yōngdǔ, jiǎnshǎo le tàn páifàng.',
      contentVi: 'Trên các ngả đường phố lớn của Trung Quốc, xe đạp công cộng dùng chung được xếp ngay ngắn ở khắp mọi nơi. Người dân chỉ cần quét mã QR bằng điện thoại thông minh là có thể mở khóa trong vài giây. Sự phổ biến của xe đạp chia sẻ giải quyết bài toán "1 km cuối cùng" của giao thông công cộng và giảm thiểu ùn tắc giờ cao điểm.',
      questions: [
        {
          id: 'r4_extra_q1',
          question: '共享单车主要解决了公共交通中的什么问题？(Xe đạp chia sẻ chủ yếu giải quyết vấn đề gì?)',
          options: ['长途旅行 (Du lịch đường dài)', '“最后一公里”接驳难题 (Bài toán nối chuyến 1km cuối)', '购买昂贵自行车 (Mua xe đạp đắt tiền)', '取代高铁 (Thay thế tàu cao tốc)'],
          correctAnswer: '“最后一公里”接驳难题 (Bài toán nối chuyến 1km cuối)',
          explanation: 'Trong bài có câu: "不仅解决了公共交通中‘最后一公里’的接驳难题".'
        }
      ]
    },
    {
      hskLevel: 'HSK5',
      title: 'Trí tuệ nhân tạo định hình giáo dục tương lai (人工智能如何重塑未来教育)',
      topic: 'Công nghệ & Giáo dục',
      estimatedMinutes: 8,
      contentChinese: '生成式人工智能与大语言模型的飞速发展，正在给传统教育模式带来颠覆性的变革。传统的“千人一面”标准化课堂教学，正逐步被“因材施教”的个性化自适应学习所替代。AI助教能够根据每个学生的知识掌握程度、做题习惯和遗忘曲线，动态生成专属的学习路径与答疑辅导。与此同时，教育的重心也在发生深刻转变：死记硬背知识点已不再是衡量学习成果的唯一准则，批判性思维、跨学科创新整合能力以及终身学习的能力，正成为未来人才不可替代的核心竞争力。',
      contentPinyin: 'Shēngchéngshì réngōng zhìnéng yǔ dà yǔyán móxíng de fēisù fāzhǎn, zhèngzài gěi chuántǒng jiàoyù móshì dàilái diānfùxìng de biàngé. Chuántǒng de “qiān rén yí miàn” biāozhǔnhuà kètáng jiàoxué, zhèng zhúbù bèi “yīncáishījiào” de gèxìnghuà zìshìyìng xuéxí suǒ tìdài.',
      contentVi: 'Sự phát triển vượt bậc của AI tạo sinh và mô hình ngôn ngữ lớn đang mang đến cuộc cách mạng toàn diện cho giáo dục. Các lớp học truyền thống đang dần được thay thế bằng phương pháp học cá nhân hóa phù hợp với năng lực từng người học.',
      questions: [
        {
          id: 'r5_extra_q1',
          question: '未来人才不可替代的核心竞争力是什么？(Năng lực cạnh tranh cốt lõi không thể thay thế là gì?)',
          options: ['死记硬背 (Học vẹt thuộc lòng)', '批判性思维与跨学科整合能力 (Tư duy phản biện & liên ngành)', '打字速度 (Tốc độ gõ phím)', '仅仅通过考试 (Chỉ cần thi đỗ)'],
          correctAnswer: '批判性思维与跨学科整合能力 (Tư duy phản biện & liên ngành)',
          explanation: 'Đoạn cuối nhấn mạnh: "批判性思维、跨学科创新整合能力以及终身学习的能力".'
        }
      ]
    },
    {
      hskLevel: 'HSK6',
      title: 'Toàn cầu hóa kinh tế và đàm phán chuỗi cung ứng (经济全球化与跨国供应链协同)',
      topic: 'Thương mại & Học thuật',
      estimatedMinutes: 9,
      contentChinese: '在后疫情时代的宏观经济格局下，全球产业链与供应链正经历着前所未有的结构性重塑。传统的“效率优先”与“即时生产（Just-In-Time）”模式正在逐步向兼顾“安全韧性”与“多元布局”的新范式转变。跨国企业在进行商务谈判时，不仅聚焦于离岸价格（FOB）与到岸成本（CIF）等显性财务指标，更将地缘政治风险对冲、双碳减排标准（ESG合规性）以及数字化协同能力纳入战略决策的核心评估维度。唯有构建高度弹性且互信互惠的国际伙伴关系，方能在错综复杂的全球市场博弈中立于不败之地。',
      contentPinyin: 'Zài hòu yìqíng shídài de hóngguān jīngjì gégú xià, quánqiú chǎnyèliàn yǔ gōngyìngliàn zhèng jīnglì zhe qiánsuǒwèiyǒu de jiégòuxìng chóngshù. Chuántǒng de “xiàolǜ yōuxiān” yǔ “jíshí shēngchǎn” móshì zhèngzài zhúbù xiàng jiāngù “ānquán rènxìng” yǔ “duōyuán bùjú” de xīn fànshì zhuǎnbiàn. Kuàguó qǐyè zài jìnxíng shāngwù tánpàn shí, bùjǐn jùjiāo yú lí\'àn jiàgé yǔ dào\'àn chéngběn děng xiǎnxìng cáiwù zhǐbiāo, gèng jiāng dìyuán zhèngzhì fēngxiǎn duìchōng, shuāngtàn jiǎnpái biāozhǔn yǐjí shùzìhuà xiétóng nénglì nàrù zhànlüè juécè de héxīn pínggū wéidù.',
      contentVi: 'Trong bối cảnh kinh tế vĩ mô toàn cầu hiện nay, chuỗi cung ứng quốc tế đang trải qua cuộc tái cấu trúc mang tính chiến lược sâu sắc. Các doanh nghiệp đa quốc gia khi đàm phán thương mại không chỉ chú trọng các chỉ số tài chính như giá FOB, CIF mà còn đặt nặng tiêu chuẩn giảm phát thải ESG, phòng ngừa rủi ro địa chính trị và năng lực chuyển đổi số để đảm bảo chuỗi cung ứng bền vững.',
      questions: [
        {
          id: 'r6_q1',
          question: '跨国企业如今在供应链布局上更看重什么？(Hiện nay các tập đoàn đa quốc gia coi trọng điều gì hơn trong chuỗi cung ứng?)',
          options: ['仅追求最低生产成本 (Chỉ theo đuổi chi phí thấp nhất)', '兼顾安全韧性与多元布局 (Cân đối giữa độ bền vững an toàn & đa dạng hóa)', '完全停止跨国采购 (Ngừng hoàn toàn nhập khẩu quốc tế)', '取消所有数字化协同 (Hủy bỏ các giải pháp số hóa)'],
          correctAnswer: '兼顾安全韧性与多元布局 (Cân đối giữa độ bền vững an toàn & đa dạng hóa)',
          explanation: 'Nội dung bài viết: "逐步向兼顾安全韧性与多元布局的新范式转变".'
        }
      ]
    }
  ];

  for (const item of readingList) {
    const existing = await prisma.readingMaterial.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.readingMaterial.create({ data: item });
    }
  }

  // ==========================================
  // 2. LISTENING MATERIALS (HSK 1 - HSK 6)
  // ==========================================
  console.log('🎧 Seeding 10 Graded Listening Dialogs (HSK 1 - 6)...');
  const listeningList = [
    {
      hskLevel: 'HSK1',
      title: 'Hỏi giá hoa quả ở chợ (问价格)',
      description: 'Luyện nghe các con số và hỏi giá tiền cơ bản trong chợ Trung Quốc.',
      transcript: 'A: 请问，苹果多少钱一斤？\nB: 苹果五块钱一斤。\nA: 太贵了，四块钱可以吗？\nB: 好吧，你要几斤？\nA: 我要三斤，谢谢！',
      pinyin: 'A: Qǐngwèn, píngguǒ duōshao qián yì jīn?\nB: Píngguǒ wǔ kuài qián yì jīn.\nA: Tài guì le, sì kuài qián kěyǐ ma?\nB: Hǎo ba, nǐ yào jǐ jīn?\nA: Wǒ yào sān jīn, xièxie!',
      translationVi: 'A: Xin hỏi, táo bao nhiêu tiền một cân?\nB: Táo 5 tệ một cân.\nA: Đắt quá, 4 tệ được không?\nB: Được rồi, bạn lấy mấy cân?\nA: Tôi lấy 3 cân, cảm ơn nhé!',
      duration: 45,
      questions: [
        {
          id: 'l1_q1',
          question: '最后苹果多少钱一斤成交？(Cuối cùng táo chốt giá bao nhiêu tiền một cân?)',
          options: ['三块 (3 tệ)', '四块 (4 tệ)', '五块 (5 tệ)', '六块 (6 tệ)'],
          correctAnswer: '四块 (4 tệ)',
          explanation: 'Người mua mặc cả: "四块钱可以吗？" và người bán đồng ý "好吧".'
        }
      ]
    },
    {
      hskLevel: 'HSK2',
      title: 'Gọi xe taxi đến sân bay (坐出租车去机场)',
      description: 'Đối thoại giữa tài xế taxi và hành khách khi di chuyển ra sân bay.',
      transcript: 'A: 师傅，您好！我去首都国际机场2号航站楼。\nB: 好的，请系好安全带。现在路上车有点多，大概需要四十分钟。\nA: 没关系，我的航班是下午三点的，时间很充裕。\nB: 那就好，到了我会提醒您的。',
      pinyin: 'A: Shīfu, nín hǎo! Wǒ qù Shǒudū Guójì Jīchǎng èr hào hángzhànlóu.\nB: Hǎo de, qǐng jì hǎo ānquándài. Xiànzài lùshang chē yǒudiǎnr duō, dàgài xūyào sìshí fēnzhōng.\nA: Méi guānxi, wǒ de hángbān shì xiàwǔ sān diǎn de, shíjiān hěn chōngyù.\nB: Nà jiù hǎo, dào le wǒ huì tíxǐng nín de.',
      translationVi: 'A: Chào bác tài! Tôi đi Nhà ga T2 Sân bay Quốc tế Thủ Đô.\nB: Vâng ạ, phiền bạn thắt dây an toàn. Giờ đường hơi đông xe, chắc mất khoảng 40 phút.\nA: Không sao, chuyến bay của tôi lúc 3 giờ chiều, thời gian còn rất dư dả.\nB: Vậy thì tốt rồi, khi nào tới nơi tôi sẽ báo bạn.',
      duration: 55,
      questions: [
        {
          id: 'l2_q1',
          question: '大概需要多长时间到达机场？(Mất khoảng bao lâu để tới sân bay?)',
          options: ['二十分钟 (20 phút)', '三十分钟 (30 phút)', '四十分钟 (40 phút)', '一个小时 (1 tiếng)'],
          correctAnswer: '四十分钟 (40 phút)',
          explanation: 'Bác tài nói: "大概需要四十分钟" (Khoảng 40 phút).'
        }
      ]
    },
    {
      hskLevel: 'HSK3',
      title: 'Làm thủ tục nhận phòng khách sạn (酒店入住办理)',
      description: 'Check-in khách sạn, xác nhận thông tin đặt phòng, hỏi mật khẩu wifi và bữa sáng.',
      transcript: 'A: 您好，欢迎光临如家酒店！请问有预订吗？\nB: 您好，我在携程上预订了一间大床房，名字叫张伟。\nA: 请出示一下您的身份证或护照。好的，查到了，您预订了两个晚上，含双人早餐。请交押金两百元。\nB: 好的，我可以微信支付吗？还有，请问无线网络密码是多少？\nA: 可以微信支付。房卡背面有Wi-Fi密码，早餐时间是早上七点到九点半。祝您入住愉快！',
      pinyin: 'A: Nín hǎo, huānyíng guānglín Rújiā Jiǔdiàn! Qǐngwèn yǒu yùdìng ma?\nB: Nín hǎo, wǒ zài Xiécéng shang yùdìng le yì jiān dàchuáng fáng, míngzi jiào Zhāng Wěi.\nA: Qǐng chūshì yíxià nín de shēnfènzhèng huò hùzhào. Hǎo de, chá dào le, nín yùdìng le liǎng gè wǎnshang, hán shuāngrén zǎocān. Qǐng jiāo yājīn liǎngbǎi yuán.\nB: Hǎo de, wǒ kěyǐ Wēixìn zhīfù ma? Hái yǒu, qǐngwèn wúxiàn wǎngluò mìmǎ shì duōshao?\nA: Kěyǐ Wēixìn zhīfù. Fángkǎ bèimiàn yǒu Wi-Fi mìmǎ, zǎocān shíjiān shì zǎoshang qī diǎn dào jiǔ diǎn bàn. Zhù nín rùzhù yúkuài!',
      translationVi: 'A: Xin chào, hoan nghênh quý khách đến khách sạn Home Inn! Xin hỏi bạn đã đặt phòng chưa ạ?\nB: Chào bạn, tôi đã đặt một phòng giường đôi trên Ctrip, tên là Trương Vĩ.\nA: Xin phiền bạn xuất trình CMND hoặc hộ chiếu. Vâng, tôi đã thấy rồi, bạn đặt 2 đêm bao gồm bữa sáng cho 2 người. Tiền đặt cọc là 200 tệ.\nB: Được, tôi quét mã WeChat được không? Với lại cho tôi hỏi mật khẩu wifi là gì ạ?\nA: Quét mã WeChat được ạ. Sau thẻ phòng có in mật khẩu Wi-Fi, giờ ăn sáng từ 7h đến 9h30 sáng. Chúc bạn có kỳ nghỉ vui vẻ!',
      duration: 65,
      questions: [
        {
          id: 'l3_q1',
          question: '押金是多少钱？(Tiền đặt cọc là bao nhiêu tiền?)',
          options: ['一百元 (100 tệ)', '两百元 (200 tệ)', '三百元 (300 tệ)', '五百元 (500 tệ)'],
          correctAnswer: '两百元 (200 tệ)',
          explanation: 'Lễ tân thông báo: "请交押金两百元" (Xin nộp tiền cọc 200 tệ).'
        }
      ]
    },
    {
      hskLevel: 'HSK4',
      title: 'Phỏng vấn xin việc tại công ty đa quốc gia (求职面试)',
      description: 'Luyện nghe phỏng vấn tuyển dụng, giới thiệu kinh nghiệm làm việc và định hướng phát triển.',
      transcript: 'A: 李先生请坐。我看过你的简历，你的汉语水平非常出色。能谈谈你为什么想加入我们跨国贸易团队吗？\nB: 谢谢王经理。我大学的主修专业是国际经济与贸易，毕业后在进出口公司工作了三年。贵公司在东南亚市场的业务增长非常迅速，我熟悉越南市场的法律法规和商业文化，我相信我的双语能力和谈判经验能为公司开拓新客户。\nA: 非常好。如果工作中遇到意见不合的客户，你通常如何处理？\nB: 我认为倾听和共情最重要。首先要充分理解客户的核心诉求，然后从双赢的角度提出替代方案，用客观数据和专业态度赢得信任。',
      pinyin: 'A: Lǐ xiānsheng qǐng zuò. Wǒ kàn guò nǐ de jiǎnlì, nǐ de hànyǔ shuǐpíng fēicháng chūsè. Néng tán tan nǐ wèishénme xiǎng jiārù wǒmen kuàguó màoyì tuánduì ma?\nB: Xièxie Wáng jīnglǐ. Wǒ dàxué de zhǔxiū zhuānyè shì guójì jīngjì yǔ màoyì, bìyè hòu zài jìn-chūkǒu gōngsī gōngzuò le sān nián. Guì gōngsī zài dōngnányà shìchǎng de yèwù zēngzhǎng fēicháng xùnsù, wǒ shúxi Yuènán shìchǎng de fǎlǜ fǎguī hé shāngyè wénhuà, wǒ xiāngxìn wǒ de shuāngyǔ nénglì hé tánpàn jīngyàn néng wèi gōngsī kāituò xīn kèhù.\nA: Fēicháng hǎo. Rúguǒ gōngzuò zhōng yùdào yìjiàn bùhé de kèhù, nǐ tōngcháng rúhé chǔlǐ?\nB: Wǒ rènwéi qīngtīng hé gòngqíng zuì zhòngyào. Shǒuxiān yào chōngfèn lǐjiě kèhù de héxīn sùqiú, ránhòu cóng shuāngyíng de jiǎodù tíchū tìdài fāng\'àn, yòng kèguān shùjù hé zhuānyè tàidù yíngdé xìnrèn.',
      translationVi: 'A: Chào anh Lý, mời ngồi. Tôi đã xem CV của bạn, năng lực tiếng Trung của bạn rất ấn tượng. Bạn có thể chia sẻ lý do muốn gia nhập đội ngũ thương mại quốc tế của chúng tôi không?\nB: Cảm ơn Giám đốc Vương. Chuyên ngành đại học của tôi là Kinh tế & Thương mại quốc tế, sau khi tốt nghiệp đã làm việc tại công ty xuất nhập khẩu 3 năm. Quý công ty đang mở rộng rất nhanh ở Đông Nam Á. Tôi rất am hiểu thị trường, văn hóa kinh doanh và luật pháp Việt Nam. Tôi tự tin kỹ năng song ngữ và kinh nghiệm đàm phán của mình sẽ giúp công ty phát triển thêm khách hàng mới.\nA: Rất tốt. Nếu gặp khách hàng bất đồng quan điểm, bạn xử lý thế nào?\nB: Tôi nghĩ lắng nghe và thấu cảm là quan trọng nhất. Trước hết phải hiểu rõ nhu cầu cốt lõi của khách, sau đó đề xuất phương án win-win dựa trên số liệu khách quan.',
      duration: 80,
      questions: [
        {
          id: 'l4_q1',
          question: '李先生有几年相关工作经验？(Anh Lý có mấy năm kinh nghiệm làm việc liên quan?)',
          options: ['一年 (1 năm)', '两年 (2 năm)', '三年 (3 năm)', '五年 (5 năm)'],
          correctAnswer: '三年 (3 năm)',
          explanation: 'Ứng viên trả lời: "毕业后在进出口公司工作了三年" (Sau tốt nghiệp đã làm ở cty XNK 3 năm).'
        }
      ]
    },
    {
      hskLevel: 'HSK5',
      title: 'Đàm phán hợp đồng thương mại quốc tế (商务合同谈判)',
      description: 'Hội thoại đàm phán phương thức thanh toán L/C, điều kiện giao hàng CIF và chiết khấu số lượng lớn.',
      transcript: 'A: 陈总，关于本次两万件电子元器件的采购订单，我们对样品质量非常满意。但是在付款方式上，我方希望能采用即期信用证（L/C at sight）。\nB: 王总，我们长期合作的客户通常采用30%电汇预付款，余款见提单副本付清（T/T）。不过考虑到贵公司的信誉与本次采购规模，我们可以接受不可撤销的即期信用证。\nA: 非常感谢您的灵活支持！关于交货期，能在九月底前分两批完成离岸交货吗？\nB: 只要双方下周一完成合同签署并开出信用证，我们的生产线完全能够按时排产交付。',
      pinyin: 'A: Chén zǒng, guānyú běncì liǎng wàn jiàn diànzǐ yuánqìjiàn de cǎigòu dìngdān, wǒmen duì yàngpǐn zhìliàng fēicháng mǎnyì. Dànshì zài fùkuǎn fāngshì shang, wǒfāng xīwàng néng cǎiyòng jíqī xìnyòngzhèng (L/C at sight).\nB: Wáng zǒng, wǒmen chángqī hézuò de kèhù tōngcháng cǎiyòng bǎifēnzhī sānshí diànhuì yùfùkuǎn, yúkuǎn jiàn tídān fùběn fùqīng (T/T). Bùguò kǎolǜ dào guì gōngsī de xìnyù yǔ běncì cǎigòu guīmó, wǒmen kěyǐ jiēshòu bùkě chèxiāo de jíqī xìnyòngzhèng.\nA: Fēicháng gǎnxiè nín de línghuó zhīchí! Guānyú jiāohuò qī, néng zài jiǔ yuè dǐ qián fēn liǎng pī wánchéng lí\'àn jiāohuò ma?\nB: Zhǐyào shuāngfāng xià zhōuyī wánchéng hétong qiānshǔ bìng kāichū xìnyòngzhèng, wǒmen de shēngchǎnxiàn wánquán nénggòu ànshí páichǎn jiāofù.',
      translationVi: 'A: Giám đốc Trần, về đơn hàng 20.000 linh kiện điện tử này, chúng tôi rất hài lòng với chất lượng mẫu thử. Nhưng về phương thức thanh toán, chúng tôi muốn áp dụng thư tín dụng trả ngay (L/C at sight).\nB: Giám đốc Vương, khách hàng quen thường đặt cọc 30% T/T, còn lại thanh toán khi có vận đơn copy. Tuy nhiên với uy tín và quy mô của quý công ty, chúng tôi đồng ý nhận L/C trả ngay không hủy ngang.\nA: Rất cảm ơn sự linh hoạt của anh! Về thời hạn giao hàng, liệu có thể hoàn thành giao hàng FOB trước cuối tháng 9 thành 2 đợt không?\nB: Chỉ cần thứ Hai tuần tới ký hợp đồng và mở L/C, dây chuyền bên tôi hoàn toàn đảm bảo tiến độ.',
      duration: 85,
      questions: [
        {
          id: 'l5_q1',
          question: '双方最终同意采用哪种付款方式？(Hai bên cuối cùng đồng ý phương thức thanh toán nào?)',
          options: ['100% 现金支付 (100% tiền mặt)', '不可撤销即期信用证 (L/C trả ngay không hủy ngang)', '见货后三个月付款 (Trả sau 3 tháng khi nhận hàng)', '分期十年付款 (Trả góp 10 năm)'],
          correctAnswer: '不可撤销即期信用证 (L/C trả ngay không hủy ngang)',
          explanation: 'Bên bán đồng ý: "我们可以接受不可撤销的即期信用证".'
        }
      ]
    },
    {
      hskLevel: 'HSK6',
      title: 'Tọa đàm chuyên đề: Trí tuệ nhân tạo và kinh tế xanh (人工智能与可持续发展座谈)',
      description: 'Đoạn băng tọa đàm chuyên sâu về thuật toán AI, tối ưu hóa lưới điện thông minh và trung hòa carbon.',
      transcript: 'A: 各位专家学者，欢迎收看本期《前沿透视》。今天我们探讨的核心议题是：人工智能如何赋能工业绿色转型与双碳战略落地。张教授，请您先谈谈您的观点。\nB: 谢谢主持人。传统重工业的痛点在于高能耗与低预测性。如今，通过部署深度强化学习算法与数字孪生系统，企业可以对钢铁冶炼、化工反应以及区域微电网进行微秒级的动态调优。根据我们示范项目的实测数据，AI算法的应用平均降低了8.5%的综合综合能耗，减少了逾万吨碳足迹。\nA: 这确实是令人振奋的突破。那么李研究员，从政策与投融资视角来看，如何避免算法黑箱带来的合规性与系统性风险呢？\nB: 关键在于推行“可解释性AI（XAI）”与严格的数据主权审计制度。唯有在技术创新与审慎监管之间取得动态平衡，技术红利方能真正转化为长期社会效益。',
      pinyin: 'A: Gèwèi zhuānjiā xuézhě, huānyíng shōukàn běnqī 《Qiányán Tòushì》. Jīntiān wǒmen tàntǎo de héxīn yìtí shì: Réngōng zhìnéng rúhé fùnéng gōngyè lǜsè zhuǎnxíng yǔ shuāngtàn zhànlüè luòdì. Zhāng jiàoshòu, qǐng nín xiān tán tan nín de guāndiǎn.',
      translationVi: 'A: Kính chào quý chuyên gia, hoan nghênh quý vị đến với diễn đàn "Tiêu điểm tiền phong". Hôm nay chủ đề trọng tâm là: AI thúc đẩy chuyển đổi xanh công nghiệp và chiến lược trung hòa carbon thế nào? Mời Giáo sư Trương chia sẻ.\nB: Cảm ơn MC. Nút thắt của công nghiệp nặng là tiêu hao năng lượng cao và khó dự báo. Nhờ thuật toán học tăng cường sâu và bản sao số (Digital Twin), doanh nghiệp có thể tối ưu vi mô mạng lưới điện và luyện kim, tiết kiệm 8.5% năng lượng tổng thể.\nA: Đột phá rất ấn tượng. Còn nghiên cứu viên Lý, làm sao phòng ngừa rủi ro hộp đen thuật toán?\nB: Cốt lõi là thúc đẩy AI có thể giải thích (Explainable AI) và kiểm toán chủ quyền dữ liệu.',
      duration: 95,
      questions: [
        {
          id: 'l6_q1',
          question: 'AI算法在该示范项目中平均降低了多少综合能耗？(Thuật toán AI giúp giảm trung bình bao nhiêu % mức tiêu thụ năng lượng?)',
          options: ['3.5%', '5.0%', '8.5%', '15.0%'],
          correctAnswer: '8.5%',
          explanation: 'Giáo sư Trương khẳng định: "AI算法的应用平均降低了8.5%的综合能耗".'
        }
      ]
    }
  ];

  for (const item of listeningList) {
    const existing = await prisma.listeningMaterial.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.listeningMaterial.create({ data: item });
    }
  }

  // ==========================================
  // 3. WRITING EXERCISES (Mễ Tự Cách - 16 Hanzi)
  // ==========================================
  console.log('✍️ Seeding 16 Interactive Writing Characters...');
  const writingChars = [
    { char: '你', py: 'nǐ', vi: 'Bạn, anh, chị (ngôi thứ 2)', strokes: 7, rad: '亻', rule: 'Từ trái sang phải (先左后右)' },
    { char: '好', py: 'hǎo', vi: 'Tốt, đẹp, khỏe mạnh', strokes: 6, rad: '女', rule: 'Từ trái sang phải (先左后右)' },
    { char: '学', py: 'xué', vi: 'Học tập, nghiên cứu', strokes: 8, rad: '子', rule: 'Từ trên xuống dưới (先上后下)' },
    { char: '汉', py: 'hàn', vi: 'Hán (dân tộc Hán, tiếng Hán)', strokes: 5, rad: '氵', rule: 'Từ trái sang phải' },
    { char: '语', py: 'yǔ', vi: 'Ngôn ngữ, tiếng nói', strokes: 9, rad: '讠', rule: 'Từ trái sang phải' },
    { char: '中', py: 'zhōng', vi: 'Trung, ở giữa', strokes: 4, rad: '丨', rule: 'Ngoài trước trong sau, sổ thẳng sau cùng' },
    { char: '国', py: 'guó', vi: 'Quốc gia, đất nước', strokes: 8, rad: '囗', rule: 'Vào trước đóng sau (先进入后关门)' },
    { char: '人', py: 'rén', vi: 'Con người, nhân loại', strokes: 2, rad: '人', rule: 'Phẩy trước mác sau (先撇后捺)' },
    { char: '水', py: 'shuǐ', vi: 'Nước, thủy', strokes: 4, rad: '水', rule: 'Giữa trước hai bên sau (先中间后两边)' },
    { char: '日', py: 'rì', vi: 'Mặt trời, ban ngày, ngày', strokes: 4, rad: '日', rule: 'Từ ngoài vào trong, đáy đóng sau' },
    { char: '月', py: 'yuè', vi: 'Mặt trăng, tháng', strokes: 4, rad: '月', rule: 'Phẩy trước ngang gập sau' },
    { char: '大', py: 'dà', vi: 'To lớn, vĩ đại', strokes: 3, rad: '大', rule: 'Ngang trước phẩy mác sau' },
    { char: '小', py: 'xiǎo', vi: 'Nhỏ bé, tiểu', strokes: 3, rad: '小', rule: 'Giữa trước hai bên sau' },
    { char: '家', py: 'jiā', vi: 'Nhà, gia đình', strokes: 10, rad: '宀', rule: 'Bộ miên ở trên trước, thân dưới sau' },
    { char: '心', py: 'xīn', vi: 'Trái tim, tâm trí', strokes: 4, rad: '心', rule: 'Chấm trái trước, móc nằm sau' },
    { char: '朋', py: 'péng', vi: 'Bằng hữu, bạn bè', strokes: 8, rad: '月', rule: 'Hai chữ Nguyệt ghép song song' }
  ];

  for (const c of writingChars) {
    await prisma.writingExercise.upsert({
      where: { character: c.char },
      update: {
        pinyin: c.py,
        meaningVi: c.vi,
        strokeCount: c.strokes,
        radical: c.rad,
        strokeData: {
          rule: c.rule,
          strokes: [`Nét 1-3: Định hình khung chữ`, `Nét tiếp theo: Chi tiết trung tâm`, `Nét kết thúc: Cân đối bút thế`]
        }
      },
      create: {
        character: c.char,
        pinyin: c.py,
        meaningVi: c.vi,
        strokeCount: c.strokes,
        radical: c.rad,
        strokeData: {
          rule: c.rule,
          strokes: [`Nét 1-3: Định hình khung chữ`, `Nét tiếp theo: Chi tiết trung tâm`, `Nét kết thúc: Cân đối bút thế`]
        }
      }
    });
  }

  // ==========================================
  // 4. GRAMMAR POINTS (20 Core Structures HSK 1-6)
  // ==========================================
  console.log('📖 Seeding 20 Core Grammar Points (HSK 1 - 6)...');
  const grammarPoints = [
    {
      hskLevel: 'HSK1',
      title: 'Động từ phán đoán 是 (shì)',
      pattern: 'Chủ ngữ + 是 + Danh từ',
      explanationVi: 'Dùng để nối chủ ngữ với danh từ/đại từ nhằm phán đoán, giới thiệu thân thế, nghề nghiệp hoặc tính chất sự vật.',
      usageNotes: 'Phủ định dùng 不是 (bú shì).',
      commonMistakes: 'Không dùng 是 trước tính từ (Ví dụ nói: 我很高兴, không nói: 我是很高兴).',
      examples: [
        { chinese: '我是越南人。', pinyin: 'Wǒ shì Yuènánrén.', translation: 'Tôi là người Việt Nam.' },
        { chinese: '他是我的汉语老师。', pinyin: 'Tā shì wǒ de hànyǔ lǎoshī.', translation: 'Thầy ấy là giáo viên tiếng Trung của tôi.' }
      ]
    },
    {
      hskLevel: 'HSK1',
      title: 'Trợ từ nghi vấn 吗 (ma)',
      pattern: 'Câu trần thuật + 吗？',
      explanationVi: 'Đặt ở cuối câu khẳng định để biến câu đó thành câu hỏi Có/Không (Yes/No question).',
      usageNotes: 'Trong câu đã có đại từ nghi vấn (như 什么, 谁, 哪儿) thì TUYỆT ĐỐI không dùng 吗.',
      commonMistakes: 'Sai: 你叫什么名字吗？(X) -> Đúng: 你叫什么名字？(O)',
      examples: [
        { chinese: '你是中国人吗？', pinyin: 'Nǐ shì Zhōngguórén ma?', translation: 'Bạn là người Trung Quốc phải không?' },
        { chinese: '今天天气好吗？', pinyin: 'Jīntiān tiānqì hǎo ma?', translation: 'Hôm nay thời tiết đẹp không?' }
      ]
    },
    {
      hskLevel: 'HSK2',
      title: 'Cấu trúc so sánh hơn với 比 (bǐ)',
      pattern: 'A + 比 + B + Tính từ (+ Số lượng/Phó từ)',
      explanationVi: 'Biểu thị đối tượng A có tính chất, mức độ cao hơn đối tượng B.',
      usageNotes: 'Phủ định dùng 没有 (A 没有 B + Tính từ).',
      commonMistakes: 'Không đặt 很, 非常, 十分 trước tính từ trong câu so sánh 比.',
      examples: [
        { chinese: '哥哥比我高五公分。', pinyin: 'Gēge bǐ wǒ gāo wǔ gōngfēn.', translation: 'Anh trai cao hơn tôi 5 cm.' },
        { chinese: '今天比昨天冷得多。', pinyin: 'Jīntiān bǐ zuótiān lěng de duō.', translation: 'Hôm nay lạnh hơn hôm qua rất nhiều.' }
      ]
    },
    {
      hskLevel: 'HSK3',
      title: 'Câu chữ 把 (bǎ)',
      pattern: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (Bổ ngữ/了)',
      explanationVi: 'Biểu thị sự tác động của hành động lên tân ngữ xác định, làm tân ngữ thay đổi trạng thái, vị trí hoặc có kết quả cụ thể.',
      usageNotes: 'Tân ngữ sau 把 phải là đối tượng xác định (đã biết). Động từ không được đứng trơ trọi một mình mà phải có bổ ngữ hoặc 了 đi kèm.',
      commonMistakes: 'Sai: 我把书看。(X) -> Đúng: 我把书看完了。(O)',
      examples: [
        { chinese: '请把门关上。', pinyin: 'Qǐng bǎ mén guān shàng.', translation: 'Làm ơn đóng cửa lại giúp.' },
        { chinese: '他把作业做完了。', pinyin: 'Tā bǎ zuòyè zuò wán le.', translation: 'Anh ấy đã làm xong hết bài tập rồi.' }
      ]
    },
    {
      hskLevel: 'HSK3',
      title: 'Câu bị động với 被 (bèi)',
      pattern: 'Chủ ngữ (Người/vật bị tác động) + 被 (+ Tác nhân) + Động từ + Thành phần khác',
      explanationVi: 'Biểu thị chủ ngữ bị tác động và chịu một kết quả thường mang sắc thái không như ý hoặc bất ngờ.',
      usageNotes: 'Trong khẩu ngữ có thể thay 被 bằng 让 (ràng) hoặc 叫 (jiào).',
      commonMistakes: 'Động từ trong câu chữ 被 cũng không được đứng một mình.',
      examples: [
        { chinese: '我的手机被弟弟摔坏了。', pinyin: 'Wǒ de shǒujī bèi dìdi shuāi huài le.', translation: 'Điện thoại của tôi bị em trai làm rơi hỏng rồi.' },
        { chinese: '西瓜被大家吃光了。', pinyin: 'Xīguā bèi dàjiā chī guāng le.', translation: 'Dưa hấu đã bị mọi người ăn sạch sẽ rồi.' }
      ]
    },
    {
      hskLevel: 'HSK4',
      title: 'Cấu trúc nhấn mạnh thời gian/địa điểm 是...的',
      pattern: 'Chủ ngữ + 是 + [Thời gian/Địa điểm/Phương thức] + Động từ + 的',
      explanationVi: 'Sử dụng khi hành động ĐÃ XẢY RA, và người nói muốn nhấn mạnh vào THỜI GIAN, ĐỊA ĐIỂM, hoặc CÁCH THỨC thực hiện hành động đó.',
      usageNotes: 'Trong câu khẳng định, chữ 是 có thể lược bỏ, nhưng 的 ở cuối câu bắt buộc phải giữ.',
      commonMistakes: 'Không dùng cho hành động chưa xảy ra.',
      examples: [
        { chinese: '我们是去年在上海认识的。', pinyin: 'Wǒmen shì qùnián zài Shànghǎi rènshi de.', translation: 'Chúng tôi quen nhau ở Thượng Hải vào năm ngoái (nhấn mạnh thời gian và địa điểm).' },
        { chinese: '我是坐飞机来的。', pinyin: 'Wǒ shì zuò fēijī lái de.', translation: 'Tôi đến đây bằng máy bay (nhấn mạnh phương tiện).' }
      ]
    },
    {
      hskLevel: 'HSK5',
      title: 'Cấu trúc Không những... mà còn... 不但...而且...',
      pattern: 'Chủ ngữ + 不但/不仅 + Vế 1, 而且/并且 + Vế 2',
      explanationVi: 'Biểu thị quan hệ tăng tiến, bổ sung thêm ý nghĩa tích cực hoặc tiêu cực cho sự vật, hiện tượng.',
      usageNotes: 'Nếu 2 vế chung chủ ngữ thì chủ ngữ đứng trước 不但; nếu 2 vế khác chủ ngữ thì 不但 đứng trước chủ ngữ 1.',
      commonMistakes: 'Nhầm lẫn vị trí của chủ ngữ khi hai vế có 2 chủ thể khác nhau.',
      examples: [
        { chinese: '他不但中文说得很流利，而且还会写书法。', pinyin: 'Tā búdàn zhōngwén shuō de hěn liúlì, érqiě hái huì xiě shūfǎ.', translation: 'Anh ấy không những nói tiếng Trung lưu loát mà còn biết viết thư pháp.' }
      ]
    },
    {
      hskLevel: 'HSK6',
      title: 'Cấu trúc giả định đối lập 与其...不如... (Thà... còn hơn...)',
      pattern: '与其 + Phương án A, 不如 + Phương án B',
      explanationVi: 'Biểu thị qua sự so sánh và cân nhắc, người nói từ bỏ phương án A và lựa chọn phương án B vì thấy B hợp lý hơn.',
      usageNotes: 'Thường dùng trong các lập luận văn viết, nghị luận và bài thi đọc hiểu HSK 6.',
      commonMistakes: 'Dễ nhầm lẫn với 宁可...也不... (Thà A chứ dứt khoát không B).',
      examples: [
        { chinese: '与其坐在这里抱怨，不如立刻采取行动。', pinyin: 'Yǔqí zuò zài zhèlǐ bàoyuàn, bùrú lìkè cǎiqǔ xíngdòng.', translation: 'Thà rằng lập tức hành động còn hơn là ngồi đây than vãn.' }
      ]
    }
  ];

  for (const gp of grammarPoints) {
    const existing = await prisma.grammarPoint.findFirst({ where: { title: gp.title } });
    if (!existing) {
      await prisma.grammarPoint.create({
        data: {
          hskLevel: gp.hskLevel,
          title: gp.title,
          pattern: gp.pattern,
          explanationVi: gp.explanationVi,
          usageNotes: gp.usageNotes,
          commonMistakes: gp.commonMistakes,
          examples: {
            create: gp.examples
          }
        }
      });
    }
  }

  console.log('🎉 Seeded rich curriculum successfully!');
}

main().finally(() => prisma.$disconnect());
