// Add hover over function to the span elements with id "df_all", "para_on", "para_how", and "para_suff"
// when hovering over the corresponding span element, the tooltip will be appended beneth the span element

const span_ids = ["df_all", "para_on", "para_how", "para_suff"];
const tooltips = {
    "df_all": {
        "meaning": "Combines df_all with df_Apr DataFrame.",
        "options": []
    },
    "para_on": {
        "meaning": "Merges rows with matching 'City' values in both DataFrames.",
        "options": []
    },
    "para_how": {
        "meaning": "Determines rows inclusion from both DataFrames in merge.",
        "options": [
            { "left": "Includes <span class=\"diff\">all</span> rows from df_all, <span class=\"diff\">matching</span> rows from df_Apr." },
            { "right": "Includes <span class=\"diff\">all</span> rows from df_Apr, <span class=\"diff\">matching</span> rows from df_all." },
            { "outer": "Includes <span class=\"diff\">all rows</span> from both DataFrames, <span class=\"diff\">matching or not</span>." },
            { "inner": "Includes <span class=\"diff\">only matching</span> rows from both DataFrames." }
        ]
    },
    "para_suff": {
        "meaning": "Suffixes resolve column name conflicts.",
        "options": []
    }
};

const tooltip_width = 300;
const space_between_line_and_tooltip = 18;
const border_width = 5;
const space_between_line_and_code = 3;
const tooltip_border_colors = ["#52F2CC", "#52A5F2", "#F25287", "#52F258"];
const code_example_block = document.getElementById("codeExample");

function linkCodeToExplanations(line_mid, tooltip_mid, line_color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${Math.max(line_mid, tooltip_mid) - Math.min(line_mid, tooltip_mid)}px`);
    svg.setAttribute('height', '15px');

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${tooltip_mid - Math.min(line_mid, tooltip_mid)}`);
    line.setAttribute('y1', '15');
    line.setAttribute('x2', `${line_mid - Math.min(line_mid, tooltip_mid)}`);
    line.setAttribute('y2', '0');
    line.setAttribute('stroke-linecap', 'round');
    line.style.stroke = line_color;
    line.style.strokeWidth = '1px';

    // Add the line to the SVG element
    svg.appendChild(line);
    return svg;
}

