import Jeux from "../Models/Jeux";

export default class DivSelectionJeux {
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