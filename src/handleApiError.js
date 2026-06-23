// APIエラーを受け取るjs

export const handleApiError = (error) => {
  const errorData = error?.response?.data;

  let message = "通信に失敗しました。時間を置いて再度お試しください。";

  if (errorData && errorData.code) {
    message = errorData.message;
  }

  alert(message);
};

export default handleApiError;
