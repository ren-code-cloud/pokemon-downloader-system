import inquirer from 'inquirer';
import { pokemonFigth } from "./savingPokemon.js"
import chalk from "chalk";

const pokemonName = async () => {
  const inputUser = await inquirer
  .prompt([{
      type: 'input',
      name: 'name',
      message: chalk.red('Pokemon Name:'),
    },
    // Add more question objects as needed
  ]).then((result) => {
    return result.name.toLowerCase(); 
  }).catch(error => {
    console.log(error)
  })
  return inputUser;
}

const pokemonInfos = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  .then((result) => result.json())
  .then((res) => res);
  return response;
}

const savingDataPokemon = async () => {
  const listItems = {
    type: "checkbox",
    name: "listOps",
    message: chalk.yellow("Pokemon Info to Download:"),
    choices: [
      { name: "Stats"},
      { name: "ArtWorks"},
      { name: "Sprites"}
    ],
    validate(answer) {
      if (answer.length < 1) {
        return "You must choose at least one option.";
      }
      return true;
    }
  };

  const { listOps } = await inquirer.prompt([listItems]);
  const lowercaseOptions = listOps.map(option => option.toLowerCase());
  return lowercaseOptions;
};

const pokemonContinue = async () => {
 const question = async () => {
   const inputObject = [
     {
       type: "input",
       name: "question",
       message: chalk.blue("Would you like to search for another pokemon?")
     }
     ]
   const feedback = await inquirer.prompt(inputObject)
   .then((result) => {
     return result.question;
   })
   .catch((error) => {
     console.error("Something bad happen");
     console.log(error);
   })
   return feedback;
 }
 const yesFunc = await question();
 
 while (true) {
   if (yesFunc === "yes") {
     return await new Promise((resolve, reject) => {
       setTimeout(() => {
         resolve("success");
       })
     })
     .then((result) => {
       promptUser();
     })
     .catch((error) => {
       console.error("Something bad happen");
       console.log(error);
     })
   }else {
     break;
   }
 }
}

const promptUser = async () => {
  const pokeName = await pokemonName();
  const pokemonInfo = await pokemonInfos(pokeName);
  const savingData = await savingDataPokemon();
  const pokeFi = await pokemonFigth(pokemonInfo, savingData);
  const continueGame = await pokemonContinue();
}

export { promptUser };