// Add hover over function to the span elements with id "df_all", "para_on", "para_how", and "para_suff"
// when hovering over the corresponding span element, the tooltip will be appended beneth the span element

const span_ids = ["df_all", "para_on", "para_how", "para_suff"];
const usedParameters = {
    "df_all": {
        "meaning": "Combines df_all with df_Apr DataFrame.",
        "options": []
    },
    "on": {
        "meaning": "Merges rows with matching 'City' values in both DataFrames.",
        "options": []
    },
    "how": {
        "meaning": "Determines rows inclusion from both DataFrames in merge.",
        "options": [
            { "left": "Includes <span class=\"diff\">all</span> rows from df_all, <span class=\"diff\">matching</span> rows from df_Apr." },
            { "right": "Includes <span class=\"diff\">all</span> rows from df_Apr, <span class=\"diff\">matching</span> rows from df_all." },
            { "outer": "Includes <span class=\"diff\">all rows</span> from both DataFrames, <span class=\"diff\">matching or not</span>." },
            { "inner": "Includes <span class=\"diff\">only matching</span> rows from both DataFrames." }
        ]
    },
    "suff": {
        "meaning": "Suffixes resolve column name conflicts.",
        "options": []
    }
};

const unusedParameters = {
    "left_on": {
        "meaning": "Specifies the column or index level names from the left DataFrame to use as keys for the join.",
        "options": []
    },
    "right_on": {
        "meaning": "Specifies the column or index level names from the right DataFrame to use as keys for the join.",
        "options": []
    },
    "left_index": {
        "meaning": "Indicates whether the index of the left DataFrame should be used as the join key.",
        "options": [
            { "False": "Do not use <span class=\"diff\">index</span> from left DataFrame as join key." },
            { "True": "Use <span class=\"diff\">index</span> from left DataFrame as join key." }
        ]
    },
    "right_index": {
        "meaning": "Indicates whether the index of the right DataFrame should be used as the join key.",
        "options": [
            { "False": "Do not use <span class=\"diff\">index</span> from right DataFrame as join key." },
            { "True": "Use <span class=\"diff\">index</span> from right DataFrame as join key." }
        ]
    },
    "sort": {
        "meaning": "Determines whether to sort the resulting DataFrame by the join keys after merging.",
        "options": [
            { "False": "Do not sort the result DataFrame by the <span class=\"diff\">join keys</span>." },
            { "True": "Sort the result DataFrame by the <span class=\"diff\">join keys</span>." }
        ]
    },
    "copy": {
        "meaning": "Determines whether to copy data from the original DataFrames during the merge.",
        "options": [
            { "False": "Do not copy data from <span class=\"diff\">original DataFrames</span>." },
            { "True": "Copy data from <span class=\"diff\">original DataFrames</span>." }
        ]
    },
    "indicator": {
        "meaning": "Specifies whether to add a column to the resulting DataFrame that indicates the source DataFrame of each row.",
        "options": [
            { "False": "Do not add a column indicating the <span class=\"diff\">source of each row</span>." },
            { "True": "Add a column indicating the <span class=\"diff\">source of each row</span>." }
        ]
    },
    "validate": {
        "meaning": "Checks whether the merge conforms to a specified type (e.g., 'one_to_one', 'one_to_many', etc.).",
        "options": [
            { "None": "Do not check if merge is of <span class=\"diff\">specified type</span>." },
            { "one_to_one": "Check for <span class=\"diff\">one-to-one</span> merge." },
            { "one_to_many": "Check for <span class=\"diff\">one-to-many</span> merge." },
            { "many_to_one": "Check for <span class=\"diff\">many-to-one</span> merge." },
            { "many_to_many": "Check for <span class=\"diff\">many-to-many</span> merge." }
        ]
    }
};

const parameterCombinations = {
    "must use together": [
        {
            "reason": "If using 'left_on' or 'right_on', you need to specify columns from both DataFrames to merge on specific columns rather than indexes.",
            "content": [
                { "left_on": "column_name_from_left_df" },
                { "right_on": "column_name_from_right_df" }
            ]
        }
    ],
    "recommend to use together": [
        {
            "reason": "Using 'sort' can be beneficial with 'outer' join to organize the merged data, especially when the DataFrames have different index orders.",
            "content": [
                { "how": "outer" },
                { "sort": "True" }
            ]
        }
    ],
    "forbid to use together": [
        {
            "reason": "Using 'left_index' and 'left_on' together, or 'right_index' and 'right_on' together is not allowed as they are mutually exclusive in specifying join keys.",
            "content": [
                { "left_index": "True" },
                { "left_on": "column_name" }
            ]
        },
        {
            "reason": "Using 'right_index' and 'right_on' together is not allowed as they are mutually exclusive in specifying join keys.",
            "content": [
                { "right_index": "True" },
                { "right_on": "column_name" }
            ]
        }
    ]
};


