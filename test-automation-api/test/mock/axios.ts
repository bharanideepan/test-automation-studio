const axios = {
  get: (url: string) => {
    return new Promise((resolve) => {
      resolve({ data: url });
    });
  }
};

export default axios;
