class S3uploader {
  uploadFile = (key: any, body: any, contentType: any) => {
    return new Promise((resolve) => {
      resolve({ key, body, contentType });
    });
  };
  getObjectList = async () => {
    const data = {
      Contents: [{
        Size: 1,
        Key: 'downloads/csv-file.csv'
      }]
    };
    return new Promise((resolve) => {
      resolve(data);
    });
  };
  uploadZipToS3 = async (fileId: any, fileContent: string) => {
    return new Promise((resolve) => {
      resolve(fileId);
    });
  };
  processDesktopEvent = async (data: any, workFlowId: string, fileId: string, params: any) => {
    return new Promise((resolve) => {
      resolve({ workFlowId });
    });
  };
}

export default { S3uploader };
