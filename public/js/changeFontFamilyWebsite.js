("use strict");

const changeFontFamily = document.getElementById("changeFontFamily");
changeFontFamily.addEventListener("click", () => {
	// Get the computed style of the element
	const computedStyle = window.getComputedStyle(document.body);
	// Get the value of the font-family property
	const fontFamily = computedStyle.fontFamily;

	//console.log("Font Family before change:", fontFamily);
	if (
		fontFamily ===
		'"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif'
	) {
		document.body.style.fontFamily = "font-family";
	} else {
		document.body.style.fontFamily =
			'"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif';
	}
});
