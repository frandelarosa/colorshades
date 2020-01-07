let stepsDefVal = 30;
var pickedColor = null;
var steps = stepsDefVal;
var colorPicker = null;

function addColorBox(type, validValue){

    var percent = 100 / steps;
    var currentPercent = percent;

    var fullLuminanceAdded = false;
    var lowLuminanceAdded = false;

    for (var i=0; i<steps; i++){

        var box_body = $("<div class='card-body'></div>");
        var box_header = $("<div class='card-color-header'></div>");
        var box = $("<div class='col-3'></div>").hide();
        var box_component = $("<div class='component'></div>");
        var box_card = $("<div class='card'></div>");
    
        // Create color
        var color = null;

        if (type == "tints"){
            color = tinycolor(validValue).lighten(currentPercent);
        }else if (type == "shades"){
            color = tinycolor(validValue).darken(currentPercent);
        }

        var color_str = color.toString();
        $(box_header).css("background-color", color_str);

        // Check luminance
        if (type == "tints"){

            if (!fullLuminanceAdded && color.getLuminance() == 1){
                fullLuminanceAdded = true;
            }else if (fullLuminanceAdded){
                break;
            }

        }else if (type == "shades"){

            if (!lowLuminanceAdded && color.getLuminance() == 0){
                lowLuminanceAdded = true;
            }else if (lowLuminanceAdded){
                break;
            }
            
        }

        // Define body
        var valueHex = color.toHexString().toUpperCase();
        var valueHSL = color.toHslString();
        var valueRGB = color.toRgbString();

        var valuesStr = `<p>${valueHex}</p>
                         <p>${valueHSL}</p>
                         <p>${valueRGB}</p>`;

        $(box_body).html(valuesStr);
    
        // Add layers
        $(box_header).appendTo(box_card);
        $(box_body).appendTo(box_card);
        $(box_card).appendTo(box_component);
        $(box_component).appendTo(box);
        
        // Append to row
        if (type == "shades"){
            $(box).appendTo("#shades_row").show("slow");
        }else if (type == "tints"){
            $(box).appendTo("#tints_row").show("slow");
        }
     
        // Increase value
        currentPercent += percent;

    }

}

function generateVariatons(){

    // Get color
    pickedColor = $("#selectedcolor").val();

    // Check if it's a valid color
    if (!tinycolor(pickedColor).isValid()){

        alert('Please enter a valid HEX, RGB or HSL value.');
        return;

    }

    colorPicker.color.set(pickedColor);

    // Get total variations
    steps = $("#steps").val();

    // Check if it's a valid value
    if (steps == null || steps.length == 0 || Number.isInteger(steps)){

        steps = stepsDefVal;
        $("#steps").val(steps);

    }
    
    steps = parseInt(steps);

    // Delete rows
    deleteElementsFromRows();

    // Create tint and shades
    addColorBox("shades", pickedColor);
    addColorBox("tints", pickedColor);
    addCombinations(1);
}

function addCombinations(type){

    // Delete old values first
    $("#combinations_row").empty();

    var colors = [];

    switch(type){

        // Analogous
        case 1:
        colors = tinycolor(pickedColor).analogous();
        break;

        // Monochromatic
        case 2:
        colors = tinycolor(pickedColor).monochromatic();
        break;

        // Complements
        case 3:
        colors = tinycolor(pickedColor).splitcomplement();
        break;

        // Triad
        case 4:
        colors = tinycolor(pickedColor).triad();
        break;

        // Tetrad
        case 5:
        colors = tinycolor(pickedColor).tetrad();
        break;

    }

    for (var i=0; i<colors.length; i++){

        var color = colors[i];

        if (i == 4){
            break;
        }

        var box_body = $("<div class='card-body'></div>");
        var box_header = $("<div class='card-color-header'></div>");
        var box = $("<div class='col-3'></div>").hide();
        var box_component = $("<div class='component'></div>");
        var box_card = $("<div class='card'></div>");

        // Define body
        var valueHex = color.toHexString().toUpperCase();
        var valueHSL = color.toHslString();
        var valueRGB = color.toRgbString();

        var valuesStr = `<p>${valueHex}</p>
                         <p>${valueHSL}</p>
                         <p>${valueRGB}</p>`;

        $(box_body).html(valuesStr);

        // Add color to header
        $(box_header).css("background-color", color.toString());
    
        // Add layers
        $(box_header).appendTo(box_card);
        $(box_body).appendTo(box_card);
        $(box_card).appendTo(box_component);
        $(box_component).appendTo(box);

        // Add to row
        $(box).appendTo("#combinations_row").show("slow");

    }

}

function deleteElementsFromRows(){

    $("#shades_row").empty();
    $("#tints_row").empty();
    $("#combinations_row").empty();

}

function randomColor(){

    // Add default steps value to input
    $("#steps").val(steps);

    // Create a random color
    pickedColor = tinycolor.random().toString();

    deleteElementsFromRows();
    
    addColorBox("shades", pickedColor);
    addColorBox("tints", pickedColor);
    addCombinations(1);

}

function initColorPicker(){

    colorPicker = new iro.ColorPicker('#colorPicker',{
        width: 180,
        color: pickedColor
    });

    colorPicker.on(["color:init", "color:change"], function(color){

        pickedColor = color.hexString;
        $("#selectedcolor").val(pickedColor);

  });

}