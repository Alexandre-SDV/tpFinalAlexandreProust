import DAO from "./DAO";
import App from "./App";
import DivSelectionJeux from "./Composants/DivSelectionJeux";
import Jeux from "./Models/Jeux";
import PopUp from "./Composants/PopUp";

export default class GestionnaireMesJeux {

    static clickBoutonMesJeux() {
        const mesJeux = DAO.chargerMesJeux();

        App.sectionPage.innerHTML = "";

        const divMesJeux = document.createElement("div");
		divMesJeux.classList.add("divMesJeux");
		App.sectionPage.append(divMesJeux);

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


        App.sectionPage.innerHTML = `
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

        const divFicheBoutonRetour = App.sectionPage.querySelector(".divFicheBoutonRetour");
        divFicheBoutonRetour.onclick = () => {
            this.clickBoutonMesJeux();
        }

        const plateformes = App.sectionPage.querySelector(".plateformes");
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
        const divFicheJeux = App.sectionPage.querySelector(".divFicheJeux");
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
                let popup = new PopUp("Jeux supprimé !");
                divFicheJeux.append(popup.div);
        }
        divFicheJeux.append(boutonRetirerJeux);
    }
}
