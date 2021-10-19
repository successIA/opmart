export const getInitials = (user) => {
  return (
    user.last_name ? user.first_name[0] + user.last_name[0] : user.first_name[0]
  ).toUpperCase();
};

export const getName = (user) => {
  return user.last_name ? user.first_name + user.last_name : user.first_name;
};
