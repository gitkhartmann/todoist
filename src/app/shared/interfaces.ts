export interface ITask {
    id?: string | number;
    priority: string;
  range: {
    end: string;
    start: string;
    };
    category: string;
  description: string;
}
  
export interface IFbCreateResponse {
  name?: string;
}

export interface FBAuthResponse {
  idToken: string;
  expiresIn: string;
}

export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
  displayName?: string;

}

export interface IAlert {
  type: string
  text: string
}