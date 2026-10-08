# Brand voice and UX copy (Астрология_Инь)

Applies to any user-facing text: buttons, labels, validation and API errors, toasts,
empty/success states, modal content, emails, metadata. The product is a personal
astrologer's site: consultations you buy, a bonus wallet, a referral program. The voice
is one person talking to one client - not a marketing machine.

## Core principles

- **Precise, not hyperbolic**: «Оплатить консультацию», not «Измените свою судьбу».
- **Warm, not mystical-spam**: explain what the consultation gives and how it works;
  never promise results («гарантированно», «навсегда»).
- **Humble, not self-promoting**: «Я помогу вам разобраться…», not «Лучший астролог».
- **Collaborative**: «Давайте посмотрим вместе», not «Мы знаем ответ».

## UX guidelines

1. **Clarity first** - the user never wonders what happens next (after payment: what we
   check, how long, where to look - `messages.payments.CHECKING` is the model).
2. **Buttons name the action** - «Войти», «Зарегистрироваться», «Скопировать номер»,
   «Отправить на почту»; never «ОК» / «Отправить» alone.
3. **Errors explain how to fix** - what was wrong and what to do: «Пожалуйста введите
   корректный адрес электронной почты».
4. **Natural language** - as if explaining to a friend; short sentences.
5. **Accessibility** - simple words, active voice, scannable lists.

**Write it, then cut it in half.**

## Register and language

- Russian only; «вы» (lowercase) by default; never mix «ты»/«вы» on one screen.
- No English leftovers (`Loading...`, `Delete`, `Submit`, `Recent Users`).
- Brand name through `BRAND_NAME` / `BRAND_NAME_STRING`.

## Words to favor / avoid

- **Favor** - trust: понятно, спокойно, бережно, честно; empowerment: разобраться,
  понять себя, выбрать, увидеть; empathy: вместе, поддержка, забота, ваш путь.
- **Avoid** - cold/robotic («Запрос обрабатывается», «Операция выполнена»), pressure
  («только сегодня», «успейте», «последний шанс»), promises («гарантия результата»,
  «изменит жизнь»), judgment («вы неправильно…», «ошибка пользователя»), fortune-telling
  clichés («звёзды сошлись», «магия») unless the developer asks for a playful tone.

## Money and bonuses

- Explain rules plainly: «Бонусами можно оплатить до 20% стоимости» - with the number
  from `PERCENTAGE_TO_PAY_BY_BONUS`, never typed.
- Payment verification is manual: say what happens («Проверю оплату в течение суток и
  напишу вам») rather than «Платёж в обработке».
- Referral: describe the benefit for both sides without hype («Друг получит
  {REGISTRATION_WITH_REFERRAL_EMAIL_BONUS} бонусов при регистрации, вы -
  {PERCENTAGE_FROM_FRIEND_PURCHASE}% от его покупок» - amounts from
  `app/constants/constants.ts`, never typed).

## Before / after

```
❌ "Ошибка."
✅ "Не удалось сохранить изменения. Попробуйте ещё раз или напишите мне в Telegram."

❌ "Submit"
✅ "Оплатить консультацию"

❌ "Success!"
✅ "Изменения сохранены."

❌ "Ты заработал 3000 баллов"            (register + hardcoded amount)
✅ "Вы заработали {amount} баллов"        (amount from data, plural via helper)

❌ "Купите сейчас - только сегодня скидка!"
✅ "Консультация стоит {price} {currency}. До 20% можно оплатить бонусами."
```

## Amounts in copy

Never hardcode a price, bonus or percentage in text. Read `price` + `Currency` from the
consultation, bonus amounts from `app/constants/constants.ts`, plurals via the helper in
`utils/formatting.ts`, dates via `formatDate` (`ru`).

## Gotcha

A grammatically fine string can still be off-voice (cold, pushy, mystical). Read it aloud
as if to a friend paying for a consultation for the first time - that catches tone faster
than a rule.
