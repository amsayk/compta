webpackJsonp([11],{445:function(e,a){e.exports={"account-form.error.unknown":"Il y eu une erreur inconnue. Veuillez essayer à nouveau.","account-form.error.displayName":"Ce Nom de l'entreprise a déjà été utilisée","account-form.message.add-account-title":"Modifiez vos informations de connexion","account-form.label.displayName":"Quel est votre nom?","account-form.label.email":"Quelle est votre adresse e-mail?","account-form.description.email":"Voilà où nous allons envoyer les instructions pour la réinitialisation de votre mot de passe.","account-form.cancel":"Annuler","account-form.action.save-account":"Changer","account-form.action.saving-account":"Sauvegarde en cours…","accounts-page.title":"Comptes de plan comptable","action.create-new-app":"Ajouter une nouvelle société","message.created":"Créé","message.filter-companies":"Commencez à taper pour filtrer…","error.unknown":"Il y eu une erreur inconnue. Veuillez essayer à nouveau.","error.displayName":"Ce nom de société a déjà été utilisée","message.add-company-title":"Ajouter une nouvelle société","message.add-company-subtitle":"D'abord juste donner un nom…","label.displayName":"Comment l'appeler?","description.displayName":"Voilà comment nous allons le référencer. Ne pas utiliser des caractères spéciaux, et commencer à votre nom avec une lettre de l'alphabet.","placeholder.displayName":"Choisissez un bon nom…","label.periodType":"Quel type de période?",MONTHLY:"MENSUEL",TRIMESTERLY:"TRIMESTRIEL","dashboard-page.title":"Accueil",cancel:"Annuler","app-settings-page.title":"Paramètres","action.save-company":"Ajoutez-le!","action.saving-company":"Enregistrement…","forgot-page.abort-message":"Non, revenir","forgot.help-message":"<span>That's okay. Enter your email and we'll send</span>\n            <br/><span>you a way to reset your password.\n            </span>","title.forgot":"Réinitialisez votre mot de passe","forgot.default-forgot":"amadou.cisse@epsilon.ma","forgot-form.title":"Réinitialisez votre mot de passe","forgot-page.label.email":"Email","forgot-page.action-reset":"Réinitialiser le mot de passe","apps-menu-item-title":"Vos Societies","account-settings-menu-item-title":"Paramètres du compte","title.login":"Identification","login.default-login":"amadou.cisse","login-form.title":"Identification","label.email":"Email","label.password":"Mot de passe","error.login":"Vous devez entrer une adresse email valide.","login.forgot-something":"Vous avez oublié quelque chose?","action.login":"S'identifier","reports-page.title":"Rapports","app-dashboard-menu-item-title":"Accueil","transactions-menu-item-title":"Journal","accounts-menu-item-title":"Plan comptable","reports-menu-item-title":"Rapports","app-settings-menu-item-title":"Paramètres","transaction-form.th.account":"Compte","transaction-form.th.DEBIT":"DÉBIT","transaction-form.th.CREDIT":"CRÉDIT","transaction-form.th.Description":"Description","transaction-form.th.Name":"Nom","transaction-form.error.unknown":"Il y eu une erreur inconnue. Veuillez essayer à nouveau.","transaction-form.message.searchPromptText":"Sélectionnez compte…","transaction-form.message.accountPlaceholder":"Sélectionnez compte…","transaction-form.message.searchingText":"Recherche en cours…","transaction-form.date.clearButton":"Sélectionnez date","transaction-form.account-combobox.emptyFilter":"Le filtre n'a donné aucun résultat","transaction-form.date_label":"Date Journal","transaction-form.add_more_lines":"Ajouter des lignes","transaction-form.clear_all_lines":"Effacer toutes les lignes","transaction-form.memo":"Entrez une note à cette entrée de journal","transaction-form.error.displayName":"Ce Nom de l'entreprise a déjà été utilisée","transaction-form.message.add-transaction-title":"L'Entrée du journal #{transactionNumber}","transaction-form.message.total":"Total","transaction-form.cancel":"Annuler","transaction-form.action.save":"Ajouter","transaction-form.action.save-and-new":"Ajouter et nouveau","transaction-form.action.saving-transaction":"Sauvegarde en cours…","journal-page.subtitle":"Journal","app.title":"Compta • Gestionnaire comptable","error.required":"Nécessaire","account-page.title":"Compte","account-page.subtitle":"Paramètres","account-page.login-info-legend":"Details du compte","account-page.login-info-message":"Mettre à jour les informations personnelles liés à ce compte.","account-page.login-info-label":"Modifiez vos informations de connexion","account-page.login-info-description":"Voici où vous pouvez changer votre adresse e-mail ou mot de passe.","account-page.action-change-login-info":"Modifier mes informations personnelles","sidebar.all-apps":"Toutes les sociétés","sidebar.new-app":"Créer une nouvelle société"}},1521:function(e,a,o){var r;!function(a){e.exports=a()}(function(){return function e(a,o,n){function t(l,s){var c,u,m;if(!o[l]){if(!a[l]){if(c="function"==typeof r&&r,!s&&c)return r(l,!0);if(i)return i(l,!0);throw u=new Error("Cannot find module '"+l+"'"),u.code="MODULE_NOT_FOUND",u}m=o[l]={exports:{}},a[l][0].call(m.exports,function(e){var o=a[l][1][e];return t(o?o:e)},m,m.exports,e,a,o,n)}return o[l].exports}var l,i="function"==typeof r&&r;for(l=0;l<n.length;l++)t(n[l]);return t}({1:[function(e,a,o){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default=[{locale:"fr",pluralRuleFunction:function(e,a){return a?1==e?"one":"other":e>=0&&2>e?"one":"other"},fields:{year:{displayName:"année",relative:{0:"cette année",1:"l’année prochaine","-1":"l’année dernière"},relativeTime:{future:{one:"dans {0} an",other:"dans {0} ans"},past:{one:"il y a {0} an",other:"il y a {0} ans"}}},month:{displayName:"mois",relative:{0:"ce mois-ci",1:"le mois prochain","-1":"le mois dernier"},relativeTime:{future:{one:"dans {0} mois",other:"dans {0} mois"},past:{one:"il y a {0} mois",other:"il y a {0} mois"}}},day:{displayName:"jour",relative:{0:"aujourd’hui",1:"demain",2:"après-demain","-1":"hier","-2":"avant-hier"},relativeTime:{future:{one:"dans {0} jour",other:"dans {0} jours"},past:{one:"il y a {0} jour",other:"il y a {0} jours"}}},hour:{displayName:"heure",relativeTime:{future:{one:"dans {0} heure",other:"dans {0} heures"},past:{one:"il y a {0} heure",other:"il y a {0} heures"}}},minute:{displayName:"minute",relativeTime:{future:{one:"dans {0} minute",other:"dans {0} minutes"},past:{one:"il y a {0} minute",other:"il y a {0} minutes"}}},second:{displayName:"seconde",relative:{0:"maintenant"},relativeTime:{future:{one:"dans {0} seconde",other:"dans {0} secondes"},past:{one:"il y a {0} seconde",other:"il y a {0} secondes"}}}}},{locale:"fr-BE",parentLocale:"fr"},{locale:"fr-BF",parentLocale:"fr"},{locale:"fr-BI",parentLocale:"fr"},{locale:"fr-BJ",parentLocale:"fr"},{locale:"fr-BL",parentLocale:"fr"},{locale:"fr-CA",parentLocale:"fr",fields:{year:{displayName:"année",relative:{0:"cette année",1:"l’année prochaine","-1":"l’année dernière"},relativeTime:{future:{one:"Dans {0} an",other:"Dans {0} ans"},past:{one:"Il y a {0} an",other:"Il y a {0} ans"}}},month:{displayName:"mois",relative:{0:"ce mois-ci",1:"le mois prochain","-1":"le mois dernier"},relativeTime:{future:{one:"Dans {0} mois",other:"Dans {0} mois"},past:{one:"Il y a {0} mois",other:"Il y a {0} mois"}}},day:{displayName:"jour",relative:{0:"aujourd’hui",1:"demain",2:"après-demain","-1":"hier","-2":"avant-hier"},relativeTime:{future:{one:"Dans {0} jour",other:"Dans {0} jours"},past:{one:"Il y a {0} jour",other:"Il y a {0} jours"}}},hour:{displayName:"heure",relativeTime:{future:{one:"Dans {0} heure",other:"Dans {0} heures"},past:{one:"Il y a {0} heure",other:"Il y a {0} heures"}}},minute:{displayName:"minute",relativeTime:{future:{one:"Dans {0} minute",other:"Dans {0} minutes"},past:{one:"Il y a {0} minute",other:"Il y a {0} minutes"}}},second:{displayName:"seconde",relative:{0:"maintenant"},relativeTime:{future:{one:"Dans {0} seconde",other:"Dans {0} secondes"},past:{one:"Il y a {0} seconde",other:"Il y a {0} secondes"}}}}},{locale:"fr-CD",parentLocale:"fr"},{locale:"fr-CF",parentLocale:"fr"},{locale:"fr-CG",parentLocale:"fr"},{locale:"fr-CH",parentLocale:"fr"},{locale:"fr-CI",parentLocale:"fr"},{locale:"fr-CM",parentLocale:"fr"},{locale:"fr-DJ",parentLocale:"fr"},{locale:"fr-DZ",parentLocale:"fr"},{locale:"fr-FR",parentLocale:"fr"},{locale:"fr-GA",parentLocale:"fr"},{locale:"fr-GF",parentLocale:"fr"},{locale:"fr-GN",parentLocale:"fr"},{locale:"fr-GP",parentLocale:"fr"},{locale:"fr-GQ",parentLocale:"fr"},{locale:"fr-HT",parentLocale:"fr"},{locale:"fr-KM",parentLocale:"fr"},{locale:"fr-LU",parentLocale:"fr"},{locale:"fr-MA",parentLocale:"fr"},{locale:"fr-MC",parentLocale:"fr"},{locale:"fr-MF",parentLocale:"fr"},{locale:"fr-MG",parentLocale:"fr"},{locale:"fr-ML",parentLocale:"fr"},{locale:"fr-MQ",parentLocale:"fr"},{locale:"fr-MR",parentLocale:"fr"},{locale:"fr-MU",parentLocale:"fr"},{locale:"fr-NC",parentLocale:"fr"},{locale:"fr-NE",parentLocale:"fr"},{locale:"fr-PF",parentLocale:"fr"},{locale:"fr-PM",parentLocale:"fr"},{locale:"fr-RE",parentLocale:"fr"},{locale:"fr-RW",parentLocale:"fr"},{locale:"fr-SC",parentLocale:"fr"},{locale:"fr-SN",parentLocale:"fr"},{locale:"fr-SY",parentLocale:"fr"},{locale:"fr-TD",parentLocale:"fr"},{locale:"fr-TG",parentLocale:"fr"},{locale:"fr-TN",parentLocale:"fr"},{locale:"fr-VU",parentLocale:"fr"},{locale:"fr-WF",parentLocale:"fr"},{locale:"fr-YT",parentLocale:"fr"}],a.exports=o.default},{}]},{},[1])(1)})}});
//# sourceMappingURL=11.c0a9ff8e49d2694ac22e.app.js.map