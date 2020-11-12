exports.command = "<asking_help>";

exports.describe =
  "Uberize b2renger for real.";

// exports.builder = {
// iterations: {
//     default: 1,
//     describe: "how many times the sentence is to be repeated",
//     alias: 'i',
//     type: "number"
// }
// }

const b2renger = {
  status: true
}

exports.handler = (argv) => {
  console.log(argv);
  if (b2renger.status == "letmealone") {
    argv.msg.channel.send("B2renger est momentanément indisponible. Veuillez poursuivre vos appels jusqu'à acceptation de votre requête.");
  } else {
    argv.msg.channel.send("B2renger ? B2renger ? B2renger ? J'ai besoin d'aide.");
  }
};
