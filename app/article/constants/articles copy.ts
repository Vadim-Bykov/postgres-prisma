export interface ArticleParagraph {
  paragraphTitle?: string;
  paragraphSubTitle?: string;
  imageSourceId?: string;
  text: string;
}

export interface Article {
  id: number;
  title: string;
  subTitle?: string;
  summary?: string;
  imageSourceId?: string;
  paragraphs: ArticleParagraph[];
  ps?: string;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Заголовок статьи",
    subTitle: "Подзаголовок статьи необязательный",
    summary:
      "Краткое содержание статьи - первые пару предложений ......... В самом общем виде астрологию невозможно фальсифицировать, но некоторые отдельные утверждения астрологов поддаются проверке",
    imageSourceId: "1ZVn3kSYa6IAe7XZiEJrWzd_SZLjdTre7",
    paragraphs: [
      {
        text: "",
        paragraphTitle: "",
        paragraphSubTitle: "",
        imageSourceId: "",
      },
      {
        text: "",
        paragraphTitle: "",
        paragraphSubTitle: "",
        imageSourceId: "",
      },
    ],
    ps: "Астрологическая практика строится на двух тесно связанных моментах",
  },
  {
    id: 2,
    title: "",
    subTitle: "",
    summary: "",
    imageSourceId: "",
    ps: "Астрологическая практика строится на двух тесно связанных моментах",
    paragraphs: [
      {
        text: "",
        paragraphTitle: "",
        paragraphSubTitle: "",
        imageSourceId: "",
      },
    ],
  },
  {
    id: 3,
    title: "",
    subTitle: "",
    summary: "",
    imageSourceId: "",
    ps: "Астрологическая практика строится на двух тесно связанных моментах",
    paragraphs: [
      {
        text: "",
        paragraphTitle: "",
        paragraphSubTitle: "",
        imageSourceId: "",
      },
    ],
  },
];
