function createMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var myMetadata = data.metadata;
    var myResultArray = myMetadata.filter(sampleObj => sampleObj.id == sample);

    //Initializing the result
    var myResult = myResultArray[0];

    // Sample-metadatat selcted using d3
    var myPANEL = d3.select("#sample-metadata");
    myPANEL.html("");
    Object.entries(myResult).forEach(([key, value]) => {
      myPANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
}

// Creating charts 
//
function createCharts(sample) {
  d3.json("samples.json").then((data) => {
    // Defining Variables
    var samples = data.samples;
    var myResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = myResultArray[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    
    // Bubble Plot
    var bubblePlotLayout = {
      title: "<b>Bubble Chart for each OTU Sample </b>",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubblePlotData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    
    Plotly.newPlot("bubble", bubblePlotData, bubblePlotLayout);
    
    // Bar Chart

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Operational Taxonomic Units(OTUs)",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Initialize the dataset

function initData() {
  var selector = d3.select("#selDataset");

  // Selecting sample 

  d3.json("samples.json").then((data) => {
    var mySampleNames = data.names;
    // append data for each sample
    mySampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Getting first sample

    var FirstSample = mySampleNames[0];
    createCharts(FirstSample);
    createMetadata(FirstSample);
  });
}

// new sample using fetchnewdata
function fetchNewData(newSample) {
  // Get new data based on slected sample and plot charts
  createCharts(newSample);
  createMetadata(newSample);
}
// Initialize the dataset
initData();