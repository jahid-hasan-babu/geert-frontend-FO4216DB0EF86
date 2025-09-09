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
        if (htmlElement.parentNode) {
          htmlElement.parentNode.removeChild(htmlElement);
        }
      } catch {
        // Silently ignore removal errors
      }
    });

    // Reset body styles that Google Translate might have modified
    document.body.style.top = '';
    document.body.style.position = '';
  } catch {
    // Silently handle any cleanup errors
  }
};

export const logoutHandler = async (
  dispatch: Dispatch
): Promise<void> => {
  try {
    // Clean up Google Translate elements before showing SweetAlert
    cleanupGoogleTranslate();

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
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Ready to Log Out?</h2>
          <p class="text-sm text-gray-500">You've been signed out safely. See you again soon!</p>
        </div>
      `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        popup: "rounded-2xl p-6 shadow-md ml-2",
        confirmButton:
          "bg-[#37A3E4] hover:bg-[#3294CF] text-white px-6 py-2 rounded-full font-medium mr-3 cursor-pointer",
        cancelButton:
          "bg-[#E5F3FC] hover:bg-[#C1E2F7] text-gray-700 px-6 py-2 rounded-full font-medium cursor-pointer",
      },
      buttonsStyling: false,
      // Prevent DOM issues with Google Translate
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (result.isConfirmed) {
      // Clean up again before proceeding
      cleanupGoogleTranslate();

      // Clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferred-language"); // Also clear language preference

      // Dispatch logout
      await dispatch(logout());

      // Clear Google Translate cookies to prevent issues on next login
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      if (window.location.hostname !== "localhost") {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }

      // Show success message with shorter timer to prevent DOM conflicts
      await Swal.fire({
        title: "Logged Out Successfully!",
        icon: "success",
        timer: 1000, // Reduced timer
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl p-6 shadow-md",
        },
        allowOutsideClick: false,
      });

      // Force page refresh to clear any Google Translate DOM modifications
      // then redirect to login
      window.location.href = "/auth/login";
    }
  } catch {
    console.error("Logout error occurred");
    
    // Even if there's an error, try to complete the logout
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("preferred-language");
      await dispatch(logout());
      
      // Force redirect even if SweetAlert fails
      window.location.href = "/auth/login";
    } catch {
      // Last resort: just reload the page
      window.location.reload();
    }
  }
};