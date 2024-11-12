class DomProcessor {
  getResources = (element: any, baseURI?: string) => {
    return { element, baseURI };
  };
  removeAttributes = (document: any) => {
    return document;
  };
  removeAttributesFromHtml = (html: string) => {
    return html;
  };
}

export default { DomProcessor };
