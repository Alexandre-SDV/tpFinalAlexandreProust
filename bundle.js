class Jeux {
	id = -1;
	name = "";
	image_bloc = "";
	platforms = [];
	image_detail = "";
	date = new Date();
	descLong = "";
	descCourt = "";
	estSorti = false;
    
    jsonJeux;

	constructor(jsonJeux) {
		this.jsonJeux = jsonJeux;

		this.id = jsonJeux.id;
		this.name = jsonJeux.name;

        this.image_bloc = jsonJeux.image.screen_url;

		this.platforms = jsonJeux.platforms;
        
        this.image_detail = jsonJeux.image.small_url;

        this.date = jsonJeux.original_release_date ? jsonJeux.original_release_date : jsonJeux.expected_release_year;

        this.descLong = jsonJeux.description;
        this.descCourt = jsonJeux.deck;

		let currentYear = new Date().getFullYear();
		if(currentYear > this.date){
			this.estSorti = true;
		}

	}

	static obtenirNomJeux() {
		const nom = this.jeux;
		const nomDispo = DAO.verifierSiNomJeuxDisponible(nom);
		if (!nomDispo) {
			alert("Jeux déjà enregistré");
			return null;
		}
	}
	
}

class jeuxAjoute extends Jeux {
    constructor(jsonJeux) {
        super(jsonJeux);
    }
}

class DAO {
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
				//throw new Error("Données réponse non conformes");
				let popup = new PopUp("Données réponse non conformes");
            	App.sectionPage.append(popup.div);
			}

			for (let i = 0; i < listeJeux.length; i++) {
				const jsonJeux = listeJeux[i];

				const jeux = new Jeux(jsonJeux);
				this.#mapJeux.set(jeux.id, jeux);
			}

			return this.#mapJeux;
		} catch(e) {
			console.error(e);
			// alert("Erreur pendant le téléchargement des Jeux");
			let popup = new PopUp("Erreur pendant le téléchargement des Jeux");
            App.sectionPage.append(popup.div);
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
		const jeuxAjoute$1 = new jeuxAjoute(jeux.jsonJeux);
		this.#mesJeux.set(jeuxAjoute$1.id, jeuxAjoute$1);
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
			const jeuxAjoute$1 = new jeuxAjoute(jeuxObj.jsonJeux);
			this.#mesJeux.set(jeuxAjoute$1.name, jeuxAjoute$1);
		});
		return this.#mesJeux;
	}

	static enleverJeux(jeux) {
		this.#mesJeux.delete(jeux.name);
		this.#sauvegarderMesJeux();
	}

}

class DivSelectionJeux {
    div;

    constructor(jeux, callbackClick) {
		
		const divJeux = document.createElement("div");
		divJeux.classList.add("divSelectionJeux");

        divJeux.innerHTML = `
			<div><img src="${jeux.image_bloc}" alt="Image du jeu ${jeux.name}" class="imgSelectionJeux"></div>
            <div class="plateformes"></div>
			<div><p class="nomJeux">${jeux.name}</p></div>
		`;

		const plateformes = divJeux.querySelector(".plateformes");
		for(let i=0; i<jeux.platforms.length; i++){ 
			const platElement = document.createElement("span");
			platElement.innerText = jeux.platforms[i].abbreviation;
			plateformes.append(platElement);
			if(i == 3){
				break;
			}
		}
		if(jeux.platforms.length > 4){
			const compteur = jeux.platforms.length - 4;
			const spanCompteur = document.createElement("span");
			spanCompteur.innerText = "+" + compteur;
			plateformes.append(spanCompteur);
		}

        if (callbackClick) {
			divJeux.onclick = () => {
				callbackClick(jeux);
			};
		}

        this.div = divJeux;
}
}

class PopUp$1 {
    div;

    constructor(message, callbackClick) {
		
		const divPopUp = document.createElement("div");
		divPopUp.classList.add("divPopUp");

        divPopUp.innerHTML = `
            <div class="encadreFenetre fenetrePopUp">
                <p class="messagePopUp">${message}</p>
                <button class="btnPopUp" onclick='window.location.reload();'>J'ai compris !</button>
            </div>
		`;

        if (callbackClick) {
			divPopUp.onclick = () => {
				callbackClick(message);
			};
		}

        this.div = divPopUp;
}
}

class GestionnaireMesJeux {

    static clickBoutonMesJeux() {
        const mesJeux = DAO.chargerMesJeux();

        App$1.sectionPage.innerHTML = "";

        const divMesJeux = document.createElement("div");
		divMesJeux.classList.add("divMesJeux");
		App$1.sectionPage.append(divMesJeux);

        mesJeux.forEach(jeuxAjoute=>{
			const divSelection = new DivSelectionJeux(jeuxAjoute, this.afficherFicheJeuxAjoute.bind(this));
			divMesJeux.append(divSelection.div);
		});
    }

