// Openlayers - Carte pour le RCR - Julien Minet - Janv. 2011 - Sept. 2012.
// Derniere modification: 5 janv 2013, LayerSwitcher 
// Parametres generaux et definitions des variables
var map, gnormal, ghyb, gbase, osm, res, sel, gac, donnerie, friperie, potagers, communes, communes_sel, communes_noms;
var proj = new OpenLayers.Projection("EPSG:900913");
var dispproj = new OpenLayers.Projection("EPSG:4326");
var bounds = new OpenLayers.Bounds(4,49.8,6,50.8);
bounds.transform(dispproj,proj);

// Options de la carte
var options = {
	controls: [],
	projection: proj,
	displayProjection: dispproj,
	units: "m",
	numZoomLevels: 10,
	maxResolution: 1500,
	maxExtent: bounds
	};
		
 // Options de la carte de vue generale (en bas a droite de l'ecran)
var ovvwoptions = {
	projection: proj,
	units: 'm'
	};

// Creation de la carte - debut de la fonction init
function init() {
    map = new OpenLayers.Map('map', options);
 	    
    // Ajout de la couche de base (fond OpenStreetMap)
    osm = new OpenLayers.Layer.OSM("OpenStreetMap");
    osm.displayInLayerSwitcher = false; 	      
    map.addLayers([osm]);	    

    // Ajout des couches thematiques
    // Fonctions de decalage des icones quand plusieurs icones sont presentes
    function setOffsetSizeW(){
    	Xoffset = (map.getZoom()*2-12)*-1;
    	return Xoffset;
    	};   
    function setOffsetSizeE(){
    	Xoffset = map.getZoom()*2-12;
    	return Xoffset;
    	};
    function setOffsetSizeS(){
    	Yoffset = map.getZoom()*2-12;
    	return Yoffset;
    	};   
    function setOffsetSizeN(){
    	Yoffset = (map.getZoom()*2-12)*-1;
    	return Yoffset;
    	};   	
    function setOffsetSizeFE(){
    	Xoffset = map.getZoom()*4-12;
    	return Xoffset;
    	};      
    	
    // Fonctions faisant varier la taille des icones: en fonction du zoom et plus grandes une fois selectionnees.     
    function setIconSize(){
    	radius = map.getZoom()*2-12;
    	return radius;
	};
    function setIconSizeSelected(){
    	radius = map.getZoom()*2-10;
    	return radius;
	};    		

    // Regles de decalage: Cas ou plusieurs icones se superposent             	         		    
    var filter1 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "GAC",value: 1});
    var filter2 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "SEL",value: 1});
    var filter3 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "RES",value: 1});
    var filter4 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "DONNERIE",value: 1});
    var filter5 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "POTAGERS",value: 1});
    var filter6 = new OpenLayers.Filter.Comparison({type: OpenLayers.Filter.Comparison.EQUAL_TO,property: "REPAIRCAFE",value: 1});
    
    var filterOR1 = new OpenLayers.Filter.Logical({filters: [filter2,filter3,filter4,filter5,filter6], type: OpenLayers.Filter.Logical.OR});
    var filter11 = new OpenLayers.Filter.Logical({filters: [filter1,filterOR1], type: OpenLayers.Filter.Logical.AND});

    var filterOR2 = new OpenLayers.Filter.Logical({filters: [filter1,filter3,filter4,filter5,filter6], type: OpenLayers.Filter.Logical.OR});
    var filter22 = new OpenLayers.Filter.Logical({filters: [filter2,filterOR2], type: OpenLayers.Filter.Logical.AND});

    var filterOR3 = new OpenLayers.Filter.Logical({filters: [filter1,filter2,filter4,filter5,filter6], type: OpenLayers.Filter.Logical.OR});
    var filter33 = new OpenLayers.Filter.Logical({filters: [filter3,filterOR3], type: OpenLayers.Filter.Logical.AND});

    var filterOR4 = new OpenLayers.Filter.Logical({filters: [filter1,filter2,filter3,filter5,filter6], type: OpenLayers.Filter.Logical.OR});
    var filter44 = new OpenLayers.Filter.Logical({filters: [filter4,filterOR4], type: OpenLayers.Filter.Logical.AND});

    var filterOR5 = new OpenLayers.Filter.Logical({filters: [filter1,filter2,filter3,filter4,filter6], type: OpenLayers.Filter.Logical.OR});
    var filter55 = new OpenLayers.Filter.Logical({filters: [filter5,filterOR5], type: OpenLayers.Filter.Logical.AND});

    var filterOR6 = new OpenLayers.Filter.Logical({filters: [filter1,filter2,filter3,filter4,filter5], type: OpenLayers.Filter.Logical.OR});
    var filter66 = new OpenLayers.Filter.Logical({filters: [filter6,filterOR6], type: OpenLayers.Filter.Logical.AND});
				
    // Ajout d'une couche de limites communales
    var styleMapCommunes = new OpenLayers.StyleMap({fillOpacity:0, strokeWidth:0.5, strokeColor:"black"});
    communes = new OpenLayers.Layer.Vector("Communes", {protocol: new OpenLayers.Protocol.HTTP({url: "./gml/communes.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, styleMap:styleMapCommunes, displayInLayerSwitcher:false, isBaseLayer:false});
		
    // Ajout d'une couche de communes ou il y a une alternative (GAC, SEL, RES ...)
    var styleCommunessel = new OpenLayers.Style({fillOpacity:0.12, strokeWidth:0.5, fillColor:"black"});
    var styleMapCommunessel = new OpenLayers.StyleMap({'default': styleCommunessel});  
    communes_sel = new OpenLayers.Layer.Vector("Communes", {protocol: new OpenLayers.Protocol.HTTP({url: "./gml/communes_RCR.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, styleMap:styleMapCommunessel, displayInLayerSwitcher:false});
    
    // Couche des GAC
            // Definition de l'icone de GAC     		    
	    var styleGAC = new OpenLayers.Style( {pointRadius:"${getSize}", fillOpacity:0.8, cursor:"pointer"},{
      	    rules: [
	       new OpenLayers.Rule({
	       	    filter: filter1,
	       	    symbolizer: {externalGraphic:'./symbols/GAC.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter11,
	       	    symbolizer: {externalGraphic:'./symbols/GAC.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	    // Modification de la taille de l'icone une fois selectionnee
	    var style_sel = new OpenLayers.Style({pointRadius:"${getSize}"});
	    var styleMapGAC = new OpenLayers.StyleMap({'default': styleGAC, 'select':style_sel});
	    styleMapGAC.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeW, getSizeOffsetY:setOffsetSizeN};
	    styleMapGAC.styles["select"].context={getSize: setIconSizeSelected};
	    
	    // Definition de la couche des GACs	    
	    gac = new OpenLayers.Layer.Vector("GAC", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapGAC});


    // Couche des SEL
        // Definition de l'icone de SEL
	var styleSEL = new OpenLayers.Style( {pointRadius:"${getSize}", fillOpacity:0.8, cursor:"pointer"},{
      	    rules: [
	       new OpenLayers.Rule({
	       	    filter: filter2,
	       	    symbolizer: {externalGraphic:'./symbols/SEL.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter22,
	       	    symbolizer: {externalGraphic:'./symbols/SEL.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	    var styleMapSEL = new OpenLayers.StyleMap({'default': styleSEL, 'select':style_sel});
	    styleMapSEL.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeE, getSizeOffsetY:setOffsetSizeN};
	    styleMapSEL.styles["select"].context={getSize: setIconSizeSelected};
	    
	    // Definition de la couche des SELs	
	    sel = new OpenLayers.Layer.Vector("SEL", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapSEL});
	    	    
    // Couche des RES
        // Definition de l'icone de RES
        var styleRES = new OpenLayers.Style( {pointRadius:"${getSize}", fillOpacity:0.8, cursor:"pointer"},{
      	    rules: [
	       new OpenLayers.Rule({
	       	    filter: filter3,
	       	    symbolizer: {externalGraphic:'./symbols/RES.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter33,
	       	    symbolizer: {externalGraphic:'./symbols/RES.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	    var styleMapRES = new OpenLayers.StyleMap({'default': styleRES, 'select': style_sel});
	    styleMapRES.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeW, getSizeOffsetY:setOffsetSizeS};
	    styleMapRES.styles["select"].context={getSize: setIconSizeSelected};
	    
	    // Definition de la couche des RESs
	    res = new OpenLayers.Layer.Vector("RES", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapRES});

    // Couche des Donneries
        // Definition de l'icone de Donneries
	    var styleDONNERIE = new OpenLayers.Style( {pointRadius:"${getSize}", fillOpacity:0.8, cursor:"pointer"},{
               rules: [
	       new OpenLayers.Rule({
	       	    filter: filter4,
	       	    symbolizer: {externalGraphic:'./symbols/Donnerie.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter44,
	       	    symbolizer: {externalGraphic:'./symbols/Donnerie.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	    var styleMapDONNERIE = new OpenLayers.StyleMap({'default': styleDONNERIE, 'select': style_sel});
	    styleMapDONNERIE.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeFE, getSizeOffsetY:setOffsetSizeN};
	    styleMapDONNERIE.styles["select"].context={getSize: setIconSizeSelected};
	    
	// Definition de la couche des Donneries
	donnerie = new OpenLayers.Layer.Vector("Donneries", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapDONNERIE});
	
		
    // Couche des Potagers
        // Definition de l'icone des Potagers
	var stylePotager = new OpenLayers.Style({pointRadius:"${getSize}", fillOpacity:0.8, cursor: "pointer"},{
               rules: [
	       new OpenLayers.Rule({
	       	    filter: filter5,
	       	    symbolizer: {externalGraphic:'./symbols/Potager.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter55,
	       	    symbolizer: {externalGraphic:'./symbols/Potager.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	var styleMapPotager = new OpenLayers.StyleMap({'default': stylePotager, 'select': style_sel});
	styleMapPotager.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeE, getSizeOffsetY:setOffsetSizeS};
	styleMapPotager.styles["select"].context={getSize: setIconSizeSelected};
	
	// Definition de la couche des Potagers	
	potager = new OpenLayers.Layer.Vector("Potagers", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapPotager});
	

    // Couche des RepairCafe
        // Definition de l'icone de RepairCafe
	var styleRepairCafe = new OpenLayers.Style( {pointRadius:"${getSize}", fillOpacity:0.8, cursor:"pointer"},{
      	    rules: [
	       new OpenLayers.Rule({
	       	    filter: filter6,
	       	    symbolizer: {externalGraphic:'./symbols/RepairCafe.png'}
		}),
	       new OpenLayers.Rule({
	       	    filter: filter66,
	       	    symbolizer: {externalGraphic:'./symbols/RepairCafe.png', graphicXOffset:"${getSizeOffsetX}", graphicYOffset:"${getSizeOffsetY}"}
		})	
				]
			}
		);
	    var styleMapRepairCafe = new OpenLayers.StyleMap({'default': styleRepairCafe, 'select':style_sel});
	    styleMapRepairCafe.styles["default"].context={getSize: setIconSize, getSizeOffsetX:setOffsetSizeFE, getSizeOffsetY:setOffsetSizeS};
	    styleMapRepairCafe.styles["select"].context={getSize: setIconSizeSelected};
	    
	    // Definition de la couche des RepairCafe	
	    RepairCafe = new OpenLayers.Layer.Vector("RepairCafe", {protocol: new OpenLayers.Protocol.HTTP({url:"./gml/Localites.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, styleMap:styleMapRepairCafe});


    // Ajout d'une couche de communes ou il y a une alternative (GAC, SEL, RES ...) et affichage du nom de la commune
    var styleCommunesnoms = new OpenLayers.Style({fillOpacity:0, strokeWidth:0, label : "${getName}", labelAlign: "rm", fontColor: "#2E2E2E", fontSize: "14px", fontFamily: "Verdana", fontWeight: "bold"});
    var styleMapCommunesnoms = new OpenLayers.StyleMap({'default': styleCommunesnoms});
    styleMapCommunesnoms.styles["default"].context={getName: labelFunction};   
    communes_noms = new OpenLayers.Layer.Vector("Noms des Communes", {protocol: new OpenLayers.Protocol.HTTP({url: "./gml/communes_RCR.gml", format: new OpenLayers.Format.GML()}), strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, styleMap:styleMapCommunesnoms, displayInLayerSwitcher:false});
    

    // Ajout de toutes les couches
    map.addLayers([communes, communes_sel, potager, gac, sel, res, donnerie, RepairCafe, communes_noms]);


    // Ajout des Popups sur les couches thematiques
	var selectControl = new OpenLayers.Control.SelectFeature([potager, gac, sel, res, donnerie, RepairCafe], {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect}); 
	map.addControl(selectControl);
	selectControl.activate();

	function onFeatureSelect(feature) {
	selectedFeature = feature;
	var popupcontent = "<iframe height='190px' width='320px' src='./popups/" + feature.layer.name + "/" + feature.layer.name + "_" + feature.attributes.NAME + ".html'></iframe>";
	var popup = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(),
			new OpenLayers.Size(200,380),
			popupcontent,
			null, true, 
			onPopupClose);
			feature.popup = popup;
			map.addPopup(popup)	}

	function onPopupClose(evt) {
	selectControl.unselect(selectedFeature);  }
	  
	function onFeatureUnselect(feature) {
	map.removePopup(feature.popup);
	feature.popup.destroy();
	feature.popup = null;   }  
		
    // Fonction de labellisation des communes	
    function labelFunction(feature){
	if (map.getZoom()>9){
		if (feature.attributes.NAME != undefined){ return feature.attributes.NAME;}
		else{ return ''; }
	}else{ return '';}
    }	
	
    // Ajout des controles
    map.addControl(new OpenLayers.Control.Navigation());
    var layersswitcher = new OpenLayers.Control.LayerSwitcher();
    map.addControl(layersswitcher);
    layersswitcher.maximizeControl();
    map.addControl(new OpenLayers.Control.Zoom());
    map.addControl(new OpenLayers.Control.Attribution());
    map.addControl(new OpenLayers.Control.OverviewMap({mapOptions: ovvwoptions}));

    map.zoomToExtent(bounds);
	     
}     // fin de la fonction init 
	
// Ajout des popups depuis la liste
var selectedFeature=0;
function selectlist(couche,localite){
	if (selectedFeature!=0){
	try{map.controls[0].unselect(selectedFeature);}
	catch(err){};
	map.controls[0].select(map.layers[couche].features[localite]);}
	else{
	map.controls[0].select(map.layers[couche].features[localite]);}};

        	
// Zoom par province
var boundsBru = new OpenLayers.Bounds(4.22, 50.75, 4.52, 50.9); boundsBru.transform(dispproj,proj);
function setBruExtent(){map.zoomToExtent(boundsBru);}

var boundsBW = new OpenLayers.Bounds(4, 50.52, 5, 50.75); boundsBW.transform(dispproj,proj);
function setBWExtent(){map.zoomToExtent(boundsBW);}

var boundsHainaut = new OpenLayers.Bounds(3.4, 50.3, 4.7, 50.7); boundsHainaut.transform(dispproj,proj);
function setHainautExtent(){map.zoomToExtent(boundsHainaut);}

var boundsLiege = new OpenLayers.Bounds(5, 50.25, 6, 50.75); boundsLiege.transform(dispproj,proj);
function setLiegeExtent(){map.zoomToExtent(boundsLiege);}

var boundsLux = new OpenLayers.Bounds(4.7, 49.5, 6.2, 50.5); boundsLux.transform(dispproj,proj);
function setLuxExtent(){map.zoomToExtent(boundsLux);}

var boundsNamur = new OpenLayers.Bounds(4.3, 50.1, 5.5, 50.6); boundsNamur.transform(dispproj,proj);
function setNamurExtent(){map.zoomToExtent(boundsNamur);}

