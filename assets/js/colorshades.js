/*
    https://github.com/bgrins/TinyColor

*/

let stepsDefVal = 30;

var initColor = null;
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
    var validColor = tinycolor(pickedColor);

    if (!validColor.isValid()){

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

}

function deleteElementsFromRows(){

    $("#shades_row").empty();
    $("#tints_row").empty();

}

function randomColor(){

    // Add default steps value to input
    $("#steps").val(steps);

    // Create a random color
    initColor = tinycolor.random().toString();

    deleteElementsFromRows();
    
    addColorBox("shades", initColor);
    addColorBox("tints", initColor);

}

function initColorPicker(){

    colorPicker = new iro.ColorPicker('#colorPicker',{
        width: 180,
        color: initColor
    });

    // https://iro.js.org/guide.html#color-picker-events
    colorPicker.on(["color:init", "color:change"], function(color){

        pickedColor = color.hexString;
        $("#selectedcolor").val(pickedColor);
    // // Show the current color in different formats
    // // Using the selected color: https://iro.js.org/guide.html#selected-color-api
    // values.innerHTML = [
    //   "hex: " + color.hexString,
    //   "rgb: " + color.rgbString,
    //   "hsl: " + color.hslString,
    // ].join("<br>");
  });

}