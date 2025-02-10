import { SERVER_URL } from '../consts';
import { UserInterface, PUserInterface } from '../types/user.interface';

type DataFetching = UserInterface | PUserInterface
type Methods = 'POST' | 'GET'
type fetchingUserParams = {url: string; data?: DataFetching, bearer?: string; method?: Methods}

export const fetchingUser = async ({
  url,
  data,
  bearer,
  method
}: fetchingUserParams) => {
  return fetch(`${SERVER_URL}/${url}`, {
    ...(data !== undefined && { body: JSON.stringify(data) }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...(bearer && { Bearer: `${bearer}` })
    },
    ...(method && { method }),
  })
}