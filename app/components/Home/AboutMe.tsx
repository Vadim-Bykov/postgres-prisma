import React from "react";

export function AboutMe() {
  return (
    <section>
      <h2 className="text-3xl font-semibold mb-1">Обо мне:</h2>
      <p className="text-lg mb-3">
        Меня зовут <span className="font-semibold">Татьяна</span>. Я -{" "}
        <span className="font-semibold">астролог</span> по финансам +
        <span className="font-semibold">профориентолог</span>.
      </p>

      <div className="text-lg italic">
        <p>
          Я помогаю клиенту профессионально реализовать себя и найти нишу,
          которая будет приносить деньги.
        </p>
        <p>
          Специализируюсь на поиске карьеры для Вас. Мое дело- рассказать
          клиенту о его профессиональных способностях, помогаю выбрать нишу для
          карьеры, которая поможет зарабатывать ДЕНЬГИ
        </p>
        <p>
          Наша жизнь - идет в динамике, она не стоит на месте. и только в наших
          силах: идти в рост или катиться вниз.
        </p>
      </div>
    </section>
  );
}
