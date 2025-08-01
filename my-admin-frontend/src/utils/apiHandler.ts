export const apiHandler = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      console.error("API Error:", message);
      throw new Error(message);
    }
  };
  