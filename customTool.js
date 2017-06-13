// handle a selection change for tool type
function durabilityInfo(){
	durability = document.getElementById("durability").value; //get the value of the durability from the dropdown.
	if(durability == 1){ // 1 means custom durability.
		document.getElementById("durabilityInfo").innerHTML = 'How much maximum durability does your tool have?<br><input type = "text" value = "1562" class = "textLine" id = "customDur"/>';
        document.getElementById("modelLimit").value = 1561; // Sets the default model limit to 1 less than the default durability for custom durability amount
	}
	else{ //existing tool
        // Flint and steel uses a negative number as fishing rods have the same durability, so Math.abs is used
		document.getElementById("durabilityInfo").innerHTML = 'Your selected tool has a durability of ' + Math.abs(durability) + '.';
        document.getElementById("modelLimit").value = Math.abs(durability) - 1;
	}
	dTex = "item/diamond_hoe"; //if no default paths can match, default to diamond_hoe.
	switch(durability){
		case "385":
			dTex = "item/bow";
			break;
		case "1562":
			dTex = "item/diamond_hoe";
			break;
		case "65":
			dTex = "item/fishing_rod"; //fishing rod and fint and steel have the same durability, just went for fishing rod as default.
			break;
        case "-65":
    		dTex = "item/flint_and_steel"; // Negative value allows both flint_and_steel and fishing rods to have default textures and models
    		break;
		case "33":
			dTex = "item/golden_hoe";
			break;
		case "251":
			dTex = "item/iron_hoe";
			break;
		case "238":
			dTex = "item/shears";
			break;
		case "132":
			dTex = "item/stone_hoe";
			break;
		case "60":
			dTex = "item/wooden_hoe";
			break;
		case "26":
			dTex = "item/carrot_on_a_stick";
			break;
	}
	document.getElementById("address").value = dTex;
}

function generate(){ //calculate all percentages
	var resultant = "";
	document.getElementById("generate").value = "Generating...";
	document.getElementById("result").innerHTML = ""; //clear any previous outputs
	maxDur = Math.abs(document.getElementById("durability").value); //durability Math.abs allows flint_and_steel to be a chosen
    maxModels = document.getElementById("modelLimit").value;
	address = document.getElementById("address").value; //default model address
	if(document.getElementById("unbreakable").checked){
		damaged = 0;
	}
	else{
		damaged = 1;
	}
	if(maxDur == 1){
		maxDur = document.getElementById("customDur").value; //update durability from 1 if a custom durability was entered.
	}
	inc = "";
	for (var i = 0; i <= maxModels && i < maxDur; i++){ // Checks both max amount of models and max durability so no models are only produed for durability values between 0 and 1.
		if(document.getElementById("inc").checked && i > 0){ inc = i;} // Rising number after model now on all models except 'damage: 0' and 'damaged: 1'
		j = Math.round(((1/maxDur)*i) * 10**15) / 10**15; // Should remove most floating point errors, by limiting numbers to 15 decimal places

        if (j > 0) {
            resultant += '{ "predicate": { "damaged": ' + damaged + ', "damage": ' + j + ' }, "model": "' + address + inc + '" },\n'; // Added spaces between the { } and predicate values
        }

        else {
            resultant += '{ "predicate": { "damage": ' + j + ' }, "model": "' + address + inc + '" },\n'; // If damage = 0, damaged predicate is unnecessary
        }
	}
	if(damaged == 0){
		resultant += '{ "predicate": { "damaged": 1 }, "model": "' + address + '" },\n'; // Removed the unnecessary "damage": 0
	}
	resultant = resultant.substring(0, resultant.length - 2); //remove the last comma from the string.
	if(document.getElementById("model").checked){
        address = address.replace(/item/, "items"); // Changed default texture path from item to items.
        address = address.replace(/en_/, "_"); // Changes texture path from golden_hoe to gold_hoe and wooden_hoe to wood_hoe.
        address = address.replace(/bow/, "bow_standby"); // Changes texture path from bow to bow_standby.
        address = address.replace(/rod/, "rod_uncast"); // Changes texture path from fishing_rod to fishing_rod_uncast.

		//generate a model file's JSON around the results.
		resultant = resultant.replace(/\n/g, '\n\t\t'); //tab indent the code by 2
        resultant = resultant.replace(/{}/, "");
		resultant = '{\n\t"parent": "item/handheld",\n\t"textures": {\n\t\t"layer0": "' + address + '"\n\t},\n\t"overrides": [\n\t\t' + resultant + '\n\t]\n}'; //add prefix and suffix.
	}
	document.getElementById("result").innerHTML = resultant;
	document.getElementById("result").className = 'wideCenteredTextArea';
	document.getElementById("generate").value = "Generate Code";
}
