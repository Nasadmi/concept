export interface UserInterface {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export type PUserInterface = Partial<UserInterface>