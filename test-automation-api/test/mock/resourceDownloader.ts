class ResourceDownloader {
  downloadResource = (url: string) => {
    if (url.indexOf('text/css') > -1) {
      return new Promise((resolve) => {
        resolve({ uploadContent: '', contentType: 'text/css' });
      });
    } else {
      return new Promise((resolve) => {
        resolve({ uploadContent: '', contentType: 'plaintext' });
      });
    }
  };
}

export default { ResourceDownloader };
