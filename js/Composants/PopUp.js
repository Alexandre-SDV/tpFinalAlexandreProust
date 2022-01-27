export default class PopUp {
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