//Declare variable for source URL, const as this will not change
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

//Use D3 to fetch the JSON data and then console log it
d3.json(url).then(function(data){
    console.log(data);
}); 

//Declare init (initialise) function - For each sample dataset it will populate the dropdown and the bar & bubble charts
function init(){

    //Declare dropdown list variable (from 'selDataset' HTML element) to select sample ids in the dataset
    let dropdown = d3.select("#selDataset");

    //Access sample data with d3
    d3.json(url).then((data) => {

        //Extract the sample ids from the names property in data
        let sample_ids = data.names;

        //Debug console log
        console.log(sample_ids);

        //Append each ID as a new value to the dropdown list
        for (id of sample_ids){
            //Each option value and text of the dropdown is set
            dropdown.append("option").attr("value", id).text(id);
        };

        //Extract the first sample entry for initialization of graphs
        let first_entry = sample_ids[0];
        //Debug console log
        console.log(first_entry);
    
        //Call the graph functions with the first entry (id 940)
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);
    });
};

// Horizontal bar chart function
function makeBar(sample){

    // Access the sample data for populating the bar chart
    d3.json(url).then((data) => {

        let sample_data = data.samples;
        // Apply a filter that matches based on sample id
        let results = sample_data.filter(id => id.id == sample);
        // Access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);
        // Store the first 10 results to display in the bar chart
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        // Create the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top Ten OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

// Bubble chart function
function makeBubble(sample){
    // Access the sample data for populating the bubble chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        // Apply a filter that matches based on sample id
        let results = sample_data.filter(id => id.id == sample);
        // Access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);
        // Store the results to display in the bubble chart
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        // Create the trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); //'bubble' is the html tag in index.html
    });
};

// Demographic info function
function makeDemographics(sample){
    // Access the sample data for populating the demographics section
    d3.json(url).then((data) => {
    // Access the demographic info (metadata) with d3
    let demographic_info = data.metadata;
    // Apply a filter that matches based on sample id
    let results = demographic_info.filter(id => id.id == sample);
    // Store the first result to display in demographic info
    let first_result = results[0];
    console.log(first_result);
    // Clear out previous entries in the demographic info section by setting the text to a blank string
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);
        // Select the demographic info html section with d3 and append new key-value pair
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

// Define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value){
    // Log the value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

// Initialize the application
init();
