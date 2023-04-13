import type {User} from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {

  const name = user.username ? user.username : user.firstName + " " + user.lastName;

  return {
    id: user.id, 
    username: name, 
    profileImageUrl: user.profileImageUrl
  };
}

