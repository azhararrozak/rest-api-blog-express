export const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

export const adminOnly = (req, res) => {
  res.status(200).send("Admin Content.");
};
