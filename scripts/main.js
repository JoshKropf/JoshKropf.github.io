/*
    data[0] => U.S. Civil War
        side1 => Confederacy
        side2 => Union
*/
const data = [];
var confState = [];
var loc = '';
var notInUS = ["Hawaii","Alaska", "Arizona", "Washington", "New Mexico","Oklahoma","Utah", "Wyoming", "Idaho", "Washington", "Montana", "South Dakota", "North Dakota", "Colorado", "Nebraska","Nevada"] 
var infoData = [],
    infoDataIdx = -1,
    infoPanel,
    keyEvents,
    tooltip,
    map;

function init() {
    loadInfoData('./data/eventsUSCivilWar.csv');
    loadData('./data/UScivilwar.csv');
    // loadData('./data/Russiancivilwar.csv')
    // loadData('./data/Spanishcivilwar.csv')

    window.addEventListener('keydown', function (event) {
        if (event.defaultPrevented) return;

        if (keyEvents != null) {
            switch (event.key) {
                case 'ArrowDown':
                    //console.log('Down Arrow Pressed')
                    break;
                case 'ArrowUp':
                    //console.log('Up Arrow Pressed')
                    break;
                case 'ArrowLeft':
                    //console.log('Left Arrow Pressed')
                    if (infoDataIdx > 0 && infoDataIdx < infoData.length) keyboardNavigation(infoDataIdx - 1);
                    break;
                case 'ArrowRight':
                    //console.log('Right Arrow Pressed')
                    if (infoDataIdx > -1 && infoDataIdx < infoData.length - 1) keyboardNavigation(parseInt(infoDataIdx) + 1);
                    break;
                default:
                    //console.log(`${event.key} Pressed`)
                    break;
            }
        }
    }, true);

    // **************************************************
    // READING THE DATA FROM HERE RESULTS IN A BLANK LIST
    // If you want to read it, in a function below
    // **************************************************
}

function keyboardNavigation(toIdx) {
    //console.log(`${infoDataIdx} => ${toIdx}`)
    let cur = document.getElementById(infoData[infoDataIdx].eventName);
    let next = document.getElementById(infoData[toIdx].eventName);

    infoDataIdx = toIdx;

    cur.classList.remove('highlighted');
    next.classList.add('highlighted');

    keyEvents.selected = next;

    infoPanel.update(infoData[toIdx].eventName);
    updateBarData();
    map.mapUpdate(infoData[toIdx].eventName, infoData);
}

function loadInfoData(fileName) {
    d3.csv(fileName, d => ({
        startDate: d.DateStart,
        endDate: d.DateEnd,
        eventName: d.EventName,
        eventLoc : d.LocState,
        isBattle: d.BattleEvent,
        sideA_Troops: +d.ForceSideA,
        sideB_Troops: +d.ForceSideB,
        sideA_CO: d.CommanderSideA,
        sideB_CO: d.CommanderSideB,
        winner: d.Winner,
        description: d.Description,
        link: d.Link,
        imageName: d.Image,
        sideA_Name: d.SideAName,
        sideB_Name: d.SideBName,
        significance: +d.EventSignificance,
        sucEvent: d.SucEvent,
        sucStates: d.SucStates,
        

    })).then(setInfoData);
}

function setInfoData(dataset) {
    infoData = dataset;
}

function loadData(filename) {
    d3.csv(filename, d => ({
        date: d.Date,
        year: +d.Year,
        day: d.Day,
        action: d.Action,
        actor: d.Actor,
        agent: d.Agent,
        target: d.Target,
        event: d.Event,
        country: d.Country ?? 'United States of America',
        location: d.Location,
        issue: d.Issue,
        side1troops: +d.side1troops,
        side1arrests: +d.side1arrests,
        side1injured: +d.side1injured,
        side1killed: +d.side1killed,
        side2troops: +d.side2troops,
        side2arrests: +d.side2arrests,
        side2injured: +d.side2injured,
        side2killed: +d.side2killed,
        sucEvent: +d.SucEvent,
        sucStates: +d.SucStates,
    })).then(setData);
}

function setData(dataset) {
    // TODO Fix dataset entries
    // action => 'break out' & 'breakout'

    data.push(dataset);

    if (data.length == 1) {
        map = new Map()
        map.mapInit();
        barInit();
        tooltip = new Tooltip(infoData);
        infoPanel = new Info_Panel(infoData);
        keyEvents = new Key_Events(infoData, infoPanel, tooltip);

        keyEvents.update();
        d3.select("#Key-Events").select('rect').dispatch('click');
    }
}