// URL for data
const URL =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/\
14-Interactive-Web-Visualizations/02-Homework/samples.json";

// define initial function, which defines dropdown and calls the rest of the functions

function init() {
  d3.json(URL)
    .then((response) => {
      const dropdownMenu = d3.select("#selDataset");
      const { names } = response;

      names.forEach((name) => {
        dropdownMenu.append("option").text(name).property("value", name);
      });

      const baseSampleID = names[0];
      console.log(`The default Sample ID is: ${baseSampleID}`);

      barPlot(baseSampleID);
      getMeta(baseSampleID);
      bubblePlot(baseSampleID);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// function to refresh data when selecting dataset
function optionChanged(selectTestID) {
  // Log selected ID to console
  console.log(`Newly selected sample ID is: ${selectTestID}`);

  // Refresh charts/meta
  barPlot(selectTestID);
  getMeta(selectTestID);
  bubblePlot(selectTestID);
}

// plot bar chart function
function barPlot(selectTestID) {
  const id = selectTestID;

  d3.json(URL)
    .then((response) => {
      const { samples } = response;

      let xVals, yVals, hover_text;

      for (let i = 0; i < samples.length; i++) {
        if (samples[i].id == id) {
          console.log("BAR PLOT Sample ID is: ", samples[i].id);
          xVals = samples[i].sample_values.slice(0, 10).reverse();
          yVals = samples[i].otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
          hover_text = samples[i].otu_labels.slice(0, 10).reverse();
        }
      }

      const trace1 = {
        x: xVals,
        y: yVals,
        type: "bar",
        orientation: "h",
        text: hover_text,
      };

      const bar_data = [trace1];

      const layout = {
        title: `Top 10 OTUs for ID = ${id}`,
      };

      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", bar_data, layout);
    })
    .catch((error) => console.error("Error plotting bar chart:", error));
}

// define meta function for demographicInfo
function getMeta(selectTestID) {
  const id = selectTestID;

  d3.json(URL)
    .then((response) => {
      const { metadata } = response;
      // select the metadata Div and use .html("") to clear it
      const demographicInfo = d3.select("#sample-metadata").html("");

      for (let i = 0; i < metadata.length; i++) {
        if (metadata[i].id == id) {
          console.log("METADATA Sample ID is: ", metadata[i].id);
          for (const key in metadata[i]) {
            demographicInfo.append("p").text(`${key}: ${metadata[i][key]}`);
          }
        }
      }
    })
    .catch((error) => console.error("Error fetching metadata:", error));
}

// define bubble chart function
function bubblePlot(selectTestID) {
  const id = selectTestID;

  d3.json(URL)
    .then((response) => {
      const { samples } = response;

      let xVals, yVals, hover_text;

      for (let i = 0; i < samples.length; i++) {
        if (samples[i].id == id) {
          console.log("BUBBLE PLOT Sample ID is: ", samples[i].id);

          xVals = samples[i].otu_ids;
          yVals = samples[i].sample_values;
          hover_text = samples[i].otu_labels;
        }
      }

      const trace2 = {
        x: xVals,
        y: yVals,
        text: hover_text,
        mode: "markers",
        marker: {
          size: yVals,
          color: xVals,
        },
      };

      const bubble_data = [trace2];

      const layout = {
        title: `Bubble Chart for ID = ${id}`,
      };

      // Render the plot to the div tag with id "bubble"
      Plotly.newPlot("bubble", bubble_data, layout);
    })
    .catch((error) => console.error("Error plotting bubble chart:", error));
}

init();
