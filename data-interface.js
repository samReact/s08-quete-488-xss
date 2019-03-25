const uuidv4 = require('uuid/v4');

const USERS = [
  {
    username: 'randombrandon',
    password: 'randompassword',
  },
  {
    username: 'whateverkimber',
    password: 'whateverpassword',
  },
];

const seedUsers = () => {
  cache.put('users', USERS);
};

const findUser = username => {
  return cache.get('users').find(user => user.username === username);
};

const createMessage = (username, content, personalWebsiteURL) => {
  const newMessage = {
    id: uuidv4(),
    username,
    content,
    personalWebsiteURL,
  };
  cache.put('messages', getMessages().concat(newMessage));
  return;
};

const getMessages = () => {
  return cache.get('messages') || [];
};

module.exports = {
  createMessage,
  findUser,
  getMessages,
  seedUsers,
};
