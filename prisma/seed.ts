import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// const course = await db.video.create({
//   data: {
//     name: "Eurodolar na paritě, akcie znovu ztrácejí. TSLA -6 %, BABA -10 %",
//     createdAt: "2022-07-12T09:00:00-01:00",
//     url: "https://youtu.be/FpOlhPbiWmg",
//     playlists: [
//       { time: "00:00", name: "Korekce na akciích, TSLA, BABA, silný dolar" },
//       { time: "08:07", name: "Drahá cena elektřiny a zdroje fin. zpráv" },
//       { time: "11:13", name: "Dopad nižšího market capu na chod firmy" },
//       { time: "15:12", name: "Zohlednění terminal value" },
//       { time: "17:22", name: "Tripadvisor" },
//       { time: "21:02", name: "Royal Mail, srovnání PostNL a BPost" },
//     ],
//   },
// });

async function seed() {
  await Promise.all(
    getVideos().map((video) => {
      return db.video.create({ data: video });
    })
  );
}

seed();

function getVideos() {
  return [
    {
      name: "Eurodolar na paritě, akcie znovu ztrácejí. TSLA -6 %, BABA -10 %",
      createdAt: "2022-07-12T09:00:00-01:00",
      url: "https://youtu.be/FpOlhPbiWmg",
      playlists: {
        create: [
          {
            time: "00:00",
            name: "Korekce na akciích, TSLA, BABA, silný dolar",
          },
          { time: "08:07", name: "Drahá cena elektřiny a zdroje fin. zpráv" },
          { time: "11:13", name: "Dopad nižšího market capu na chod firmy" },
          { time: "15:12", name: "Zohlednění terminal value" },
          { time: "17:22", name: "Tripadvisor" },
          { time: "21:02", name: "Royal Mail, srovnání PostNL a BPost" },
        ],
      },
    },
    {
      name: "Komodity výrazně klesají, WTI na $95. Dnes výsledky CPI",
      createdAt: "2022-07-13T09:00:00-01:00",
      url: "https://youtu.be/L1bAYKH5cB0",
      playlists: {
        create: [
          { time: "00:00", name: "Ceny komodit, ServiceNow, Boeing" },
          { time: "08:56", name: "Aktuální cena WTI" },
          { time: "11:24", name: "Aerolinky" },
          { time: "13:16", name: "Spustí Fed opět QE?" },
          { time: "14:15", name: "Pár dalších komentářů" },
          { time: "15:26", name: "Výsledky RCI Hospitality" },
          { time: "16:20", name: "Disney" },
          { time: "20:44", name: "Insider buys, Starbucks" },
          { time: "26:26", name: "Siemens Healthineers" },
          { time: "34:22", name: "NortonLifeLock" },
          { time: "38:31", name: "Kde je ta recese?" },
        ],
      },
    },
    {
      name: "Americká inflace znovu zrychlila, trh spekuluje na červencový růst sazeb o 100bp",
      createdAt: "2022-07-14T09:00:00-01:00",
      url: "https://youtu.be/T9-6Dxx-1L0",
      playlists: {
        create: [
          { time: "00:00", name: "Americká inflace, sazby" },
          { time: "15:00", name: "Upstart, sekuritizované půjčky" },
          { time: "17:10", name: "Johnson&Johnson a pár dalších komentářů" },
          { time: "19:53", name: "Kam až Fed sníží bilanci?" },
          { time: "21:45", name: "Komodity a inflační hedge" },
          { time: "23:57", name: "Pár dalších komentů" },
          { time: "25:10", name: "Český hypo a realitní trh, insider" },
          { time: "28:41", name: "Transocean" },
          { time: "35:06", name: "St. dluhopisy a XTB" },
        ],
      },
    },
  ];
}
