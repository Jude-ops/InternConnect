const users = []

//Add user
export const addUser = ({ id, internID, companyID }) => {

  internID = internID.trim().toLowerCase();
  companyID = companyID.trim().toLowerCase();

  //Check if user already exists
  const existingUser = users.find((user) => user.companyID === companyID && user.internID === internID);

  if (existingUser) {
    return { error: 'User already exists' };
  }

  const user = { id, internID, companyID };
  users.push(user);

  return { user };
}

//Remove User
export const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Get User
export const getUser = (id) => users.find((user) => user.id === id);

//Get Users in Room
export const getUsersInRoom = (companyID) => users.filter((user) => user.companyID === companyID);