const tooltip_width = 20;
const space_between_line_and_tooltip = 18;
const border_width = 5;
const space_between_line_and_code = 3;
const tooltip_border_colors = ["#52F2CC", "#52A5F2", "#F25287", "#52F258"];
const recommend_color = { "must use together": "#52A5F2", "recommend to use together": "#52F258", "forbid to use together": "#F25287" };
const code_example_block = document.getElementById("codeExample");
const explainer = document.getElementById("explainer");
const recommendation = document.getElementById("recommendation");

function linkCodeToExplanations(span, tooltip, line_color) {
    var line_mid = span.offsetLeft + span.offsetWidth / 2;
    var tooltip_mid = tooltip.offsetLeft + tooltip.offsetWidth / 2;
    var height = 401 - span.offsetTop - span.offsetHeight - space_between_line_and_code;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${Math.max(line_mid, tooltip_mid) - Math.min(line_mid, tooltip_mid)}px`);
    svg.setAttribute('height', `${height}px`);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${tooltip_mid - Math.min(line_mid, tooltip_mid)}`);
    line.setAttribute('y1', `${height}`);
    line.setAttribute('x2', `${line_mid - Math.min(line_mid, tooltip_mid)}`);
    line.setAttribute('y2', '0');
    line.setAttribute('stroke-linecap', 'round');
    line.style.stroke = line_color;
    line.style.strokeWidth = '1px';

    // Add the line to the SVG element
    svg.appendChild(line);
    // Add the SVG element to the document
    code_example_block.appendChild(svg);
    svg.style.position = "absolute";
    if (line_mid < tooltip_mid) {
        svg.style.left = span.offsetLeft + span.offsetWidth / 2 + "px";
    } else {
        svg.style.left = tooltip.offsetLeft + tooltip.offsetWidth / 2 + "px";
    }
    svg.style.top = span.offsetTop + span.offsetHeight + 3 + "px";
}

