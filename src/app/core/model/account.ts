import {Sports} from "./sports";

export interface Account {
  id: string,
  username: string,
  password: string,
  name: string,
  email: string,
  favouriteSports: Sports[];
}
