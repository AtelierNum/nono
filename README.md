# Participer à nono
Si vous souhaitez participer au développement de Nono, il faut d'abord le reproduire localement pour effectuer des tests avant d'envoyer une pull-request sur le repo.

1. Dupliquer ce repo sur votre machine avec ``git pull https://github.com/AtelierNum/nono.git master``
2. Installer les dépendances : ``npm install``.
3. Reproduire le ``.env`` avec votre token de bot que vous aurez crée.
4. Lancer l'app avec ``node mains.js``.

## Créer un bot Discord
Il faut déclarer une application sur Discord pour pouvoir mettre en place un bot sur n'importe quel serveur. Cette application permettra de gérer les droits que vous lui donnerez et est identifiable avec le ``client_id`` ; le bot pourra être partagé à n'importe quel utilisateur Discord à partir de son token.
Vous créez donc une nouvelle application [ici](https://discord.com/developers/applications). Nommez là, c'est mieux.

Une fois cela fait, vous pouvez vous rendre dans l'onglet ``Bot`` où vous pourrez ajouter un nouveau bot et lui donner un petit nom ainsi qu'un magnifique avatar.
Vous pouvez maintenant récupérer le token du bot, le copier dans le ``.env`` et run l'app pour activer votre bot.

Il ne reste plus qu'à l'ajouter à votre serveur avec le lien suivant (en remplaçant le client_id): 
``https://discord.com/oauth2/authorize?client_id=[le_client_id_de_votre_application_discord]&scope=bot``


## Comment créer une commande

### commande simple

Pour créer une commande, créz un fichier `.js` dans le dossier `/commands` . Le nom de ce fichier sera le nom de votre commande. 
Par exemple `/commands/repeat.js` sera la commande `repeat`.

### sous-commande

Pour créer une sous-commande, il faudra créer un dossier dans `/commands` pour votre famille de commandes, si elle n'existe pas déjà, puis mettre votre sous-commande dans ce dossier. 
Par exemple `/command/arduino/led.js` sera la commande `arduino led`.

### Anatomie d'une commande

Une commande s'écrit sous la forme d'un module exportant au moins 2 proprietées :

`command` : est une chaîne de caractères definissant les paramètres positionnels que votre commande prend.

`<mon_param>` : est un paramètre obligatoire du nom de "mon_param" que vous pourrez recuperer plus tard comme ceci `argv.mon_param` . Il est obligatoire car il est entourré de `<>`

`[autre_param]` : ceci est un parametre optionnel du nom de "autre_param" que vous pourrez recuperer plus tard comme ceci `argv.autre_param`. Il est optionnel car il est entourré de `[]`

`[..le_reste]` : si votre commande accepte un nombre undeterminé de paramètres, il vous sera possible de mettre un paramètre optionnel tout à la fin de vos paramètres et précédé par `..` qui capturera dans un array/tableau (ici nommé "le_reste") tous les paramètres en excendant. Vous pourrez recuperer ce tableau par la suite via `argv.le_reste`

⚠️ notez que ces paramètres seront "positionnels" autrement dit c'est l'ordre dans lesquels vous les donnerez lors de l'appel qui determinera quelle valeur correspond à quel paramètre ⚠️

`handler` : est une fonction prennant `argv` en parammètre et qui s'exécutera lorsque votre commande sera appelée. C'est ici que vous décrirez ce que vous voulez que le bot fasse. `argv` contient tout le contexte dont vous avez besoin, nottament vos paramètres mais aussi des informations sur le message discord recolté par le bot via `argv.msg`.

À ces deux exports, il est recommandé d'y ajouter l'export suivant:

`describe` : Il s'agit simplement d'une chaîne de caractères qui explique ce que votre commande fait. C'est ce qui sera montré à côté de votre commande lorsque les utilisateurs taperont `--help`.

Pour des usages un peu plus avancés vous pouvez écrire une definition complète des paramètres de votre commande avec l'export ci dessous.

`builder` : est un objet prennant la description detaillée de vos paramètres permettant de definir plus que des paramètres positionnels. Chaque proprieté de cet objet est un paramètre qui lui même prend un objet definissant comment ce paramètre se comporte. 

- `alias` : permet de définir un raccourcis. Par example mon paramètre `--port` peut prendre un alias `"p"` me permettant de fournir `--port 8080` ou `-p 8080`.

- `describe` : est une chaîne de caractères qui servira à expliquer l'utilité et/ou l'usage du paramètre.

- `default` : permet de definir une valeur que votre paramètre prendra par défaut si il n'est pas donné lors de l'appel de votre commande.

- `type` : le type du paramètre au choix parmis les possibilités suivantes:

- - `"array"` : le paramètre metteras dans un tableau toutes les valeurs entre lui et le prochain paramètre. Par example `commande --param 1 deux 3` présentera dans le handler `argv.param` comme `[1, 'deux', 3]`.

- - `"boolean"` : si ce paramètre ou son alias est present alors `argv.parametre` sera `true` sinon il sera `false`.

- - `"count"` : se comporte comme `"boolean"` sauf qu'il renvoi le nombre de fois que le parammètre à été fourni au lieu de `true`, et donc `0` au lieu de `false`.

- - `"number"` : permet de récupérer un nombre en paramètre. Par exemple `commande --param 1234` présentera dans le handler `argv.param` comme valant `1234` . Si vous fournissez autre chose qu'un nombre le paramètre aura la valeur `NaN`.

- - `"string"` : permet de récupérer une chaîne de caractères en paramètre. Attention, les chaîne contenant des espaces doivent être encadré par des `"` lors de l'appel de la commande, sinon seulement le premier mot est pris en compte. Par example `commande --ma_phrase "ceci est correct"` vera `argv.ma_phrase` porter la  valeur `ceci est correct` alors que `commande --ma_phrase ceci n'est pas correct` vera `argv.ma_phrase` porter la valeur `ceci` .

### Example complet :

```js
// ./commands/repeat.js
exports.command = '<sentence>'

exports.describe = 'repeat the sentence in the console'

exports.builder = {
  iterations: {
	default: 1,
	describe: "how many times the sentence is to be repeated",
	alias: 'i',
	type: "number"
  }
}

exports.handler = function (argv) {
  for(let i=0; i < argv.iterations; i++){
		console.log(argv.sentence);
	}
}

//repeat "F is for friends who do stuff together" -i 3
//donne :

// F is for friends who do stuff together
// F is for friends who do stuff together
// F is for friends who do stuff together
```
