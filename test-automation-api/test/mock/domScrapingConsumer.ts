class DomScraping {
  getScrambledHtml = (htmlText: string, recording_id: string) => {
    return htmlText + recording_id;
  };
}

export default { DomScraping };
