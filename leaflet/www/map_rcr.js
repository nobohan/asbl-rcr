// LeafletJS - Carte pour le RCR - Julien Minet - Janv. 2011 - Sept. 2015.

var list, gac, sel, res, donnerie, potagers, repaircafe, markerGAC;

function init() {
	map = L.map('map').setView([50.2, 4.8], 8);
	
	// Ajout d'une couche de fond OpenStreetMap - Stamen
        var layer = new L.StamenTileLayer("toner-lite",{
        attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."});
        map.addLayer(layer);

	/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);*/
	
	// Ajout d'une couche de limites communales
    //var styleCommunes = {"color": "black", "weight": 2, "opacity": 0.85, "fillOpacity": 0.08};
	//L.geoJson(communes, {style: styleCommunes}).addTo(map);

    // Ajout d'une couche de communes ou il y a une alternative (GAC, SEL, RES ...) et affichage du nom de la commune
    // TO DO: style filter + label OU PAS

    // Definition des icones pour toutes les couches
    var LeafIcon = L.Icon.extend({ options: { iconSize: [12, 12] } });

    var iconGAC = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/GAC.png', iconAnchor: [6, 4], popupAnchor: [-3, -2]}),
	    iconSEL = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/SEL.png', iconAnchor: [0,4], popupAnchor: [3, -2] }), 
	    iconRES = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/RES.png', iconAnchor: [6, -2], popupAnchor: [-3, 5]}),
	    iconDonnerie = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/Donnerie.png', iconAnchor: [0, -2], popupAnchor: [3, 4]}),
	    iconPotager = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/Potager.png', iconAnchor: [12, 4], popupAnchor: [-9, -2]}),
	    iconRepairCafe = new LeafIcon({iconUrl: 'http://www.asblrcr.be/themes/rcr/carto/img/RepairCafe.png', iconAnchor: [12, -2], popupAnchor: [-9, 4]}); 


	L.icon = function (options) { return new L.Icon(options); };


    // Definition d'une liste pour stocker toutes initiatives (nécessaire pour la fonction d'ouverture des popups de l'extérieur)
    list = [];

    // Definition du contenu du popup
    function makePopupContent(feature){
    	/*var contact;
        if (feature.properties.iscontact == 1){
            return contact = "</div><div id='popup_wp'>contact: " + feature.properties.contact ;
        }
        else {
            return contact="";
        };*/

        return "<div id='popup'><h3 class='" + feature.properties.type + "'>" + feature.properties.name 
            + "</h3></div><div id='popup_wp'>" + feature.properties.popup

            //+ contact
            +"</div>";
    }

/*
Province – Commune(s) couverte(s) par l’initiative (éventuellement plusieurs)
Point géolocalisé
 Type d’initiative
Nom de l’initiative
Courriel du groupe
GSM éventuel du groupe
Personne de contact (+ formulaire ajout données personne de contact)
			+ possibilité d’ajouter une autre personne de contact (max 5)
Champs personne :
Personne physique / Collectif
Nom, (prénom,) mail, téléphone, gsm, localité, site web, (initiative(s) dont elle est membre)
Coordonnées diffusables : oui - non
Site web du groupe
Page facebook du groupe
Particularité du groupe (optionnel, max 160 caractères)*/
 
    // Ajout de la couche des RepairCafe
    repaircafe = new L.GeoJSON.AJAX("../repair_geojson.txt", {
        pointToLayer: function(feature, latlng) {
	            return markerRC = L.marker(latlng, {icon: iconRepairCafe});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(makePopupContent(feature));
			    list.push(markerRC);
	        },
		filter: function(feature, layer) {
	            return feature.properties.type == 'repaircafe';
		    }	
    }).addTo(map);
 
    // Ajout de la couche des GACs
    gac = new L.GeoJSON.AJAX("../gac_geojson.txt", {
        pointToLayer: function(feature, latlng) {
	            return markerGAC = L.marker(latlng, {icon: iconGAC});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(makePopupContent(feature));
			    list.push(markerGAC);
	        },
		filter: function(feature, layer) {
	            return feature.properties.type == 'gac';
		    }	        
    }).addTo(map);

    // Ajout de la couche des SEL
    sel = new L.GeoJSON.AJAX("../sel_geojson.txt", {
        pointToLayer: function(feature, latlng) {
	            return markerSEL = L.marker(latlng, {icon: iconSEL});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(makePopupContent(feature));
			    list.push(markerSEL);
	        },
		filter: function(feature, layer) {
	            return feature.properties.type == 'sel';
		    }	
    }).addTo(map);

    // Ajout de la couche des RES
    res = new L.GeoJSON.AJAX("../res_geojson.txt", {
        pointToLayer: function(feature, latlng) {
	            return markerRES = L.marker(latlng, {icon: iconRES});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(makePopupContent(feature));
			    list.push(markerRES);
	        },
		filter: function(feature, layer) {
	            return feature.properties.type == 'res';
		    }	
    }).addTo(map);

    // Ajout de la couche des Donneries
    donnerie = new L.GeoJSON.AJAX("../donnerie_geojson.txt", {
        pointToLayer: function(feature, latlng) {
	            return markerDonnerie = L.marker(latlng, {icon: iconDonnerie});
            },
        onEachFeature: function (feature, layer) {
			    layer.bindPopup(makePopupContent(feature));
			    list.push(markerDonnerie);
	        },
		filter: function(feature, layer) {
	            return feature.properties.type == 'donnerie';
		    }	
    }).addTo(map);
 
    // Ajout de la couche des potager
    potager = new L.GeoJSON.AJAX("../potagers_geojson.txt", {
        pointToLayer: function(feature, latlng) {
                return markerPotager = L.marker(latlng, {icon: iconPotager});
            },
        onEachFeature: function (feature, layer) {
                layer.bindPopup(makePopupContent(feature));
                list.push(markerPotager);
            },
        filter: function(feature, layer) {
                return feature.properties.type == 'potager';
            }   
    }).addTo(map); 

    // Ajouter une table des matières
    var baseLayer = {};

    couches = {
    	"GAC <img src='http://www.asblrcr.be/themes/rcr/carto/img/GAC.png'/>": gac,
        "SEL <img src='http://www.asblrcr.be/themes/rcr/carto/img/SEL.png'/>": sel,
        "RES <img src='http://www.asblrcr.be/themes/rcr/carto/img/RES.png'/>": res,
        "Donnerie <img src='http://www.asblrcr.be/themes/rcr/carto/img/Donnerie.png'/>": donnerie,
        "Potager <img src='http://www.asblrcr.be/themes/rcr/carto/img/Potager.png'/>": potager,
        "Repair Café <img src='http://www.asblrcr.be/themes/rcr/carto/img/RepairCafe.png'/>": repaircafe
    };

    L.control.layers(baseLayer,couches,{collapsed:false}).addTo(map);


} // Fin de la fonction init


// open popup from outside
function showPopupRCR(nid){
    for (var i in list){
        var markerID = list[i].feature.properties.nid;
        if (markerID == nid){
            list[i].openPopup();
        };
    }
}

// zoom to element from outside
function zoomToRCR(nid){
    for (var i in list){
        var markerID = list[i].feature.properties.nid;
        if (markerID == nid){
           var coord = list[i].feature.geometry.coordinates
           var x = coord[1]
           var y = coord[0]
           map.setView([x,y],10) 
        };
    }

}

// zoom to coordonnees from outside
function zoomToPoint(lat,lon){
           var x = lat;
           var y = lon;
           map.setView([x,y],10);
		   
}

// zoom to coordonnees from outside
function zoomToPointPlus(lat,lon){
           var x = lat;
           var y = lon;
           map.setView([x,y],13);
	   
}

// zoom PLUS to element from outside (for Brussels)
function zoomToRCRPlus(nid){
    for (var i in list){
        var markerID = list[i].feature.properties.nid;
        if (markerID == nid){
           var coord = list[i].feature.geometry.coordinates
           var x = coord[1]
           var y = coord[0]
           map.setView([x,y],13) 
        };
    }   
	
}