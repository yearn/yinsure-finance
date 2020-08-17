import index from "./index";
const env = process.env.APP_ENV || 'index';

const config = {
  index,
};

export default config[env];
