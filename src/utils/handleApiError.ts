import axios from "axios";
//import Toast from "react-native-toast-message";

const prettifyTitle = (title: string): string => {
  if (!title) return title;
  const looksLikeSlug = /^[a-z0-9]+([-_][a-z0-9]+)+$/i.test(title);
  if (!looksLikeSlug) return title;

  return title
    .split(/[-_]/)
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
};

export const handleAPIWithValidationErrors = (
  err: unknown,
  onFailed?: (err: unknown) => void,
) => {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data;

    console.log("Error: ", JSON.stringify(responseData));

    if (!responseData.succes) {
      if (onFailed) onFailed(responseData);

      return;
    }

    if (responseData.status === 400) {
      // Toast.show({ type: "error", text1: responseData.title, text2: "" });
      return;
    }

    // if (err.request) {
    //   console.log("No response received:", JSON.stringify(err.request));
    // }
    // console.log("response received:", JSON.stringify(responseData));

    if (responseData?.error && typeof responseData.error === "object") {
      const { message, details } = responseData.error as {
        code?: string;
        message?: string;
        details?: string[];
      };

      const text2 =
        Array.isArray(details) && details.length > 0
          ? details[0]
          : (message ?? "An unknown error occurred, please try again");

      //Toast.show({ type: "error", text1: "Error occurred", text2 });
      if (onFailed) onFailed(err);
      return text2;
    }

    if (responseData?.message && typeof responseData.message === "string") {
      const text2 = responseData.message;
      //Toast.show({ type: "error", text1: "Error occurred", text2 });
      if (onFailed) onFailed(err);
      return text2;
    }

    if (Array.isArray(responseData?.errors)) {
      const text2 =
        responseData.errors[0]?.message ??
        "An unknown error occurred, please try again";
      //Toast.show({ type: "error", text1: "Error occurred", text2 });
      if (onFailed) onFailed(err);
      return text2;
    }

    if (responseData?.detail || responseData?.title) {
      const text2 =
        (typeof responseData.detail === "string" && responseData.detail) ||
        prettifyTitle(responseData?.title) ||
        "An unknown error occurred, please try again";

      //Toast.show({ type: "error", text1: "Error occurred", text2 });
      if (onFailed) onFailed(err);
      return text2;
    }

    const fallback =
      typeof responseData === "string"
        ? responseData
        : "An unknown error occurred, please try again";
    //Toast.show({ type: "error", text1: "Error occurred", text2: fallback });
    if (onFailed) onFailed(err);
    return fallback;
  }

  if (err instanceof Error) {
    const message =
      err.message || "An unknown error occurred, please try again";
    //Toast.show({ type: "error", text1: "Error occurred", text2: message });
    if (onFailed) onFailed(err);
    return message;
  }

  const fallback = "An unknown error occurred, please try again";
  //Toast.show({ type: "error", text1: "Error occurred", text2: fallback });
  if (onFailed) onFailed(err);
  return fallback;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
