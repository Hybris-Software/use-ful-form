const formatUsername = (value) => {
  return value.toLowerCase().replace(/[^a-z0-9\_\.]/g, "");
};

export default formatUsername;
