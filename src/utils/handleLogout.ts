/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";
import { Dispatch } from "redux";
import { logout } from "@/redux/features/auth/authSlice";

export const logoutHandler = async (dispatch: Dispatch, router: any) => {
  try {
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
          <p class="text-sm text-gray-500">You’ve been signed out safely. See you again soon!</p>
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
    });

    if (result.isConfirmed) {
      await dispatch(logout());
      await Swal.fire({
        title: "Logged Out Successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-2xl p-6 shadow-md",
        },
      });
      await router.push("/auth/login");
    }
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Failed",
      text:
        (error as any)?.data?.success === false &&
        (error as any)?.data?.errorSources[0]?.message,
      showConfirmButton: true,
    });
  }
};
