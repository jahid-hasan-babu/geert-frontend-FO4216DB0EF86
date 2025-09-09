/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";
import { Dispatch } from "redux";
import { logout } from "@/redux/features/auth/authSlice";

// Helper function to safely clean up Google Translate elements before logout
const cleanupGoogleTranslate = (): void => {
  try {
    const googleElements = document.querySelectorAll(
      '.goog-te-banner-frame, .goog-te-ftab, .goog-te-balloon-frame, iframe[src*="translate.googleapis.com"]'
    );

    googleElements.forEach((element: Element) => {
      try {
        const htmlElement = element as HTMLElement;
        if (htmlElement.parentNode) htmlElement.parentNode.removeChild(htmlElement);
      } catch {
        // silently ignore
      }
    });

    document.body.style.top = '';
    document.body.style.position = '';
  } catch {
    // silently ignore
  }
};

export const logoutHandler = async (dispatch: Dispatch): Promise<void> => {
  try {
    cleanupGoogleTranslate();

    // Get selected language from localStorage
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

    // Set text manually based on language
    const texts = {
      en: {
        title: "Ready to Log Out?",
        message: "You've been signed out safely. See you again soon!",
        confirm: "Yes",
        cancel: "No",
        success: "Logged Out Successfully!",
      },
      nl: {
        title: "Klaar om uit te loggen?",
        message: "U bent veilig uitgelogd. Tot ziens!",
        confirm: "Ja",
        cancel: "Nee",
        success: "Succesvol uitgelogd!",
      },
    };

    const t = texts[selectedLanguage as keyof typeof texts] || texts.en;

    const result = await Swal.fire({
      html: `
        <div class="flex flex-col items-center text-center font-sans">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#A3D5F3] via-[#37A3E4] to-[#3294CF] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">${t.title}</h2>
          <p class="text-sm text-gray-500">${t.message}</p>
        </div>
      `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
      customClass: {
        popup: "rounded-2xl p-6 shadow-md ml-2",
        confirmButton:
          "bg-[#37A3E4] hover:bg-[#3294CF] text-white px-6 py-2 rounded-full font-medium mr-3 cursor-pointer",
        cancelButton:
          "bg-[#E5F3FC] hover:bg-[#C1E2F7] text-gray-700 px-6 py-2 rounded-full font-medium cursor-pointer",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (result.isConfirmed) {
      cleanupGoogleTranslate();

      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferred-language");
      localStorage.removeItem("selectedLanguage");

      // Dispatch logout
      await dispatch(logout());

      // Clear Google Translate cookies
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      if (window.location.hostname !== "localhost") {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }

      // Show success message
      await Swal.fire({
        title: t.success,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl p-6 shadow-md" },
        allowOutsideClick: false,
      });

      window.location.href = "/auth/login";
    }
  } catch {
    console.error("Logout error occurred");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferred-language");
      localStorage.removeItem("selectedLanguage");
      await dispatch(logout());
      window.location.href = "/auth/login";
    } catch {
      window.location.reload();
    }
  }
};
