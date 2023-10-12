"use client";

import { useCreateUserMutation } from "@/store/features/api/apiSlice";
import { useForm } from "react-hook-form";
import { EmailInput } from "../molecules/inputs/EmailInput";
import { NameInput } from "../molecules/inputs/NameInput";

type FormValues = {
  email: string;
  firstName: string;
};

export function UserRegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [createUser] = useCreateUserMutation();

  const onSubmit = handleSubmit(async ({ email, firstName }) => {
    await createUser({
      email,
      name: firstName,
      id: 1,
      image: "",
      role: "USER",
    });

    reset();
  });

  console.log({ errors });

  return (
    <section className="mb-10 flex justify-center">
      <form onSubmit={onSubmit}>
        <EmailInput error={errors.email?.message} register={register} />
        <br />
        <NameInput
          variant="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}
