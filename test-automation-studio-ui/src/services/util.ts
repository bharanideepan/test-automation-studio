import io from "socket.io-client";

const EXTENSION_ID = process.env.REACT_APP_EXTENSION_ID ?? "";
type RequestBody = {
  action: "LOGIN" | "LOGOUT";
  payload?: { refreshToken?: string; accessToken?: string; flowId?: string };
};

const URL = 'http://localhost:3030';
export const socket = io(URL);

export const sendMessageToExtension = (request: RequestBody) => {
  try {
    try {
      const socket = io("http://localhost:5000");
      socket.emit("authenticate", { auth: request.payload?.accessToken });
      socket.on("connect_error", () => {
        socket.close();
      });
    } catch (error) {
      console.log(error);
    }

    chrome.runtime.sendMessage(EXTENSION_ID, request, (response) => {
      if (response && response.success) {
        console.log("Success ::: ", response);
      } else {
        console.log("Error sending message", response);
      }
    });
  } catch (error) {
    throw new Error(
      "Check whether the Emulator-web extension is added to your chrome browser"
    );
  }
};
