import DAO from "../DAO";

export default class Jeux {
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