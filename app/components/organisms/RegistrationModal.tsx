import { UserLoginBody } from "@/models/users";
import { toggleLoginModal } from "@/store/authentication";
import { useLoginMutation } from "@/store/features/api/subApi/userApi";
import { useAppDispatch } from "@/store/store";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../atoms/common/Button";
import { Form } from "../common/Form";
import { ModalProps } from "../common/Modal/Modal";
import { EmailInput } from "../molecules/inputs/EmailInput";
import { PasswordInput } from "../molecules/inputs/PasswordInput";
import { ModalHalfImage } from "../templates/ModalHalfImage";
import { UserRegistrationForm } from "../molecules/authenticationFlow/UserRegistrationForm";

type FormValues = UserLoginBody;

interface Props extends ModalProps {
  email?: UserLoginBody["email"];
  onSuccess?: () => void;
}

export function RegistrationModal({ email = "", onSuccess, ...props }: Props) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(() => ({ email }), [email]);

  return (
    <ModalHalfImage {...props}>
      <UserRegistrationForm />
    </ModalHalfImage>
  );
}
