import { SERVER_URL } from '../consts';
import { UserInterface, PUserInterface } from '../types/user.interface';
import { MkmType, PMkmType } from '../types/markmap.interface';

type DataFetching = UserInterface | PUserInterface
type Methods = 'POST' | 'GET'
type fetchingUserParams = { url: string; data?: DataFetching, bearer?: string; method?: Methods }
type fetchingMarkmapParams = { url: string; data?: MkmType | PMkmType; bearer?: string; method?: Methods }

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

export const fetchingMarkmap = async ({
  url,
  data,
  bearer,
  method
}: fetchingMarkmapParams) => {
  return fetch(`${SERVER_URL}/markmap/${url}`, {
    ...(data !== undefined && { body: JSON.stringify(data) }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...(bearer && { Bearer: `${bearer}` })
    },
    ...(method && { method }),
  })
}