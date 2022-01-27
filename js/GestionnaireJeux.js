import DAO from "./DAO";
import App from "./App";
import DivSelectionJeux from "./Composants/DivSelectionJeux";
import Jeux from "./Models/Jeux";
import PopUp from "./Composants/PopUp";

export default class GestionnaireJeux {

    static async clickBoutonJeux() {
        App.afficherLoaderSectionPage();

        const mapJeux = await DAO.telechargerDonneesJeux();

        App.sectionPage.innerHTML = "";

        const divJeux = document.createElement("div");
        divJeux.classList.add("divJeux");

        App.sectionPage.append(divJeux);

        mapJeux.forEach(jeux=>{
	
			const divSelection = new DivSelectionJeux(jeux, this.afficherFicheJeux.bind(this));
			divJeux.append(divSelection.div);
		});
    }

    static async clickBoutonRecherche(nomJeux) {
        App.afficherLoaderSectionPage();

        const jeuxRechercher = await DAO.telechargerDonneesJeuxRecherche(nomJeux);

        App.sectionPage.innerHTML = "";

        const divJeux = document.createElement("div");
        divJeux.classList.add("divJeux");

        App.sectionPage.append(divJeux);

        jeuxRechercher.forEach(jeux=>{
	
			const divSelection = new DivSelectionJeux(jeux, this.afficherFicheJeux.bind(this));
			divJeux.append(divSelection.div);
		});
    }

    static afficherFicheJeux(jeux) {
        App.sectionPage.innerHTML = "";

        const divFicheJeux = document.createElement("div");
		divFicheJeux.classList.add("divFicheJeux");
		App.sectionPage.append(divFicheJeux);

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
                let popup = new PopUp("Jeux ajouté !");
                divFicheJeux.append(popup.div);
        }
        divFicheJeux.append(boutonAjouterJeux);
    }
}