    static afficherFicheJeuxAjoute(jeux) {
        let txtDate = "Sortie le : ";

        if(jeux.estSorti == false){
            txtDate = "Sortie prévue :";
        }


        App$1.sectionPage.innerHTML = `
			<div class="divFicheJeux">
                <div class="divFicheBoutonRetour">
                    <span class="boutonRetour">Retour</span>
                </div>
                <div class="divFicheLigne1">
                    <div class="ligne1">
                        <span class="nomJeuxGestionnaire">${jeux.name}</span>
                        <img src="${jeux.image_detail}" alt="Image jeux ${jeux.name}}">
                    </div>
                </div>
            <div class="divFicheLigne2">
                <div class="ligne2">
                    <div class="plateformes">Plateformes : </div>
                    <div class="dateJeux">
                        <span>${txtDate}</span>
                        <span>${jeux.date}</span>
                    </div>
                </div>
            </div>
			<div class="divFicheDesc">
                <div class="divDescriptions">
                    <div class="divDescCourt">
                        <p>Description Courte :</p>
                        <p>${jeux.descCourt}</p>
                    </div>
                    <div class="divDescLong">
                        <p>Description Longue :</p>
                        <p>${jeux.descLong}</p>
                    </div>
                </div>
            </div>
			</div>
		`;

        const divFicheBoutonRetour = App$1.sectionPage.querySelector(".divFicheBoutonRetour");
        divFicheBoutonRetour.onclick = () => {
            this.clickBoutonMesJeux();
        };

        const plateformes = App$1.sectionPage.querySelector(".plateformes");
		for(let i=0; i<jeux.platforms.length; i++){
			const platElement = document.createElement("span");
			platElement.innerText = jeux.platforms[i].abbreviation;
			plateformes.append(platElement);
            if(i == 3){
				break;
			}
		}
        if(jeux.platforms.length > 4){
			const compteur = jeux.platforms.length - 4;
			const spanCompteur = document.createElement("span");
			spanCompteur.innerText = "+" + compteur;
			plateformes.append(spanCompteur);
		}

        //Bouton Retirer de mes favoris
        const divFicheJeux = App$1.sectionPage.querySelector(".divFicheJeux");
        const boutonRetirerJeux = document.createElement("div");
		boutonRetirerJeux.classList.add("bouton", "boutonOrange", "boutonAjouterJeux");
		boutonRetirerJeux.innerText = "Retirer de mes Favoris";

        boutonRetirerJeux.onclick = () => {
            // const nom = Jeux.obtenirNomJeux();
			// 	if (!nom) {
			// 		return;
			// 	}
				DAO.enleverJeux(jeux);
				// alert("Jeux ajouté");
                let popup = new PopUp$1("Jeux supprimé !");
                divFicheJeux.append(popup.div);
        };
        divFicheJeux.append(boutonRetirerJeux);
    }
}

class GestionnaireJeux {

    static async clickBoutonJeux() {
        App$1.afficherLoaderSectionPage();

        const mapJeux = await DAO.telechargerDonneesJeux();

        App$1.sectionPage.innerHTML = "";

        const divJeux = document.createElement("div");
        divJeux.classList.add("divJeux");

        App$1.sectionPage.append(divJeux);

        mapJeux.forEach(jeux=>{
	
			const divSelection = new DivSelectionJeux(jeux, this.afficherFicheJeux.bind(this));
			divJeux.append(divSelection.div);
		});
    }

    static async clickBoutonRecherche(nomJeux) {
        App$1.afficherLoaderSectionPage();

        const jeuxRechercher = await DAO.telechargerDonneesJeuxRecherche(nomJeux);

        App$1.sectionPage.innerHTML = "";

        const divJeux = document.createElement("div");
        divJeux.classList.add("divJeux");

        App$1.sectionPage.append(divJeux);

        jeuxRechercher.forEach(jeux=>{
	
			const divSelection = new DivSelectionJeux(jeux, this.afficherFicheJeux.bind(this));
			divJeux.append(divSelection.div);
		});
    }

