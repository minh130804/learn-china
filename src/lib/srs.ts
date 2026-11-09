/**
 * SuperMemo 2 (SM-2) Algorithm for Spaced Repetition Flashcards
 * Rating:
 * 1 = Blackout / Again (Forgot completely)
 * 2 = Hard (Remembered with difficulty)
 * 3 = Good (Remembered with slight hesitation)
 * 4 = Easy (Instant recall)
 */
export function calculateSM2(
  rating: number, // 1 to 4
  currentRepetition: number,
  currentInterval: number,
  currentEaseFactor: number
) {
  let repetition = currentRepetition;
  let interval = currentInterval;
  let easeFactor = currentEaseFactor;

  // Grade mapped to standard SM-2 0-5 scale
  // rating 1 -> grade 0, rating 2 -> grade 3, rating 3 -> grade 4, rating 4 -> grade 5
  const gradeMap: Record<number, number> = {
    1: 0,
    2: 3,
    3: 4,
    4: 5,
  };
  const q = gradeMap[rating] ?? 3;

  if (q >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    repetition,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    dueDate,
    state: q < 3 ? 'LEARNING' : 'REVIEW',
  };
}

