export interface MkmType {
  id: string;
  name: string;
  code?: string;
  public: 0 | 1;
  stars: number;
  created_at: string;
  updated_at: string;
  user: {
    username: string;
  }
}

export type PMkmType = Partial<MkmType>

export type QMkmType = Pick<MkmType, 'created_at' | 'updated_at' | 'id' | 'name' | 'public' | 'stars' | 'user'>