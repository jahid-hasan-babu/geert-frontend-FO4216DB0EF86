/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

interface HandleAsyncWithToastOptions {
  asyncCallback: () => Promise<any>;
  loadingMessage: string;
  translateBatch: (texts: string[], target: string) => Promise<string[]>;
  targetLanguage: string;
  successMessage?: string;
  errorMessage?: string;
  isShowToast?: boolean;
}

export const handleAsyncWithToast = async ({
  asyncCallback,
  loadingMessage,
  translateBatch,
  targetLanguage,
  successMessage,
  errorMessage,
  isShowToast = true,
}: HandleAsyncWithToastOptions) => {
  let toastInit: string | number | undefined;

  if (isShowToast) {
    const [tLoading] = await translateBatch([loadingMessage], targetLanguage);
    toastInit = toast.loading(tLoading || "Loading...");
  }

  try {
    const res = await asyncCallback();

    if (res?.data?.success) {
      const msg = res.data.message || successMessage || "Success";
      const [tMsg] = await translateBatch([msg], targetLanguage);
      toast.success(tMsg, { id: toastInit });
    }

    if (res?.message) {
      const [tMsg] = await translateBatch([res.message], targetLanguage);
      toast.success(tMsg, { id: toastInit });
    }

    if (!res?.data?.success && res?.error?.data?.message) {
      const [tErr] = await translateBatch([res.error.data.message], targetLanguage);
      toast.error(tErr, { id: toastInit });
    }

    return res;
  } catch (error) {
    const msg = (error as any)?.message || errorMessage || "Something went wrong";
    const [tMsg] = await translateBatch([msg], targetLanguage);
    toast.error(tMsg, { id: toastInit });
    throw error;
  } finally {
    setTimeout(() => {
      toast.dismiss(toastInit);
    }, 3500);
  }
};
