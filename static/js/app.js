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
        CreateBar(first_entry);
        CreateBubble(first_entry);
        CreateDemographics(first_entry);
    });
};

//Declare Horizontal bar chart function
function CreateBar(sample){

    //Access sample data with d3 to populate bar chart
    d3.json(url).then((data) => {
        
        //Extract samples array from data
        let sample_data = data.samples;

        //Filter through array based on sample id
        let results = sample_data.filter(id => id.id == sample);

        //Access first entry in filtered results
        let first_result = results[0];
        //Debug console log
        console.log(first_result);

        //Extract first 10 elements
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        //Debug
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //Define the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        //Add chart title and plot
        let layout = {title: "Top Ten OTUs Chart"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

//Declare Bubble chart function
function CreateBubble(sample){

    //Access sample data with d3 to populate bubble chart
    d3.json(url).then((data) => {

        //Extract samples array from data
        let sample_data = data.samples;

        //Filter through array based on sample id
        let results = sample_data.filter(id => id.id == sample);

        //Access first entry in filtered results
        let first_result = results[0];
        //Debug
        console.log(first_result);

        //Extract data from first entry object
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        //Debug
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //Define the trace for bubble chart
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

        //Add chart and axis titles and plot
        let layout = {
            title: "Bacteria Count for Current ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Bacteria Count'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout);
    });
};

//Declare Demographic info function
function CreateDemographics(sample){

    //Access metadata with d3 to populate demographics section
    d3.json(url).then((data) => {

        //Extract demographic (metadata)
        let demographic_info = data.metadata;

        //Filter through array based on sample id
        let results = demographic_info.filter(id => id.id == sample);

        //Access first entry to display in demographic info
        let first_result = results[0];
        //Debug console log
        console.log(first_result);

        //Clear previous entries in demographic info section by setting the text to a blank string
        d3.select('#sample-metadata').text('');

        //Iterate over entry key/value pairs
        Object.entries(first_result).forEach(([key,value]) => {

            //Debug console log
            console.log(key,value);

            //Append key/value pair to demographic info html section
            d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
        });
    
    });
};

//Declare function for when dropdown changes (function name defined in index.html)
function optionChanged(value){

    //Debug
    console.log(value);

    CreateBar(value);
    CreateBubble(value);
    CreateDemographics(value);
};

//Application initialise
init();
