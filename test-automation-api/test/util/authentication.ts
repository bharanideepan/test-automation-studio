import { faker } from "@faker-js/faker";
import { User } from "../../src/models/interface/user";
import jwtService from "../../src/services/util/jwt.service";

export const getAuthToken = async () => {
  const user: User = {
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    picture: faker.image.avatar(),
  };
  const { access_token } = jwtService.getUserTokens(user);
  return access_token;
};
