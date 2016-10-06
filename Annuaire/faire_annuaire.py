# -*- coding: utf-8 -*-
# Carto RCR - MAJ des fichiers HTML a partir du fichier Excel
# Julien Minet, Octobre 2012 - Novmebre 2013, julien_wa@yahoo.fr

# extra-taf: Supprimer les redondances, ou les supprimer dans le fichier xls et gérer l'affaire dans la carto!
# extra-taf: faire un extrait de la carte par province intégré

from xlrd import open_workbook
import sys
import re

# Creer le fichier HTML de l'annuaire public
f1 = open('annuaire.html','w')
header = '<html lang="fr">\n  <head>\n    <meta content="text/html; charset=utf-8" http-equiv="content-type">\n    <link rel="stylesheet" href="style.css" type="text/css">\n    <title>Annuaire des alternatives - ASBL RCR</title>\n  </head>\n  <body>\n'
f1.write(header)

# Creer le fichier HTML de l'annuaire prive
f2 = open('annuaire-prive.html','w')
header = '<html lang="fr">\n  <head>\n    <meta content="text/html; charset=utf-8" http-equiv="content-type">\n    <link rel="stylesheet" href="style-prive.css" type="text/css">\n    <title>Annuaire des alternatives - ASBL RCR</title>\n  </head>\n  <body>\n'
f2.write(header)

# Ouvrir un fichier xls avec plusieurs feuilles
wb = open_workbook('RCR_carto.xls')
for s in wb.sheets():
    print 'Sheet:',s.name
    values = []

    # Imprime le type d'alternative comme premier titre
    alternative = s.name.encode('utf-8')
    titre1 = '<h1>'+alternative+'</h1>\n'
    f1.write(titre1)
    f2.write(titre1)

    # Ligne par ligne
    for row in range(1,s.nrows):

        # Imprimer la province comme deuxieme titre
        province = s.cell(row,0)  # Nom de la province
        province = province.value.encode('utf-8')
        if s.cell(row,0).value != s.cell(row-1,0).value:
            titre2 = '<h2>'+province+'</h2>\n'
            f1.write(titre2)
            f2.write(titre2)
            
        # Texte a copier dans les fichiers HTML
        # Le texte doit etre encode en utf-8, car Python fonctionne par defaut en ASCII.
        
        commune = s.cell(row,1)   # Nom de la commune
        commune = commune.value.encode('utf-8')
        print row,commune

        localite = s.cell(row,2)   # Nom de la localite
        localite = localite.value.encode('utf-8')
        
        nom = s.cell(row,4)  # Nom de l'alternative
        nom = nom.value.encode('utf-8')

        texte = s.cell(row,5) # Petit texte du popup
        texte = texte.value.encode('utf-8')

        web = s.cell(row,7)   # Adresse site web
        if isinstance(web, float):
           web = web.value
           print 'float!'
        else:
           web = web.value.encode('utf-8')
                  
        email = s.cell(row,8)   # Email
        email = email.value.encode('utf-8')
        
        personne = s.cell(row,9)   # Personne de contact
        personne = personne.value.encode('utf-8')
        
        emailprive = s.cell(row,10)   # Email prive
        emailprive = emailprive.value.encode('utf-8')

        adresse = s.cell(row,11)   # Adresse
        adresse = adresse.value.encode('utf-8')
         
        telephone = s.cell(row,13)   # Telephone
        telephone = telephone.value.encode('utf-8')

        gsm = s.cell(row,14)   # GSM
        gsm = gsm.value.encode('utf-8')

        # Fonctions pour transformer les adresses internet en liens (urlize)
        # Thanks to http://stackoverflow.com/questions/1727535/replace-urls-in-text-with-links-to-urls?rq=1
        _urlfinderregex = re.compile(r'http([^\.\s]+\.[^\.\s]*)+[^\.\s]{2,}')

        def linkify(text, maxlinklength):
            def replacewithlink(matchobj):
                url = matchobj.group(0)
                text = url
                if text.startswith('www.'):
                    text = text.replace('www.', '', 1)
                
                if text.startswith('http://'):
                    text = text.replace('http://', '', 1)
                elif text.startswith('https://'):
                    text = text.replace('https://', '', 1)

                if len(text) > maxlinklength:
                    halflength = maxlinklength / 2
                    text = text[0:halflength] + '...' + text[len(text) - halflength:]

                return '<a href="' + url + '" target="_blank">' + text + '</a>'

            if text != None and text != '':
                return _urlfinderregex.sub(replacewithlink, text)
            else:
                return ''

        texte = linkify(texte,60)
        web = linkify(web,1000)

        
        # Annuaire public
        html1 = '<table>\n <tr>\n  <td id="nom">'
        html2 = '</td><td id="localite">'
        html3 = '</td>\n  </tr>\n  <tr>\n   <td colspan="2" id="texte">'
        html4 = '</td>\n  </tr>\n  <tr>\n   <td colspan="2" id="web">'
        html5 = '</td>\n</tr>\n</table>\n'
        # Ecriture dans le fichier HTML de l'annuaire public
        f1.write(html1+nom+html2+localite+' ('+commune+')'+html3+texte+html4+web+html5)

        # Annuaire prive
        html1 = '<table>\n <tr>\n  <td id="nom">'
        html2 = '</td><td id="localite">'
        html3 = '</td>\n </tr>\n <tr>\n  <td rowspan="4"><div id="texte">'
        html4 = '</div></td>\n  <td id="colonne">'
        html5 = '</td>\n </tr>\n <tr>\n  <td id="colonne">'
        html6 = '</tr>\n <tr>\n  <td id="colonne">'        
        html7 = '</td>\n </tr>\n <tr>\n  <td id="web">'
        html8 = '</td><td id="colonne">'
        html9 = '</td>\n </tr>\n</table>\n'
        # Ecriture dans le fichier HTML de l'annuaire prive
        f2.write(html1+nom+html2+localite+' ('+commune+')'+html3+texte+html4+personne+html5+emailprive+html6+adresse+html6+telephone+html7+web+'   '+email+html8+gsm+html9)

    # Fait un footer pour le saut de page
    footer = '<footer></footer>\n'
    f1.write(footer)
    f2.write(footer)

 
f1.close()
f2.close()

# Bug connu:
# #1 Le script bug à la fin sur la feuille "Code couleur" mais cela ne pose aucun problème
# #2 Un bug peut apparaître si le format des colonnes de texte (nom des communes, informations des popups, etc. ) a été modifié dans Excel en "nombre". Toujours mettre "texte" comme format de colonnes pour les colonnes contenatn du texte!
