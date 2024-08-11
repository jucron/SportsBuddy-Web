import {Sports} from "./sports";

export interface Account {
  username: string;
  password: string;
  name: string;
  email: string;
  favouriteSports: Sports[];
}
