import GestionnaireMesJeux from "./GestionnaireMesJeux";
import GestionnaireJeux from "./GestionnaireJeux";
import DAO from "./DAO";
import PopUp from "./Composants/PopUp";

export default class App {
    static sectionPage;

    static init() {
        DAO.chargerMesJeux();

        this.sectionPage = document.querySelector(".sectionPage");
        if (!this.sectionPage) {
			// throw new Error("sectionPage introuvable");
			let popup = new PopUp("sectionPage introuvable");
            divJeux.append(popup.div);
		}

        const boutonJeux = document.querySelector(".boutonJeux");
		if (!boutonJeux) {
			// throw new Error("boutonJeux introuvable");
			let popup = new PopUp("boutonJeux introuvable");
            divJeux.append(popup.div);
		}
		boutonJeux.addEventListener("click", GestionnaireJeux.clickBoutonJeux.bind(GestionnaireJeux));

        const boutonMesJeux = document.querySelector(".liMesFavoris");
		if (!boutonMesJeux) {
			// throw new Error("boutonMesJeux introuvable");
			let popup = new PopUp("boutonMesJeux introuvable");
            divJeux.append(popup.div);
		}
		boutonMesJeux.addEventListener("click", GestionnaireMesJeux.clickBoutonMesJeux.bind(GestionnaireMesJeux));

		const boutonRecherche = document.querySelector(".boutonRecherche");
		if (!boutonRecherche) {
			// throw new Error("boutonRecherche introuvable");
			let popup = new PopUp("boutonRecherche introuvable");
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

window.onload = App.init.bind(App);