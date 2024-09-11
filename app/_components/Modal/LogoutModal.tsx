import { useLogoutMutation } from "@/store/features/api/subApi/userApi";
import Button from "../common/Button/Button";
import { Modal, ModalProps } from "./Modal";
import { cn } from "@/utils/css";

interface Props extends ModalProps {
  onSuccess?: () => void;
}

export function LogoutModal({ onSuccess, ...props }: Props) {
  const [logout, { isLoading: isLogouting }] = useLogoutMutation();

  const onLogout = async () => {
    await logout().unwrap();
    onSuccess?.();
  };

  return (
    <Modal
      className={{
        base: cn(
          "flex justify-center items-center",
          "p-10 lg:p-20 sm:w-[390px]",
          "w-[70%] box-content overflow-hidden"
        ),
      }}
      withCloseIcon
      {...props}
    >
      <h2 className="font-head text-2xl font-semibold text-center mb-5">
        Ты действительно хочешь выйти из аккаунта?
      </h2>

      <div className="flex flex-grow justify-center">
        <Button disabled={isLogouting} loading={isLogouting} onClick={onLogout}>
          Выйти из аккаунта
        </Button>
      </div>
    </Modal>
  );
}