function createTooltip(span, id) {
    // create a line element just beneth the span element
    let line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = "#fff";
    // set the width of the span element to the line's width
    line.style.width = span.offsetWidth + "px";
    line.style.height = space_between_line_and_tooltip + "px";
    line.style.borderTop = border_width + "px solid " + tooltip_border_colors[span_ids.indexOf(id)];
    line.id = "line_" + id;
    line.className = "lines";

    let tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#fff";
    // only show the border on the top side
    tooltip.style.borderTop = border_width + "px solid " + tooltip_border_colors[span_ids.indexOf(id)];
    tooltip.style.zIndex = "1";
    // set the width of the span element to the tooltip's width
    tooltip.style.width = tooltip_width + "px";

    // add meaning to the tooltip as a div element
    let meaning = document.createElement("div");
    meaning.id = "meaning_" + id;
    meaning.innerHTML = tooltips[id]["meaning"];
    meaning.style.fontWeight = "bold";
    meaning.style.margin = "10px 0";
    tooltip.appendChild(meaning);

    // set font
    tooltip.style.fontFamily = "Helvetica";
    tooltip.style.fontSize = "24px";
    tooltip.style.lineHeight = 1.5;
    tooltip.style.padding = "10px";
    // add shadow
    tooltip.style.boxShadow = "0px 3px 3px 2px rgba(0, 0, 0, 0.3)";
    tooltip.id = "tooltip_" + id;
    tooltip.className = "tooltips";
    // add options as radio buttons
    if (tooltips[id]["options"].length > 0) {
        tooltip.style.width = "500px";
        // add a line to separate the meaning and the options
        let breakline = document.createElement("hr");
        breakline.style.width = "100%";
        breakline.style.border = "2px solid " + tooltip_border_colors[span_ids.indexOf(id)];
        breakline.style.margin = "5px 0px";
        tooltip.appendChild(breakline);
        for (let option of tooltips[id]["options"]) {
            // align the radio buttons and radio names in the same line
            let div = document.createElement("div");
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = id;
            radio.value = Object.keys(option)[0];
            radio.style.marginRight = "10px";
            radio.style.display = "inline-block";
            // make the radio larger
            radio.style.transform = "scale(2)";
            radio.style.float = "left";
            radio.style.margin = "12px 5px 0px 5px";
            // check the first radio button by default
            if (Object.keys(option)[0] === "left") {
                radio.checked = true;
            }
            div.appendChild(radio);
            let radio_name = document.createElement("label");
            // bold the key of the option but not the value
            radio_name.innerHTML = '<span class="option_name">' + Object.keys(option)[0] + "</span>: " +
                '<span class="option_value">' + Object.values(option)[0] + "</span>";
            radio_name.style.display = "inline-block";
            radio_name.style.width = "450px";
            radio_name.style.margin = "0px 10px";
            div.appendChild(radio_name);
            tooltip.appendChild(div);

            // add event listener to the radio button
            // if the radio button is clicked, change the text of the span element: "how='" + Object.keys(option)[0] + "'";
            // also update the tooltip text
            radio.addEventListener("click", function () {
                let span = document.getElementById(id);
                span.innerHTML = span.innerHTML.split("how=")[0] + "how='" + Object.keys(option)[0] + "'";
                let meaning = document.getElementById("meaning_" + id);
                meaning.innerHTML = tooltips[id]["meaning"] + " " + Object.values(option)[0];
            });
        }
    }

    // calculate the position of the line link
    code_example_block.appendChild(tooltip);
    code_example_block.appendChild(line);
    // set the position of the tooltip to be beneth the span element
    tooltip.style.left = span.offsetLeft + "px";
    tooltip.style.top = span.offsetTop + span.offsetHeight + space_between_line_and_tooltip + "px";
    line.style.left = span.offsetLeft + "px";
    line.style.top = span.offsetTop + span.offsetHeight + space_between_line_and_code + "px";
    // add a line to link from the middle of the line to the middle of the top border of the tooltip
    /* let link = linkCodeToExplanations(span.offsetLeft + span.offsetWidth / 2, span.offsetLeft + tooltip_width / 2, tooltip_border_colors[span_ids.indexOf(id)]);
    code_example_block.appendChild(link);
    link.style.position = "absolute";
    link.style.left = span.offsetLeft + span.offsetWidth / 2 + "px";
    link.style.top = span.offsetTop + span.offsetHeight + 3 + "px";
    console.log(span.offsetLeft, link); */
    // hide the tooltip and the line by default
    tooltip.style.display = "none";
    line.style.display = "none";
}

for (let id of span_ids) {
    let span = document.getElementById(id);
    createTooltip(span, id);
    span.addEventListener("mouseover", function () {
        // hide all the tooltips and lines first using the className
        let tooltips = document.getElementsByClassName("tooltips");
        for (let tooltip of tooltips) {
            tooltip.style.display = "none";
        }
        let lines = document.getElementsByClassName("lines");
        for (let line of lines) {
            line.style.display = "none";
        }


        let tooltip = document.getElementById("tooltip_" + id);
        let line = document.getElementById("line_" + id);
        if (tooltip && line) {
            tooltip.style.display = "block";
            line.style.display = "block";
        }
    });
    // when the mouse is out of the span element, remove the tooltip and the line
    // if the mouse is out of the span element but within the line or the tooltip, then the tooltip and the line will not be removed
    span.addEventListener("mouseout", function (event) {
        let tooltip = document.getElementById("tooltip_" + id);
        let line = document.getElementById("line_" + id);
        if (tooltip && line) {
            if (event.relatedTarget !== tooltip && event.relatedTarget !== line) {
                tooltip.style.display = "none";
                line.style.display = "none";
            }
        }
    });
}

// by clicking on outside of the tooltip, the tooltip will be hidden
document.addEventListener("click", function (event) {
    for (let id of span_ids) {
        let tooltip = document.getElementById("tooltip_" + id);
        if (tooltip && event.target !== tooltip && !tooltip.contains(event.target)) {
            tooltip.style.display = "none";
            let line = document.getElementById("line_" + id);
            line.style.display = "none";
        }
    }
});