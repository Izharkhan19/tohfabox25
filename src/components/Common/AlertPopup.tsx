// src/utils/sweetAlertUtils.ts
// import Swal, { type SweetAlertOptions } from "sweetalert2";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Create a SweetAlert instance with React content support
// This is useful if you ever want to put React components inside your alerts
const MySwal = withReactContent(Swal);

export const DeleteConfirmation = async () => {
  MySwal.fire({
    title: "Do you want to delete this item ?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
    icon: "question",
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
      // Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      return false;
      Swal.fire("Changes are not saved", "", "info");
    }
  });
};