function clean_all_before_hover() {
    // remove all container divs
    let containers = document.getElementsByClassName("containers");
    for (let container of containers) {
        container.style.backgroundColor = "transparent";
        container.remove();
    }
    // remove the background color of the option divs
    let option_divs = document.getElementsByClassName("option_divs");
    for (let option_div of option_divs) {
        option_div.style.backgroundColor = "transparent";
    }
    // adjust the line width and start position
    let lines = document.getElementsByClassName("lines");
    for (let line of lines) {
        let id = line.id.split("line_")[1];
        let span = document.getElementById("para_" + id);
        line.style.width = span.offsetWidth + "px";
        line.style.left = span.offsetLeft + "px";
    }
    // move all tooltips to align with their corresponding span elements
    let tooltips = document.getElementsByClassName("tooltips");
    for (let tooltip of tooltips) {
        let id = tooltip.id.split("tooltip_")[1];
        let span = document.getElementById("para_" + id);
        decide_tooltip_position(tooltip, span)
    }
    // hide the recommendation
    let recommendation = document.getElementById("recommendation");
    recommendation.style.display = "none";

    // remove all the svg
    let svgs = document.getElementsByTagName("svg");
    for (let svg of svgs) {
        svg.remove();
    }
}
function solve_overlap_tooltips(tooltips, color = "") {
    // tooltips is an array of 2 tooltip elements
    // first two tooltips are the regular tooltips
    // get the left position of the two tooltips' span's left position
    let span_1 = document.getElementById("para_" + tooltips[0].id.split("tooltip_")[1]);
    let span_1_left = span_1.offsetLeft;
    let span_1_width = span_1.offsetWidth;
    // get width in vw
    let tooltip_1_width = tooltips[0].offsetWidth;
    let span_2 = document.getElementById("para_" + tooltips[1].id.split("tooltip_")[1]);
    let span_2_left = span_2.offsetLeft;
    let span_2_width = span_2.offsetWidth;
    let tooltip_2_width = tooltips[1].offsetWidth;
    // recommendation tooltip width is 20vw, the totall width is 95vw
    // there are three cases to consider, 
    // width = 20vw and width = 30vw, total width is 70vw, space between the two tooltips is 12.5vw
    // width = 20vw and width = 20vw, total width is 60vw, space between the two tooltips is 17.5vw
    // width = 30vw and width = 30vw, total width is 80vw, space between the two tooltips is 7.5vw
    // decide the space:
    let code_example_block_width = code_example_block.offsetWidth;
    let unit = code_example_block_width / 98;

    let space = 0;
    if (tooltip_1_width < code_example_block_width / 4 && tooltip_2_width < code_example_block_width / 4) {
        space = 17.5 * unit;
    } else if (tooltip_1_width > code_example_block_width / 4 && tooltip_2_width > code_example_block_width / 4) {
        space = 7.5 * unit;
    } else {
        space = 12.5 * unit;
    }
    if (span_1_left < span_2_left) {
        var new_left_1 = 3 * unit;
        var new_left_2 = 3 * unit + tooltip_1_width + space;
        tooltips[0].style.left = 3 * unit + "px";
        tooltips[1].style.left = 3 * unit + tooltip_1_width + space + "px";
    } else {
        var new_left_1 = 3 * unit + tooltip_2_width + space;
        var new_left_2 = 3 * unit;
        tooltips[0].style.left = 3 * unit + tooltip_2_width + space + "px";
        tooltips[1].style.left = 3 * unit + "px";
    }
    // remove all svg elements
    let svgs = document.getElementsByTagName("svg");
    for (let svg of svgs) {
        svg.remove();
    }
    // create a new link
    if (color == "") {
        color = tooltip_border_colors[1];
    }
    // also change the color of the line
    let line_1 = document.getElementById("line_" + span_1.id.split("para_")[1]);
    let line_2 = document.getElementById("line_" + span_2.id.split("para_")[1]);
    line_1.style.borderTop = border_width + "px solid " + color;
    line_2.style.borderTop = border_width + "px solid " + color;
    // change the color of tooltip's border top
    tooltips[0].style.borderTop = border_width + "px solid " + color;
    tooltips[1].style.borderTop = border_width + "px solid " + color;
    // create a new link
    linkCodeToExplanations(span_1, tooltips[0], color);
    linkCodeToExplanations(span_2, tooltips[1], color);
}

