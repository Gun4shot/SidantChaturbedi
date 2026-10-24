// Publication metadata verified against the publisher's indexed record, 24 Oct 2026.
// Other research statuses and methods are from the user's October 2026 dossier.
export const publications = [
  { id:'sentinel',short:'Roads from orbit',category:'01 / RADAR & RESILIENCE',status:'Published · 2026',
    title:'A Sentinel-1 SAR time-series framework for seasonal road surface vulnerability assessment and landslide precursor detection in monsoon-affected Nepal',
    summary:'Six years of satellite radar observations reveal seasonal road vulnerability and hydrological signals preceding documented slope failures in Nepal.',
    venue:'Geomatics, Natural Hazards and Risk · 17(1)',authors:'Sidant Chaturbedi, Basu Dev Ghimire & Sandesh Singh',
    detail:'Published 17 August 2026. I contributed methodology, software, analysis, visualization and writing. The study combines seasonal backscatter contrasts with anomaly detection across monsoon-affected road corridors.',
    tags:['Sentinel-1 SAR','Python','Geospatial analysis'],
    links:[{label:'Read the paper',url:'https://doi.org/10.1080/19475705.2026.2719295'},{label:'Code & figures',url:'https://github.com/Gun4shot/Sentinal-1-SAR-framework'}]},
  { id:'graphs',short:'Roads as networks',category:'02 / GRAPH LEARNING',status:'Submitted manuscript',
    title:'Graph-attention road surface classification',
    summary:'Combining visual features and graph attention to classify road surfaces across 131,188 satellite samples from Nepal.',
    venue:'Submitted to IEEE JSTARS',authors:'Research led by Sidant Chaturbedi',
    detail:'I led study design, model development, experimentation and manuscript preparation. The approach fuses VGG16, EfficientNet-B0 and ResNet18 features with graph-attention layers and Jumping Knowledge.',
    tags:['PyTorch','Graph attention','Feature fusion'],links:[]},
  { id:'himalaya',short:'Water in the Himalaya',category:'03 / A CHANGING LANDSCAPE',status:'Ongoing research',
    title:'Himalayan glacial lakes & river disturbance',
    summary:'Collaborative remote-sensing research into glacial lake outburst floods and their effects on Himalayan rivers.',
    venue:'Research in progress',authors:'Collaborative work with three professors',
    detail:'Exploring whether satellite observations reveal persistent river disturbance after glacial lake outburst floods. This work is ongoing; no predictive results or publication are claimed.',
    tags:['Remote sensing','Glacial lakes','Hydrology'],links:[]},
]

