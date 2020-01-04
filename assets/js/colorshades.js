function addColorBox(type, validValue){

    var steps = 30;
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

    // Get color from input text
    var hexcolor = $("#selectedcolor").val();

    deleteElementsFromRows();

    addColorBox("shades", hexcolor);
    addColorBox("tints", hexcolor);

}

function deleteElementsFromRows(){

    $("#shades_row").empty();
    $("#tints_row").empty();

}

function randomColor(){

    var random = tinycolor.random().toString();

    deleteElementsFromRows();
    
    addColorBox("shades", random);
    addColorBox("tints", random);

}