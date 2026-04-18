export type TriviaQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact?: string;
  emoji?: string;
};
