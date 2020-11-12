//please keep them in alphabetical order
const laws = {
	conway: {
		title: "Conway's Law",
		body: "This law suggests that the technical boundaries of a system will reflect the structure of the organisation. It is commonly referred to when looking at organisation improvements, Conway's Law suggests that if an organisation is structured into many small, disconnected units, the software it produces will be. If an organisation is built more around 'verticals' which are orientated around features or services, the software systems will also reflect this."
	},
	dunbar: {
		title: "Dunbar's Number",
		body: `"Dunbar's number is a suggested cognitive limit to the number of people with whom one can maintain stable social relationships— relationships in which an individual knows who each person is and how each person relates to every other person." There is some disagreement to the exact number. "... [Dunbar] proposed that humans can comfortably maintain only 150 stable relationships." He put the number into a more social context, "the number of people you would not feel embarrassed about joining uninvited for a drink if you happened to bump into them in a bar." Estimates for the number generally lay between 100 and 250.

		Like stable relationships between individuals, a developer's relationship with a codebase takes effort to maintain. When faced with large complicated projects, or ownership of many projects we lean on convention, policy, and modeled procedure to scale. Dunbar's number is not only important to keep in mind as an office grows, but also when setting the scope for team efforts or deciding when a system should invest in tooling to assist in modeling and automating logistical overhead. Putting the number into an engineering context, it is the number of projects (or normalized complexity of a single project) for which you would feel confident in joining an on-call rotation to support.`
	},
	goodheart: {
		title: "Goodheart's Law",
		quote: "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.",
		author: "Charles Goodheart",
		body: "The law states that the measure-driven optimizations could lead to devaluation of the measurement outcome itself. Overly selective set of measures (KPIs) blindly applied to a process results in distorted effect. People tend to optimize locally by \"gaming\" the system in order to satisfy particular metrics instead of paying attention to holistic outcome of their actions."
	},
	kernighan:{
		title: "Kernighan's Law",
		quote: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
		author: "Brian Kernighan",
		body: "While hyperbolic, Kernighan's Law makes the argument that simple code is to be preferred over complex code, because debugging any issues that arise in complex code may be costly or even infeasible."
	},
	moore: {
		title: "Moore's Law",
		body:"The number of transistors in an integrated circuit doubles approximately every two years."
	},
	occam: {
		title:"Occam's Razor",
		body:"Entities should not be multiplied without necessity."
	},
	wheaton: {
		title: "Wheaton's Law",
		quote:"Don't be a dick.",
		author:"Wil Wheaton",
		body:"Coined by Wil Wheaton (Star Trek: The Next Generation, The Big Bang Theory), this simple, concise, and powerful law aims for an increase in harmony and respect within a professional organization. It can be applied when speaking with coworkers, performing code reviews, countering other points of view, critiquing, and in general, most professional interactions humans have with each other."
	}
}

const quoteSection = (law) => law.quote ? `${"> "+law.quote}
${"> -"+law.author || ""}
` : ``

const lawToMarkdown = (law) => `__**${law.title}**__
${quoteSection(law)}
${law.body}`

exports.command = "<law>";

exports.describe =
  "Laws, Theories, Principles and Patterns that developers will find useful. Try 'law list'";

exports.handler = (argv) => {
	if(typeof argv.law !== "string")
	return;

	const law = argv.law.toLowerCase();

	if(law === "list"){
		const list = Object.keys(laws).join(" \n");
		argv.msg.channel.send("```"+list+"```");
	}else{
	if(Object.keys(laws).indexOf(law) == -1){
		argv.msg.channel.send("Unknown law, effect, theory, or principle. Try `law list`");
	}

	argv.msg.channel.send(lawToMarkdown(laws[law]));
	}		
};
