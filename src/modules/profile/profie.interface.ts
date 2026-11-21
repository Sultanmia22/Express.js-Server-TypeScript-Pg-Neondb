// src/types/profile.types.ts

export interface IProfile {
  id: string;              // UUID
  user_id: string;         // UUID - Foreign Key (users.id)
  bio: string | null;      // TEXT
  address: string | null;  // TEXT
  phone: string | null;    // VARCHAR(15)
  gender: string | null;   // VARCHAR(15)
  created_at: Date;        // TIMESTAMP
  updated_at: Date;        // TIMESTAMP
}

export interface ICreateProfile {
  user_id: string;
  bio?: string | null;
  address?: string | null;
  phone?: string | null;
  gender?: string | null;
}


export interface IUpdateProfile {
  bio?: string | null;
  address?: string | null;
  phone?: string | null;
  gender?: string | null;
}