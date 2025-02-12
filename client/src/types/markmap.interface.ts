export interface MkmType {
  id: string;
  name: string;
  code?: string;
  public: 0 | 1;
  stars: number;
  created_at: Date;
  updated_at: Date;
}

export type PMkmType = Partial<MkmType>