import fs from 'fs/promises';
import path from 'path';
import chalk from "chalk";

const createDirectories = async (pathname) => {
   const __dirname = path.resolve();
   pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
   const makeFolder = fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
       if (e) {
           console.error(e);
       } else {
           console.log('Success');
           return pathname;
       }
    });
   return makeFolder;
}

const pokemonSavingImage = async (foldername, arraybuffer) => {
  for (const [key, val] of Object.entries(arraybuffer)) {
    try {
      const response = await fetch(val);
      const image = await response.arrayBuffer();
      await fs.writeFile(`${foldername}/${key}.png`, Buffer.from(image));
      console.log(chalk.greenBright("Saved: ") +
                 chalk.cyan(`${foldername}/${key}.png`));
    } catch (error) {
      console.log(error)
    }
  }
};

const pokemonSavingSprite = async (filePath, arrayObjectSprites) => {
  delete arrayObjectSprites.other;
  delete arrayObjectSprites.versions;
  const arrayKeyVal = new Map();
  for (const [key, val] of Object.entries(arrayObjectSprites)) {
    if (val === null || val === undefined) {
      delete arrayObjectSprites[key];
    } else {
      arrayKeyVal.set(key, val);
    }
  }
  await pokemonSavingImage(filePath, Object.fromEntries(arrayKeyVal));
};

const pokemonSavingStats = async (foldername, arrayObjectStats) => {
  const statsArray = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

  let statsData = "";

  for (let i = 0; i < arrayObjectStats.length; i++) {
    const element = arrayObjectStats[i];
    const statName = statsArray[i];
    const baseStat = element.base_stat;
    //concat the all data collect
    statsData += `${statName} = ${baseStat}\n`;
   // console.log(`${statName} = ${baseStat}`);
  }

  fs.writeFile(`${foldername}/stats.txt`, statsData, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
};

const pokemonSavingArtwork = async (filepath, arrayObjectArtwork) => {
    const valueItems = arrayObjectArtwork.front_default;
    await fetch(valueItems)
    .then((response) => response.arrayBuffer())
    .then(async (image) => {
      await fs.writeFile(`${filepath}/official-artwortk.png`, Buffer.from(image));
       console.log(chalk.greenBright("Saved: ") +
                 chalk.cyan(`${filepath}/${"official-artwork"}.png`));
    })
    .catch((error) => {
      console.log("Tanga may bug nanaman ito => ", error);
    })
};

const pokemonFigth = async (fetchData, arrayObject) => {
  const pathName = await fetchData.forms[0].name;
  const folderName = await createDirectories(pathName);

  if (arrayObject.includes("stats")) {
    await pokemonSavingStats(pathName, fetchData.stats);
  }
  if (arrayObject.includes("artworks")) {
    await pokemonSavingArtwork(pathName, fetchData.sprites.other["official-artwork"]);
  }
  if (arrayObject.includes("sprites")) {
    await pokemonSavingSprite(pathName, fetchData.sprites);
  }
};

export { pokemonFigth };