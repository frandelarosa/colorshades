/*
 * Filename: colorshades.js
 * Path: assets/js
 * Created Date: Monday, December 30th 2019, 8:15:13 pm
 * Author: Fran de la Rosa
 * 
 * Main JS file of this project.
 */

let stepsDefVal = 30
let maxSteps = 50
var pickedColor = null
var steps = stepsDefVal
var colorPicker = null

let COLORBOX_TYPES = {

    TINTS  : "tints",
    SHADES : "shades"

}

let COLORBOX_COMBINATIONS = {

    ANALOGOUS     : 1,
    MONOCHROMATIC : 2,
    COMPLEMENTS   : 3,
    TRIAD         : 4,
    TETRAD        : 5

}

/**
 * Add color boxes inside the main content.
 * @param {enum} type Color box type.  
 * @param {string} validValue HEX or RGB color value.
 */
function addColorBox(type, validValue){

    var percent = 100 / steps
    var currentPercent = percent

    var fullLuminanceAdded = false
    var lowLuminanceAdded = false

    for (var i=0; i<steps; i++){

        var box_body = $("<div class='card-body'></div>")
        var box_header = $("<div class='card-color-header'></div>")
        var box = $("<div class='col-3'></div>").hide()
        var box_component = $("<div class='component'></div>")
        var box_card = $("<div class='card'></div>")
    
        // Create color
        var color = null

        if (type == COLORBOX_TYPES.TINTS){
            color = tinycolor(validValue).lighten(currentPercent)
        }else if (type == "shades"){
            color = tinycolor(validValue).darken(currentPercent)
        }

        var color_str = color.toString()
        $(box_header).css("background-color", color_str)

        // Check luminance low and high values
        if (type == COLORBOX_TYPES.TINTS){

            if (!fullLuminanceAdded && color.getLuminance() == 1){
                fullLuminanceAdded = true
            }else if (fullLuminanceAdded){
                break
            }

        }else if (type == COLORBOX_TYPES.SHADES){

            if (!lowLuminanceAdded && color.getLuminance() == 0){
                lowLuminanceAdded = true
            }else if (lowLuminanceAdded){
                break
            }
            
        }

        // Define body
        var valueHex = color.toHexString().toUpperCase()
        var valueHSL = color.toHslString()
        var valueRGB = color.toRgbString()

        var valuesStr = `<p>${valueHex}</p>
                         <p>${valueHSL}</p>
                         <p>${valueRGB}</p>`

        $(box_body).html(valuesStr);
    
        // Add layers
        $(box_header).appendTo(box_card)
        $(box_body).appendTo(box_card)
        $(box_card).appendTo(box_component)
        $(box_component).appendTo(box)
        
        // Append to row
        if (type == "shades"){
            $(box).appendTo("#shades_row").show("slow")
        }else if (type == "tints"){
            $(box).appendTo("#tints_row").show("slow")
        }
     
        // Increase value
        currentPercent += percent

    }

}

/**
 * Generate color variations based on number of stepts defined previously.
 */
function generateVariatons(){

    // Get color
    pickedColor = $("#selectedcolor").val();

    // Check if it's a valid color
    if (!tinycolor(pickedColor).isValid()){

        alert("Please enter a valid HEX, RGB or HSL value.")
        return

    }

    colorPicker.color.set(pickedColor)

    // Get total variations
    steps = parseInt($("#steps").val())

    // Check if it's a valid value
    if (steps == null || steps.length == 0 || steps > maxSteps || !Number.isInteger(steps)){

        steps = stepsDefVal
        $("#steps").val(steps)

    }

    // Delete rows
    deleteElementsFromRows()

    // Create tint and shades
    addColorBox(COLORBOX_TYPES.SHADES, pickedColor)
    addColorBox(COLORBOX_TYPES.TINTS, pickedColor)
    addCombinations(COLORBOX_COMBINATIONS.ANALOGOUS)

}

/**
 * Add color combinations.
 * @param {enum} type Color combinations.
 */
function addCombinations(type){

    // Delete old values first
    $("#combinations_row").empty()

    var colors = []

    switch(type){

        // Analogous
        case COLORBOX_COMBINATIONS.ANALOGOUS:
        colors = tinycolor(pickedColor).analogous()
        break

        // Monochromatic
        case COLORBOX_COMBINATIONS.MONOCHROMATIC:
        colors = tinycolor(pickedColor).monochromatic()
        break

        // Complements
        case COLORBOX_COMBINATIONS.COMPLEMENTS:
        colors = tinycolor(pickedColor).splitcomplement()
        break

        // Triad
        case COLORBOX_COMBINATIONS.TRIAD:
        colors = tinycolor(pickedColor).triad()
        break

        // Tetrad
        case COLORBOX_COMBINATIONS.TETRAD:
        colors = tinycolor(pickedColor).tetrad()
        break

    }

    // Create boxes
    for (var i=0; i<colors.length; i++){

        var color = colors[i]

        // Limit number of boxes to 4
        if (i == 4){ break }

        // Box skelleton
        var box_body = $("<div class='card-body'></div>")
        var box_header = $("<div class='card-color-header'></div>")
        var box = $("<div class='col-3'></div>").hide()
        var box_component = $("<div class='component'></div>")
        var box_card = $("<div class='card'></div>")

        // Define body
        var valueHex = color.toHexString().toUpperCase()
        var valueHSL = color.toHslString()
        var valueRGB = color.toRgbString()

        var valuesStr = `<p>${valueHex}</p>
                         <p>${valueHSL}</p>
                         <p>${valueRGB}</p>`

        $(box_body).html(valuesStr)

        // Add color to header
        $(box_header).css("background-color", color.toString())
    
        // Add layers
        $(box_header).appendTo(box_card)
        $(box_body).appendTo(box_card)
        $(box_card).appendTo(box_component)
        $(box_component).appendTo(box)

        // Add box to row
        $(box).appendTo("#combinations_row").show("slow")

    }

}

/**
 * Delete elements which are contained inside a row.
 */
function deleteElementsFromRows(){

    $("#shades_row").empty()
    $("#tints_row").empty()
    $("#combinations_row").empty()

}

/**
 * Generate a random color.
 */
function randomColor(){

    // Add default steps value to input
    $("#steps").val(steps)

    // Create a random color
    pickedColor = tinycolor.random().toString()

    deleteElementsFromRows()
    
    addColorBox("shades", pickedColor)
    addColorBox("tints", pickedColor)
    addCombinations(COLORBOX_COMBINATIONS.ANALOGOUS)

}

/**
 * Init color picket component.
 */
function initColorPicker(){

    colorPicker = new iro.ColorPicker('#colorPicker', {
        width: 180,
        color: pickedColor
    })

    colorPicker.on(["color:init", "color:change"], color => {

        pickedColor = color.hexString
        $("#selectedcolor").val(pickedColor)

    })

}