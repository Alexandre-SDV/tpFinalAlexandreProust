import Jeux from "./Models/Jeux";
import JeuxAjoute from './Models/JeuxAjoute';

export default class DAO {
	static #mapJeux = new Map();
	static #mesJeux = new Map();
	static #jeuxRecherche = new Map();

	//Fonction qui télécharge les données des jeux sans filtre
	static async telechargerDonneesJeux() {
		this.#mapJeux.clear();
		if (this.#mapJeux.size > 0) {
			return this.#mapJeux;
		}
		try {
			const resListeJeux = await fetch("https://www.giantbomb.com/api/games/?api_key=c055944f1a3bbd629affabde08790bef32a17164&format=json");
			const jsonRequeteListe = await resListeJeux.json();
			const listeJeux = jsonRequeteListe.results;
			if (!listeJeux || !Array.isArray(listeJeux) || listeJeux.length === 0) {
				throw new Error("Données réponse non conformes");
			}

			for (let i = 0; i < listeJeux.length; i++) {
				const jsonJeux = listeJeux[i];

				const jeux = new Jeux(jsonJeux);
				this.#mapJeux.set(jeux.id, jeux);
			}

			return this.#mapJeux;
		} catch(e) {
			console.error(e);
			alert("Erreur pendant le téléchargement des Jeux");
		}
	}

	//Fonction qui télécharge les données des jeux pour un mot défini dans la barre de recherche
	static async telechargerDonneesJeuxRecherche() {
		this.#jeuxRecherche.clear();
		if (this.#jeuxRecherche.size > 0) {
			return this.#jeuxRecherche;
		}
		try {
			const inputText = document.querySelector(".inputRecherche").value;
			const resListeJeuxRecherche = await fetch("https://www.giantbomb.com/api/games/?api_key=c055944f1a3bbd629affabde08790bef32a17164&format=json&filter=name:"+inputText);
			const jsonRequeteListe = await resListeJeuxRecherche.json();
			const listeJeuxRecherche = jsonRequeteListe.results;
			if (!listeJeuxRecherche || !Array.isArray(listeJeuxRecherche) || listeJeuxRecherche.length === 0) {
				throw new Error("Données réponse non conformes");
			}

			for (let i = 0; i < listeJeuxRecherche.length; i++) {
				const jsonJeuxRecherche = listeJeuxRecherche[i];

				const jeux = new Jeux(jsonJeuxRecherche);
				this.#jeuxRecherche.set(jeux.id, jeux);
			}

			return this.#jeuxRecherche;
		} catch(e) {
			console.error(e);
			alert("Erreur pendant le téléchargement des Jeux");
		}
	}

	static verifierSiNomJeuxDisponible(nom) {
		return !this.#mesJeux.has(nom);
	}


	static ajouterAMesJeux(jeux) {
		const jeuxAjoute = new JeuxAjoute(jeux.jsonJeux);
		this.#mesJeux.set(jeuxAjoute.id, jeuxAjoute);
		this.#sauvegarderMesJeux();
	}

    static miseAJourJeux(jeux) {
		this.#sauvegarderMesJeux();
	}

	static #sauvegarderMesJeux() {
		const tableauMesJeux = Array.from(this.#mesJeux.values());
		window.localStorage.setItem("mesJeux", JSON.stringify(tableauMesJeux));
	}

	static chargerMesJeux() {
		this.#mesJeux = new Map();
		const json = window.localStorage.getItem("mesJeux");
		if (!json) {
			return this.#mesJeux;
		}
		const tableauParse = JSON.parse(json);
		tableauParse.forEach(jeuxObj=>{
			const jeuxAjoute = new JeuxAjoute(jeuxObj.jsonJeux);
			this.#mesJeux.set(jeuxAjoute.name, jeuxAjoute);
		});
		return this.#mesJeux;
	}

	static enleverJeux(jeux) {
		this.#mesJeux.delete(jeux.name);
		this.#sauvegarderMesJeux();
	}

}