function createTooltip(parameter, id) {
    originalId = "para_" + id;
    let thisColor = tooltip_border_colors[1];
    let span = document.getElementById(originalId);
    // create a line element just beneth the span element
    let line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = "#fff";
    // set the width of the span element to the line's width
    line.style.width = span.offsetWidth + "px";
    line.style.height = space_between_line_and_code + "px";
    // make the line transparent
    line.backgroundColor = "transparent";
    line.id = "line_" + id;
    line.className = "lines";
    line.style.borderTop = border_width + "px solid " + thisColor;

    let tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#fff";
    // only show the border on the top side
    tooltip.style.borderTop = border_width + "px solid " + thisColor;
    tooltip.style.zIndex = "1";
    // set the width of the span element to the tooltip's width
    tooltip.style.width = tooltip_width + "vw";

    // add meaning to the tooltip as a div element
    let meaning = document.createElement("div");
    meaning.id = "meaning_" + id;
    meaning.innerHTML = parameter[id]["meaning"];
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
    if (parameter[id]["options"].length > 0) {
        tooltip.style.width = "30vw";
        // add a line to separate the meaning and the options
        let breakline = document.createElement("hr");
        breakline.style.width = "100%";
        breakline.style.border = "2px solid gray";
        breakline.style.margin = "5px 0px";
        tooltip.appendChild(breakline);

        let radio_order = 0
        for (let option of parameter[id]["options"]) {
            // align the radio buttons and radio names in the same line
            let div = document.createElement("div");
            div.id = id + "_option_" + Object.keys(option)[0];
            div.className = "option_divs";
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
            if (radio_order === 0) {
                radio.checked = true;
                radio_order++;
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

            div.addEventListener("mouseover", function (e) {
                // avoid the pointer event to be captured by the parent element
                e.stopPropagation();

                // if the option is in parameterCombinations, then, show the combinations
                // if e.target is a label element, then, get the parent element
                if (e.target.tagName === "LABEL") {
                    var e_div = e.target.parentElement;
                } else if (e.target.tagName === "SPAN") {
                    var e_div = e.target.parentElement.parentElement;
                } else if (e.target.tagName === "INPUT") {
                    var e_div = e.target.parentElement;
                } else {
                    var e_div = e.target;
                }

                // 1. get the value of the option and id by splitting the id of the div element
                let id = e_div.id.split("_option_")[0];
                //let option = e_div.id.split("_option_")[1];

                // 2. check if the option is in parameterCombinations
                for (let key in parameterCombinations) {
                    // key is the level of the combination, like "must use together", "recommend to use together", "forbid to use together"
                    for (let combination of parameterCombinations[key]) {
                        for (let content of combination["content"]) {
                            if (id in content) {
                                let this_tooltip = document.getElementById("tooltip_" + id);
                                // find the corresponding tooltips to show the combinations
                                let tooltips = document.getElementsByClassName("tooltips");
                                for (let tooltip of tooltips) {
                                    for (let other_option of combination["content"]) {
                                        let tooltip_id = tooltip.id.split("tooltip_")[1];
                                        if (tooltip_id in other_option && tooltip_id !== id) {
                                            // if the tooltip_id is in unusedParameters, then, check whether it is displayed
                                            // if not, then skip
                                            if (Object.keys(unusedParameters).includes(tooltip_id)) {
                                                if (document.getElementById("unused").style.display === "none") {
                                                    continue;
                                                }
                                            }
                                            tooltip.style.display = "block";
                                            let tooltip_color = tooltip_border_colors[1];
                                            // also show the line
                                            let line = document.getElementById("line_" + tooltip_id);
                                            line.style.display = "block";
                                            solve_overlap_tooltips([this_tooltip, tooltip], recommend_color[key]);
                                            // add a background to the option div that in the combination
                                            let option_div = document.getElementById(tooltip_id + "_option_" + other_option[tooltip_id]);
                                            if (option_div) {
                                                option_div.style.backgroundColor = recommend_color[key];
                                            } else {
                                                // add a container div to hold the option div
                                                let container = document.createElement("div");
                                                container.id = tooltip_id + "_container";
                                                container.style.backgroundColor = recommend_color[key];
                                                container.className = "containers";
                                                // if the option is not in the tooltip, then, add the option to the tooltip without radio buttons
                                                // add a breakline
                                                let breakline = document.createElement("hr");
                                                breakline.style.width = "100%";
                                                breakline.style.border = "2px solid " + recommend_color[key];
                                                breakline.style.margin = "5px 0px";
                                                container.appendChild(breakline);
                                                let div = document.createElement("div");
                                                div.id = tooltip_id + "_option_" + other_option[tooltip_id];
                                                div.className = "option_divs";
                                                div.innerHTML = '<span class="option_name">' + other_option[tooltip_id] + "</span>";
                                                div.style.backgroundColor = "#f0f0f0";
                                                div.style.padding = "5px";
                                                container.appendChild(div);

                                                // add the container to the tooltip
                                                tooltip.appendChild(container);
                                            }
                                            let recommendation = document.getElementById("recommendation");
                                            recommendation.style.display = "block";
                                            if (this_tooltip.offsetTop > tooltip.offsetTop) {
                                                recommendation.style.top = this_tooltip.offsetTop + "px";
                                            } else {
                                                recommendation.style.top = tooltip.offsetTop + "px";
                                            }
                                            let recommendation_left = document.getElementById("recommendationLeft");
                                            recommendation_left.style.backgroundColor = recommend_color[key];

                                            let recommendation_title = document.getElementById("recommendationTitle");
                                            recommendation_title.innerText = key;
                                            recommendation_title.style.background = "linear-gradient(to right, " + recommend_color[key] + ", rgba(252, 252, 252, 0))";
                                            let recommendation_text = document.getElementById("recommendationText");
                                            recommendation_text.innerText = combination["reason"];
                                        } else {
                                            let option_div = document.getElementById(tooltip_id + "_option_" + other_option[tooltip_id]);
                                            if (option_div) {
                                                option_div.style.backgroundColor = recommend_color[key];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            radio.addEventListener("click", function (e) {
                let id = e.target.parentElement.id.split("_option_")[0];
                let span = document.getElementById("para_" + id);
                // if the option is True, False, or None, then, do not add '' to the value
                if (Object.keys(option)[0] === "True" || Object.keys(option)[0] === "False" || Object.keys(option)[0] === "None") {
                    span.innerHTML = span.innerHTML.split("=")[0] + "=" + Object.keys(option)[0];
                } else {
                    span.innerHTML = span.innerHTML.split("=")[0] + "='" + Object.keys(option)[0] + "'";
                }
                // update the line width
                let line = document.getElementById("line_" + id);
                line.style.width = span.offsetWidth + "px";
                let meaning = document.getElementById("meaning_" + id);
                meaning.innerHTML = parameter[id]["meaning"] + " " + Object.values(option)[0];
                // update all lines' left position
                let lines = document.getElementsByClassName("lines");
                for (let l of lines) {
                    // get the corresponding span element
                    let id_line = l.id.split("line_")[1];
                    let line_s_span = document.getElementById("para_" + id_line);
                    l.style.left = line_s_span.offsetLeft + "px";
                }
            });
        }
    }

    // calculate the position of the line link
    explainer.appendChild(tooltip);
    code_example_block.appendChild(line);
    // set the position of the tooltip to be beneth the span element
    decide_tooltip_position(tooltip, span);
    tooltip.style.top = "401 px";
    line.style.left = span.offsetLeft + "px";
    line.style.top = span.offsetTop + span.offsetHeight + space_between_line_and_code + "px";

    // hide the tooltip and the line by default
    tooltip.style.display = "none";
    line.style.display = "none";
    return span;
}

function decide_tooltip_position(tooltip, span) {
    if (span.offsetLeft + tooltip.offsetWidth > explainer.offsetWidth) {
        tooltip.style.left = explainer.offsetWidth - tooltip.offsetWidth + "px";
    } else {
        tooltip.style.left = span.offsetLeft + "px";
    }
}

function createTooltipFromAnObject(parameter) {
    for (const id in parameter) {
        // let span = document.getElementById(id);
        let span = createTooltip(parameter, id);
        span.addEventListener("mouseover", function (e) {
            let id = e.target.id.split("para_")[1];
            let span_event = document.getElementById("para_" + id);
            clean_all_before_hover();
            // hide all the tooltips and lines first using the className
            let tooltips = document.getElementsByClassName("tooltips");
            for (let tooltip of tooltips) {
                tooltip.style.display = "none";
            }
            let lines = document.getElementsByClassName("lines");
            for (let line of lines) {
                line.style.display = "none";
            }

            // remove all svg elements
            let svgs = document.getElementsByTagName("svg");
            for (let svg of svgs) {
                svg.remove();
            }

            let tooltip = document.getElementById("tooltip_" + id);
            let line = document.getElementById("line_" + id);
            if (tooltip && line) {
                tooltip.style.display = "block";
                decide_tooltip_position(tooltip, span_event);
                let line = document.getElementById("line_" + id);
                line.style.display = "block";
                linkCodeToExplanations(span_event, tooltip, tooltip_border_colors[1]);

            }
        });
        // when the mouse is out of the span element, remove the tooltip and the line
        // if the mouse is out of the span element but within the line or the tooltip, then the tooltip and the line will not be removed
        // span.addEventListener("mouseout", function (event) {
        //     // if the target's id contains the id of the span element, then, do not remove the tooltip and the line
        //     if (event.target && event.target.id && event.target.id.includes(id)) {
        //         let tooltip = document.getElementById("tooltip_" + id);
        //         tooltip.style.display = "none";
        //         let line = document.getElementById("line_" + id);
        //         line.style.display = "none";
        //     }
        // });
    }

    // by clicking on outside of the tooltip, the tooltip will be hidden
    document.addEventListener("click", function (event) {
        for (let id of Object.keys(parameter)) {
            let tooltip = document.getElementById("tooltip_" + id);
            if (tooltip && event.target !== tooltip && !tooltip.contains(event.target)) {
                tooltip.style.display = "none";
                let line = document.getElementById("line_" + id);
                line.style.display = "none";
                // remove all svg elements
                let svgs = document.getElementsByTagName("svg");
                for (let svg of svgs) {
                    svg.remove();
                }
            }
        }
    });
}

createTooltipFromAnObject(usedParameters);

document.getElementById("btn_show_unused").addEventListener("click", function (event) {
    let unused = document.getElementById("unused");
    if (unused.style.display === "none") {
        unused.style.display = "inline";
        createTooltipFromAnObject(unusedParameters);
        clean_all_before_hover();
    } else {
        unused.style.display = "none";
        clean_all_before_hover();
    }
})