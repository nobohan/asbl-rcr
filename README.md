# Dépôt des codes pour la carto RCR

## A propos

Ceci est le dépôt de l'ensemble des codes utilisés pour faire la carte des alternatives de l'ASBL Réseau de Consommateurs Responsables. Une première version de la carte a été contruite sur base du logiciel OpenLayers 2 et d'un système de génération de fichiers GML à partir d'un fichier Excel, et a été utilisé de 2011 à 2015. Une deuxième version, appliquée depuis novembre 2015, est basée sur Leaflet et sur une base de données des initiatives. 


## Structure des dossiers

* Annuaire: Dossier pour préparer un annuaire des alternatives sur base du fichier Excel des alternatives. 
  * Mettre le fichier RCR_carto.xls dans le même dossier que le script `faire_annuaire.py`
  * Faire tourner le script avec IDLE
  * Ouvrir les fichiers `annuaire.html` et `annuaire-prive.html` dans Firefox et imprimer (CTRL+P) dans un fichier. Cela fonctionne mieux avec Firefox qu'avec Google Chrome pour gérer les entetes et pied-de-page. 

* openlayers2: Dossier relatif à la carte faite avec OpenLayers2 (système appliqué de 2009 à 2011). Comprend le dossier web `www` et un dossier de documentation comprenant un descriptif détaillé de la carto avec OpenLayers2.

* leaflet: Dossier relatif à la carte faite avec Leaflet et la base de données des alternatives (système appliqué à partir de nov. 2011). Comprend le dossier web `www`. 

## Documentation

Pour l'ancien système (OpenLayers2, 2009-2011), il existe une documentation complète dans le fichier /openlayers2/documentation/Tutoriel_carto_RCR_2.0.pdf
Pour le nouveau système, il n'y a pas de documentation détaillée mais le code de la carte est commenté. 

Personnes ayant travaillé sur la carto RCR: 
* Julien Minet, bénévole RCR, développeur de l'ancien système (OpenLayers2), et développeur de la partie front-end de la carto Leaflet.
* Sylvain Lohest, webmaster de www.asblrcr.be, responsable de la base de données des alternatives et de l'intégration de la carte dans le site web (système leaflet).
* David Petit, gentil organisateur @ asbl RCR, ayant suivi le projet carto depuis ses débuts. 
