import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// GET all exams with questions and student's exam status
router.get('/', async (req, res) => {
  try {
    // Get the student ID from the authenticated request
    const studentId = req.userId
    
    // Fetch all exams with their questions
    const exams = await prisma.exams.findMany({
      include: {
        questions: {
          select: {
            id: true,
            question_text: true,
            option_a: true,
            option_b: true,
            option_c: true,
            option_d: true,
            option_e: true,
            correct_answer: true,
            question_stem: true
          }
        }
      }
    })
    
    // Get student's exam status (which exams they've taken)
    const studentExams = await prisma.student_exams.findMany({
      where: {
        student_id: studentId
      },
      select: {
        exam_id: true,
        correct_count: true,
        wrong_count: true
      }
    })
    
    // Create a map of taken exams for easier lookup
    const takenExamsMap = {}
    studentExams.forEach(exam => {
      takenExamsMap[exam.exam_id] = {
        correct_count: exam.correct_count,
        wrong_count: exam.wrong_count
      }
    })
    
    // Add student's status to each exam
    const examsWithStatus = exams.map(exam => {
      const stats = takenExamsMap[exam.id] || null;
      let enhancedStats = null;
      
      if (stats) {
        const totalAnswered = stats.correct_count + stats.wrong_count;
        const totalQuestions = exam.questions.length;
        const emptyCount = totalQuestions - totalAnswered;
        
        enhancedStats = {
          ...stats,
          empty_count: emptyCount >= 0 ? emptyCount : 0 // Ensure it's not negative
        };
      }
      
      return {
        ...exam,
        taken: exam.id in takenExamsMap,
        stats: enhancedStats
      }
    })
    
    res.json(examsWithStatus)
  } catch (error) {
    console.error("Error fetching exams:", error)
    res.status(500).json({ message: "Failed to fetch exams" })
  }
})

router.post('/submit-answers', async (req, res) => {
  try {
    const studentId = req.userId;
    const { examId, answers } = req.body;
    
    if (!examId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    
    // Validate answers before processing
    const validAnswers = answers.filter(answer => 
      answer.questionId && 
      answer.selectedAnswer && 
      typeof answer.selectedAnswer === 'string' && 
      answer.selectedAnswer.trim() !== ''
    );
    
    if (validAnswers.length === 0) {
      return res.status(400).json({ message: "No valid answers provided" });
    }
    
    // Öğrencinin cevaplarını işleme
    const processAnswersPromises = validAnswers.map(async (answer) => {
      // Ensure that selectedAnswer is a valid, non-empty string
      const selectedAnswer = answer.selectedAnswer.trim();
      
      // Öğrencinin bu soru için daha önce cevabı var mı kontrol et
      const existingAnswer = await prisma.student_answers.findFirst({
        where: {
          student_id: studentId,
          exam_id: examId,
          question_id: answer.questionId
        }
      });

      // Eğer varsa güncelle, yoksa yeni kayıt oluştur
      if (existingAnswer) {
        return prisma.student_answers.update({
          where: { id: existingAnswer.id },
          data: {
            selected_answer: selectedAnswer,
            is_correct: answer.isCorrect
          }
        });
      } else {
        return prisma.student_answers.create({
          data: {
            student_id: studentId,
            exam_id: examId,
            question_id: answer.questionId,
            selected_answer: selectedAnswer,
            is_correct: answer.isCorrect
          }
        });
      }
    });
    
    await Promise.all(processAnswersPromises);
    
    // Öğrencinin sınav sonuçlarını hesaplayalım
    const correctCount = validAnswers.filter(answer => answer.isCorrect).length;
    const wrongCount = validAnswers.length - correctCount;
    
    // Öğrencinin mevcut sınav kaydını kontrol edelim
    const existingStudentExam = await prisma.student_exams.findFirst({
      where: {
        student_id: studentId,
        exam_id: examId
      }
    });
  
    // Mevcut kayıt varsa güncelle, yoksa yeni kayıt oluştur
    if (existingStudentExam) {
      await prisma.student_exams.update({
        where: { id: existingStudentExam.id },
        data: {
          correct_count: correctCount,
          wrong_count: wrongCount
        }
      });
    } else {
      await prisma.student_exams.create({
        data: {
          student_id: studentId,
          exam_id: examId,
          correct_count: correctCount,
          wrong_count: wrongCount,
        },
      });
    }
      
    res.status(201).json({ 
      message: "Exam answers submitted successfully",
      stats: {
        correctCount,
        wrongCount
      }
    });
  } catch (error) {
    console.error("Error submitting exam answers:", error);
    res.status(500).json({ message: "Failed to submit exam answers" });
  }
});

// GET specific exam with questions and student's answers
router.get('/:examId', async (req, res) => {
  try {
    const studentId = req.userId; // authMiddleware'den alınan öğrenci ID'si
    const examId = parseInt(req.params.examId);
    
    if (isNaN(examId)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }
    
    // Sınavı ve sorularını getir
    const exam = await prisma.exams.findUnique({
      where: {
        id: examId
      },
      include: {
        questions: {
          select: {
            id: true,
            topic: true,
            difficulty_level: true,
            question_text: true,
            option_a: true,
            option_b: true,
            option_c: true,
            option_d: true,
            option_e: true,
            correct_answer: true,
            solution_explanation: true,
            question_stem: true
          }
        }
      }
    });
    
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    
    // Öğrencinin bu sınavdaki soruları için verdiği cevapları getir
    const studentAnswers = await prisma.student_answers.findMany({
      where: {
        student_id: studentId,
        exam_id: examId
      },
      select: {
        question_id: true,
        selected_answer: true,
        is_correct: true
      }
    });
    
    // Öğrenci cevaplarını hızlı erişim için map'e dönüştür
    const answersMap = {};
    studentAnswers.forEach(answer => {
      answersMap[answer.question_id] = {
        selected_answer: answer.selected_answer,
        is_correct: answer.is_correct
      };
    });
    
    // Topic enum değerlerini insan-okunabilir formata çevirme fonksiyonu
    const formatTopicName = (topicEnum) => {
      const topicMap = {
        'C_mlede_Anlam': 'Cümlede Anlam',
        'S_zc_kte_Anlam': 'Sözcükte Anlam',
        'Dil_Bilgisi': 'Dil Bilgisi',
        'Noktalama___aretleri': 'Noktalama İşaretleri',
        'Paragrafta_Anlam': 'Paragrafta Anlam',
        'Ses_Bilgisi': 'Ses Bilgisi',
        'Yaz_m_Kurallar_': 'Yazım Kuralları'
      };
      return topicMap[topicEnum] || topicEnum;
    };
    
    // Sorulara öğrenci cevaplarını ekleyelim ve topic değerlerini formatla
    const questionsWithStudentAnswers = exam.questions.map(question => {
      const studentAnswer = answersMap[question.id] || null;
      
      return {
        ...question,
        topic: formatTopicName(question.topic),
        student_answer: studentAnswer ? studentAnswer.selected_answer : null,
        is_correct: studentAnswer ? studentAnswer.is_correct : null
      };
    });
    
    // Sonuçları döndür
    res.json({
      id: exam.id,
      title: exam.title,
      questions: questionsWithStudentAnswers
    });
    
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ message: "Failed to fetch exam" });
  }
});

export default router