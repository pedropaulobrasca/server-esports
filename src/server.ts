import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import convertHourStringToMinutes from "./utils/convert-hour-string-to-minutes";
import convertMinutesToHourString from "./utils/convert-minutes-to-hour-string";

const app = express();
app.use(express.json());
app.use(cors()); // Mudar futuramente para o domino do front-end

const prisma = new PrismaClient();

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      ads: true,
    },
  });

  res.json(games);
});

app.post("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const body = req.body;

  // Validacao com o Zod

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hoursStart: convertHourStringToMinutes(body.hoursStart),
      hoursEnd: convertHourStringToMinutes(body.hoursEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  res.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      hoursStart: true,
      hoursEnd: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(
    ads.map((ad) => ({
      ...ad,
      weekDays: ad.weekDays.split(","),
      hoursStart: convertMinutesToHourString(ad.hoursStart),
      hoursEnd: convertMinutesToHourString(ad.hoursEnd),
    }))
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  res.json({
    discord: ad.discord,
  });
});

app.listen(3333, () => {
  console.log("🚀 Server listening on port 3333!");
});
