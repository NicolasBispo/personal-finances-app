import { AxiosResponse } from "axios";

export interface User {
  id: number;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export type AuthResponse = AxiosResponse<User> & {
  headers: {
    authorization: string;
  };
};
