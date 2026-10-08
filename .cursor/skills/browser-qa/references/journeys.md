# Journeys of this app

Runnable checklists (preconditions -> steps -> expected evidence). Routes come from the
`Pathname` union in `utils/useAppRouter.ts`; copy strings are the ones in the components -
update this file when they change.

## J1 - Browse and open a consultation (anonymous)

Preconditions: logged out, consultations seeded (`PUBLISHED` in production, any status in
preview/dev).

1. `navigate_page` `/` -> hero, header with «Войти»; screenshot at 375 / 768 / 1024.
2. Navigate to `/consultation` -> cards (`ConsultationCard`) replace the skeleton
   (`ConsultationCardPlaceholder`).
3. Click a card -> `/consultation/<id>`: title, description, perks, price with currency
   symbol.
4. Payment block: `BankingList` renders bank cards from `GET /api/banking`; "copy number"
   copies (no toast - verify via `evaluate_script` reading `navigator.clipboard` is not
   possible headless; verify the button state instead).
5. Sweep: `GET /api/consultation`, `GET /api/consultation/<id>`, `GET /api/banking` -> 200;
   `GET /api/auth` -> `{ auth: false }`.

## J2 - Register, logout, login

Preconditions: logged out; a throwaway email (delete the user afterwards).

1. Header «Войти» -> `LoginModal`; link «Зарегистрироваться» -> `RegistrationModal`.
2. Submit empty -> validation messages from `messages.validation.*` under the inputs.
3. Fill name, email, password (+ confirmation; optional friend email) -> `POST /api/users`
   -> 200; modal closes; header shows `UserBadge`.
4. Expect the registration bonus (`REGISTRATION_BONUS`) in `/account/bonuses`
   (`BonusList`), wallet created (`GET /api/wallet`).
5. Logout from the account menu (`LogoutModal`) -> `POST /api/users/logout` -> header shows
   «Войти»; `/account/*` redirects to `/`.
6. Login with the wrong password -> inline error text from the API (`error.data.message`),
   no console error. Login with the right one -> `UserBadge`.
7. Sweep: no 500s; `refreshToken` cookie set httpOnly (check presence via network
   `Set-Cookie`, never print the value).

## J3 - Reset password

1. `LoginModal` -> «Забыли пароль?» -> `ResetPasswordModal` form (`ResetPasswordForm`).
2. Submit email -> `POST /api/reset-password` -> `ResetPasswordSent` state (react-spring
   transition).
3. Open `/reset-password/<link>` (link from the email / database row
   `PasswordResetLink`) -> new password form -> `POST /api/reset-password/<link>` -> success
   -> login works with the new password.
4. Expired/used link -> Russian error state, no crash.

## J4 - Account area (logged in)

1. `/account` at 375 -> `MobileAccountNavigation`; at 1024 -> redirect to
   `/account/personal-details` with `AccountNavigation` sidebar.
2. `/account/personal-details` -> edit name / notification toggle -> `PATCH /api/users/<id>`
   -> saved state.
3. `/account/purchases` -> empty state with link to `/consultation` **or** purchase cards
   with status text from `messages.payments[status]`.
4. `/account/bonuses` -> `BonusList` or empty state «У вас пока еще нет бонусов…».
5. `/account/friends` -> `FriendsList` / referral copy button.
6. `/account/notifications`, `/account/support` render; `/bonus-program` explains the rules.
7. Sweep: all `/api/*` 200; no «ты»/«вы» mixing on the screens you touched.

## J5 - Purchase a consultation (logged in, writes rows)

Preconditions: non-production database or a throwaway account.

1. `/consultation/<id>` -> `PaymentInfo`: bonus split (`useBonusToPayConsultation`, max
   `PERCENTAGE_TO_PAY_BY_BONUS`), bank selection.
2. Confirm payment -> `POST /api/purchase` -> `PaymentCheckRequest` state; text from
   `messages.payments.CHECKING`.
3. `/account/purchases` shows the new purchase with `CHECKING` status.
4. If the buyer has `invitedByFriendEmail`, the friend's `/account/bonuses` gains a
   `FRIEND_S_PURCHASE` bonus after confirmation (admin step).
5. Sweep: exactly one `POST /api/purchase`; no unintended writes.

## J6 - Admin

1. As a `USER`, `navigate_page` `/admin` -> redirected to `/` (`useAdminRoute`).
2. As `ADMIN`, `/admin` -> `UserList` from `GET /api/users` (should be Russian when
   touched); `/admin/account/*` mirrors the account area.
3. Sweep: `GET /api/users` -> 200. Known gap: this route has **no server-side auth** -
   `middleware.ts` only guards `/api/users/<id>` and `app/api/users/route.ts` `GET` never
   reads the cookie, so anonymous callers get every user DTO too. The admin page is gated
   only on the client. Do not report it as secured; fixing the route is a separate change.

## J7 - Articles

1. `/article` -> `ArticleList` from `app/article/constants/articles.ts`.
2. `/article/<id>` -> `ArticleContent` paragraphs; «send by email» ->
   `POST /api/email/article` (logged in) -> success state.

## J8 - Mobile navigation and layout

1. 375: burger (`BurgerMenuButton`) opens `MobileMenu` with the animation; links navigate;
   menu closes.
2. 768: still mobile header (`isTablet < 1024`); 1024: `Navbar`.
3. Footer `ContactLinks` (Telegram / Instagram / email) visible on every page.
4. Lighthouse on `/` and `/consultation` after visual changes.
