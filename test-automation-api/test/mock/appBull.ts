const AppBull = {
  getQueueByName: () => {
    return {
      add: (data: any, opts?: any) => {
        return new Promise((resolve) => {
          resolve(data);
        });
      },
      process: (job: any) => {
        return job;
      },
      on: (status: any, callback: any) => {
        if (!status) callback();
      },
    };
  }
};

export default { AppBull };
