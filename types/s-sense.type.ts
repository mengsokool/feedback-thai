export interface SSenseResponse {
  sentiment: Sentiment;
  intention: Intention;
  preprocess: Preprocess;
}

export interface Sentiment {
  score: string;
  "polarity-neg": boolean;
  "polarity-pos": boolean;
  polarity: string;
}

export interface Intention {
  request: string;
  sentiment: string;
  question: string;
  announcement: string;
}

export interface Preprocess {
  input: string;
  neg: any[];
  pos: string[];
  segmented: string[];
  keyword: string[];
}

export interface Associative {
  "ent-pos": any[];
  "polarity-neg": boolean;
  endIndex: number;
  "polarity-pos": boolean;
  beginIndex: number;
  text: string;
  "ent-neg": any[];
  asp: string[];
}
