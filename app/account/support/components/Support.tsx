"use client";

import Icon from "@/app/components/atoms/common/Icon/Icon";
import { ContactLinks } from "@/app/components/common/ContactLinks";
import { TELEGRAM_TECHNICAL_SUPPORT } from "@/app/constants/socialConnections";
import Link from "next/link";

export function Support() {
  return (
    <div className="w-full max-w-xl flex flex-col gap-6 ">
      <h2 className="text-2xl font-head font-semibold ">Нужна помощь 🆘 ?</h2>
      <div>
        <p className="font-head text-lg">
          Вы можете обратиться ко мне c вопросами по ссылкам внизу:
        </p>
        <ContactLinks className="flex gap-5" />
      </div>
      <div className="flex flex-col items-start">
        <p>
          Если у вас возник технический вопрос или вы заметили какие-то проблемы
          в работе сайта, пожалуйста обратитесь в техническую поддержку в
          телеграмм канал:
        </p>
        <Link
          target="_blank"
          href={TELEGRAM_TECHNICAL_SUPPORT}
          className="flex items-center gap-2 text-purple font-semibold"
        >
          Техническая поддержка
          <Icon
            inline
            name="account/technical-support.svg"
            size={30}
            color="purple"
          />
        </Link>
      </div>
    </div>
  );
}
