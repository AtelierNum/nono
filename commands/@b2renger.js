const embed = require('../helpers/embed')

exports.command = "<ub2r> [reste..]";

exports.describe =
  "Uberize b2renger for real.";

exports.builder = {
  iterations: {
      default: 1,
      describe: "how many times the call will be repeated",
      alias: 'i',
      type: "number"
  }
}

const b2renger = {
  status: true
}

const wait = 10000;

const spam = (argv, msg) => {
  return setInterval(() => {
    return argv.msg.channel.send({embed : msg});
  }, wait)
}

const stopSpam = (id, i) => {
  setTimeout(() => clearInterval(id), (i * wait) + 100 )
}

exports.handler = (argv) => {
  console.log(argv);
  if (!b2renger.status) {
    argv.msg.channel.send("B2renger est momentanément indisponible. Veuillez poursuivre vos incessants appels jusqu'à acceptation de votre requête.");
  } else {
    console.log(argv.ub2r + ' ' + argv.reste.join(' '))
    switch (argv.ub2r + ' ' + argv.reste.join(' ')){
      case 'on en a gros !' :
        let embedMsg = embed.setEmbed({
            author : argv.msg.member.nickname,
            desc : "B2renger ? B2renger ? B2renger ? J'ai besoin d'aide.                  ",
            title: "Help request",
            avatar : argv.msg.author.displayAvatarURL,
            picture: 'https://ateliernum.github.io/img/logo_ateliernum.png'
          }
        )
        argv.msg.channel.send({embed : embedMsg});

        if (argv.i > 1){
          let idInterval = spam(argv, embedMsg);
          stopSpam(idInterval, argv.i - 1)
        }
        break;
      default: 
        let msg = setEmbed(
          {
            author : argv.msg.member.nickname,
            avatar : argv.msg.author.displayAvatarURL,
            title: 'Guest help request | F45-C',
            desc : `Afin de pouvoir procéder à une demande d'entretien auprès du manager de l'atelier numérique, il vous faut vous procurer un exemplaire du formulaire 45-C (disponible en cliquant sur le lien ci-dessus).`,
          }
        )
        msg.url = "https://docs.google.com/forms/d/1yVsQzqxXwK6trv6qjAVN8w6L3Co4n2EkZ-DYaRYRTN8/edit?usp=sharing";
        msg.thumbnail = {
          url: 'https://d3fgqmmhgv8ngq.cloudfront.net/sites/default/files/form_2.png',
        }
        argv.msg.channel.send({embed: msg});
    }
  }
};
