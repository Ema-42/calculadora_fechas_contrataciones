import { showToast } from "nextjs-toast-notify";

export const notifyError = (msg: string) => {
  showToast.error(msg, {
    duration: 2000,
    progress: true,
    position: "top-right",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
};

export const notifySuccess = (msg: string) => {
  showToast.success(msg, {
    duration: 2000,
    progress: true,
    position: "top-right",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
};
