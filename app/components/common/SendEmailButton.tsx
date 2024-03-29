import Button from "@/app/components/atoms/common/Button";
import {
  useSendArticleEmailMutation,
  useSendConsultationEmailMutation,
} from "@/store/features/api/subApi/emailApi";
import { useAppSelector } from "@/store/store";
import clsx from "clsx";
import { useParams } from "next/navigation";
import React from "react";

export function SendEmailButton({
  target,
}: {
  target: "newArticle" | "newConsultation";
}) {
  const { id } = useParams();
  const [
    sendArticleEmail,
    {
      isLoading: isArticleEmailSending,
      isError: isArticleEmailError,
      isSuccess: isArticleEmailSuccess,
      error: articleEmailError,
      data: articleEmailData,
    },
  ] = useSendArticleEmailMutation();

  const [
    sendConsultationEmail,
    {
      isLoading: isConsultationEmailSending,
      isError: isConsultationEmailError,
      isSuccess: isConsultationEmailSuccess,
      error: consultationEmailError,
      data: consultationEmailData,
    },
  ] = useSendConsultationEmailMutation();

  const role = useAppSelector((state) => state.user.userData?.role);

  if (role !== "ADMIN") {
    return null;
  }

  const onClick = () => {
    if (target === "newArticle") {
      sendArticleEmail({ articleId: +id });
    } else if (target === "newConsultation") {
      sendConsultationEmail({ consultationId: +id });
    }
  };

  return (
    <div>
      <Button
        onClick={onClick}
        disabled={isArticleEmailSending || isConsultationEmailSending}
        loading={isArticleEmailSending || isConsultationEmailSending}
      >
        Отправить уведомление пользователям о новой{" "}
        {target === "newArticle" ? "статье" : "консультации"}
      </Button>
      {(isArticleEmailError ||
        isConsultationEmailError ||
        isArticleEmailSuccess ||
        isConsultationEmailSuccess) && (
        <p
          className={clsx(
            "font-medium",
            isArticleEmailError || isConsultationEmailError
              ? "text-pink"
              : "text-purple"
          )}
        >
          {articleEmailData?.message ||
            consultationEmailData?.message ||
            // @ts-ignore
            articleEmailError?.data?.message ||
            // @ts-ignore
            consultationEmailError?.data?.message ||
            "Error"}
        </p>
      )}
    </div>
  );
}