    static afficherFicheJeux(jeux) {
        App$1.sectionPage.innerHTML = "";

        const divFicheJeux = document.createElement("div");
		divFicheJeux.classList.add("divFicheJeux");
		App$1.sectionPage.append(divFicheJeux);

        //Bouton retour
        const divFicheBoutonRetour = document.createElement("div");
        divFicheBoutonRetour.classList.add("divFicheBoutonRetour");

        divFicheBoutonRetour.innerHTML = `
        <div class="divFicheBoutonRetour">
            <span class="boutonRetour">Retour</span>
        </div>
        `;

        
        divFicheBoutonRetour.onclick = () => {
            this.clickBoutonJeux();
        };

        divFicheJeux.append(divFicheBoutonRetour);

        //Première ligne de la fiche d'un jeux (nom + image)
        const divFicheLigne1 = document.createElement("div");
        divFicheLigne1.classList.add("divFicheLigne1");

        divFicheLigne1.innerHTML = `
		<div class="ligne1">
			<span class="nomJeuxGestionnaire">${jeux.name}</span>
            <img src="${jeux.image_detail}" alt="Image jeux ${jeux.name}}">
		</div>
	    `;

		divFicheJeux.append(divFicheLigne1);

        //Deuxième ligne de la fiche d'un jeux (plateformes + date)
        const divFicheLigne2 = document.createElement("div");
        divFicheLigne2.classList.add("divFicheLigne2");
        let txtDate = "Sortie le : ";

        if(jeux.estSorti == false){
            txtDate = "Sortie prévue :";
        }

        divFicheLigne2.innerHTML = `
		<div class="ligne2">
			<div class="plateformes">Plateformes : </div>
            <div class="dateJeux">
                <span>${txtDate}</span>
                <span>${jeux.date}</span>
            </div>
		</div>
	    `;

        const plateformes = divFicheLigne2.querySelector(".plateformes");
		for(let i=0; i<jeux.platforms.length; i++){
			const platElement = document.createElement("span");
			platElement.innerText = jeux.platforms[i].abbreviation;
			plateformes.append(platElement);
            if(i == 3){
				break;
			}
		}
        if(jeux.platforms.length > 4){
			const compteur = jeux.platforms.length - 4;
			const spanCompteur = document.createElement("span");
			spanCompteur.innerText = "+" + compteur;
			plateformes.append(spanCompteur);
		}

		divFicheJeux.append(divFicheLigne2);

        //Dernière partie avec les deux description différentes (courte + longue)
        const divFicheDesc = document.createElement("div");
        divFicheDesc.classList.add("divFicheDesc");

        divFicheDesc.innerHTML = `
		<div class="divDescriptions">
			<div class="divDescCourt">
                <p>Description Courte :</p>
                <p>${jeux.descCourt}</p>
            </div>
            <div class="divDescLong">
                <p>Description Longue :</p>
                <p>${jeux.descLong}</p>
            </div>
		</div>
	    `;

		divFicheJeux.append(divFicheDesc);

        //Bouton Ajouter à mes favoris
        const boutonAjouterJeux = document.createElement("div");
		boutonAjouterJeux.classList.add("bouton", "boutonOrange", "boutonAjouterJeux");
		boutonAjouterJeux.innerText = "Ajouter à mes Favoris";

        boutonAjouterJeux.onclick = () => {
            // const nom = Jeux.obtenirNomJeux();
			// 	if (!nom) {
			// 		return;
			// 	}
				DAO.ajouterAMesJeux(jeux);
				// alert("Jeux ajouté");
                let popup = new PopUp$1("Jeux ajouté !");
                divFicheJeux.append(popup.div);
        };
        divFicheJeux.append(boutonAjouterJeux);
    }
}

class App$1 {
    static sectionPage;

    static init() {
        DAO.chargerMesJeux();

        this.sectionPage = document.querySelector(".sectionPage");
        if (!this.sectionPage) {
			// throw new Error("sectionPage introuvable");
			let popup = new PopUp$1("sectionPage introuvable");
            divJeux.append(popup.div);
		}

        const boutonJeux = document.querySelector(".boutonJeux");
		if (!boutonJeux) {
			// throw new Error("boutonJeux introuvable");
			let popup = new PopUp$1("boutonJeux introuvable");
            divJeux.append(popup.div);
		}
		boutonJeux.addEventListener("click", GestionnaireJeux.clickBoutonJeux.bind(GestionnaireJeux));

        const boutonMesJeux = document.querySelector(".liMesFavoris");
		if (!boutonMesJeux) {
			// throw new Error("boutonMesJeux introuvable");
			let popup = new PopUp$1("boutonMesJeux introuvable");
            divJeux.append(popup.div);
		}
		boutonMesJeux.addEventListener("click", GestionnaireMesJeux.clickBoutonMesJeux.bind(GestionnaireMesJeux));

		const boutonRecherche = document.querySelector(".boutonRecherche");
		if (!boutonRecherche) {
			// throw new Error("boutonRecherche introuvable");
			let popup = new PopUp$1("boutonRecherche introuvable");
            divJeux.append(popup.div);
		}
		boutonRecherche.addEventListener("click", GestionnaireJeux.clickBoutonRecherche.bind(GestionnaireJeux));
    }

    static afficherLoaderSectionPage() {
		this.sectionPage.innerHTML = "";

		const loaderBalleCarree = document.createElement("div");
		loaderBalleCarree.classList.add("loaderBalleCarree");

		this.sectionPage.append(loaderBalleCarree);

        const loaderBarreGauche = document.createElement("div");
		loaderBarreGauche.classList.add("loaderBarreGauche");

		this.sectionPage.append(loaderBarreGauche);

        const loaderBarreDroite = document.createElement("div");
		loaderBarreDroite.classList.add("loaderBarreDroite");

		this.sectionPage.append(loaderBarreDroite);
	}
}

window.onload = App$1.init.bind(App$1);
