TODO:

multi-step: https://dl.dropboxusercontent.com/u/51491957/multistep-v2.1.0/index.html

http://www.funnyordie.com/articles/5af1e30f0d/game-of-thrones-themed-kama-sutra?_cc=__d___&_ccid=583fca94-811e-4968-b1a4-44da105f36fa

watermark:

http://stackoverflow.com/questions/31691355/watermark-using-pdfmake/32658671#32658671

Handling of 'wheel' input event was delayed for 131 ms due to main thread being busy. Consider marking event handler as 'passive' to make the page more responive.

facture:

https://www.zervant.com/fr/blog/modele-gratuit-de-facture-a-telecharger-sous-format-word/
http://www.myae.fr/guide-pratique/manuel-utilisation-facturier/comment-afficher-apercu-facture-auto-entrepreneur.php
http://gonehybrid.com/how-to-create-and-display-a-pdf-file-in-your-ionic-app/

TVA links:

http://www.eguens.com/v2/comptabilite/cours/enregistrer-vente-soumise-tva-remise.php
http://www.entreprendre.ma/Comment-comptabiliser-le-calcul-du-montant-de-la-TVA_a5548.html
http://www.slideshare.net/said1994/cours-t

https://www.youtube.com/watch?v=_EivkxC49kg
https://www.youtube.com/watch?v=r3K6pu5X9QA

Parse.Cloud.run('getCompanyCurrentVATDeclaration', { companyId: 'PRh8mljQny', }, { sessionToken: 'r:96d0191e3abfa67de9fc1b74b425ca06' }).then((obj) => console.log(obj), (err) => console.log(err));

Parse.Cloud.run('setupVAT', { companyId: 'PRh8mljQny', startDate: new Date(2016, 0, 1).toISOString(), IF: 'XXX-099-83J', frequency: 'QUARTERLY', regime: 'Standard',  }, { sessionToken: 'r:96d0191e3abfa67de9fc1b74b425ca06' }).then(() => console.log('success'), (err) => console.log(err));

VAT formulas


10 000 TTC

20% de TVA

===>

8000 HT

2000 TVA

HT * (1 + TVA) = TTC

910 + 910xTVA = 1088.36

TVA = (1088.36 - 910) /  910 = (TTC - HT) / HT = 19.6

HT * (1 + 0.05) = 3000

HT = 3000 / (1+0.05)
HT = 3000 / 1.05
HT =

Finish this
add loading everywhere
active/inactive
delete product, people
finish product
logo
product image
attachments
product items
credits

vat
reports
plan comptable

print invoice
excel

/

Colors: http://www.hexcolortool.com/#00db7c


http://dropsofserenity.github.io/react-avatar-cropper/

import AvatarCropper from "react-avatar-cropper";

- Taux normal 20% : Il s’applique aux opérations imposables dont aucun autre taux n’a été prévu.
- Taux réduit 14 % : Il s’applique aux produits et services de consommation courants.
- Taux super réduit 7% : Il s’applique aux produits de consommation courante.
- Taux particulier 10% : Il s’applique aux opérations de restauration et de fourniture de logement dans les établissements touristiques, opérations financières…

https://eu.soyoustart.com/ma/cgi-bin/order/displayOrder.cgi?mode=print&orderId=31900805&orderPassword=fnay&expandDetails=1

GA:

function handleOutboundLinkClicks(event) {
  ga('send', 'event', {
    eventCategory: 'Outbound Link',
    eventAction: 'click',
    eventLabel: event.target.href,
    transport: 'beacon'
  });
}

actions
exceptions
modal views


words

https://github.com/andrepadez/normalizer

parse number:

http://scurker.github.io/currency.js/

More info:

https://github.com/jraede/medici

Deploy:

chmod -R g+rwx .

mongo mongodb://compta:wqNRZSG3UFmlXaGITA@ds013182.mlab.com:13182/compta

git init
heroku git:remote -a compta-parse-server
git add .
git commit -am ''
git push heroku master

git init
heroku git:remote -a compta-xlez7y-4795
git add .
git commit -am ''
git push heroku master


1. Notification

http://sourcescript.github.io/alt-notify/#examples
https://github.com/igorprado/react-notification-system
https://github.com/pburtchaell/react-notification

2. sms

twilio

Chart libs:
-----------

d3
c3
c3-react
react-vis (!)
https://github.com/gilbarbara/react-joyride

Charts:

http://jsfiddle.net/fuhr4tfy/
http://jsfiddle.net/vjvyn54c/

Bugs:

1. Fix query limit
2. Settings.advanced.closureDate zIndex
3. table scroll bug = x
4. Totals should include all tables!
5. Add latestPaymentDate and sort by it!
6. Change lowercase search method to words

PaymentofInvocies wrong!

warning.js?8a56:44 Warning: RelayMutation: The connection `invoices{_rev:0,customer:null,from:null,limit:15,offset:0,sortDir:null,sortKey:null,status:"ALL",to:null,type:"ALL"}` on the mutation field `company` that corresponds to the ID `Q29tcGFueTpmWE1kNU0yd25W` did not match any of the `rangeBehaviors` specified in your RANGE_ADD config. This means that the entire connection will be refetched. Configure a range behavior for this mutation in order to fetch only the new edge and to enable optimistic mutations or use `refetch` to squelch this warning.warning @ warning.js?8a56:44(anonymous function) @ RelayMutationQuery.js?83d4:194(anonymous function) @ RelayMutationQuery.js?83d4:177buildFragmentForEdgeInsertion @ RelayMutationQuery.js?83d4:201(anonymous function) @ RelayMutationQuery.js?83d4:285(anonymous function) @ RelayMutationQuery.js?83d4:276buildQuery @ RelayMutationQuery.js?83d4:327getQuery @ VM12514:433_handleCommit @ VM12514:218commit @ VM12514:116commit @ RelayMutationTransaction.js?563f:45commitUpdate @ RelayEnvironment.js?1972:172(anonymous function) @ invoices.js?3b88:237exports.(anonymous function).target.(anonymous function).function.target.(anonymous function).F @ $.export.js?b734:30promise @ invoices.js?3b88:235(anonymous function) @ clientMiddleware.js?3ee2:15(anonymous function) @ bindActionCreators.js?91d9:7(anonymous function) @ InvoiceForm.js?91f5:429exports.(anonymous function).target.(anonymous function).function.target.(anonymous function).F @ $.export.js?b734:30(anonymous function) @ InvoiceForm.js?91f5:428doSubmit @ handleSubmit.js?471d:29handleSubmit @ handleSubmit.js?471d:50(anonymous function) @ createHigherOrderComponent.js?14f6:188(anonymous function) @ silenceEvents.js?8556:17ReactErrorUtils.invokeGuardedCallback @ ReactErrorUtils.js?6b31:70executeDispatch @ EventPluginUtils.js?0958:87executeDispatchesInOrder @ EventPluginUtils.js?0958:110executeDispatchesAndRelease @ EventPluginHub.js?c6b1:42executeDispatchesAndReleaseTopLevel @ EventPluginHub.js?c6b1:53forEachAccumulated @ forEachAccumulated.js?b898:24EventPluginHub.processEventQueue @ EventPluginHub.js?c6b1:215runEventQueueInBatch @ ReactEventEmitterMixin.js?8a20:18ReactEventEmitterMixin.handleTopLevel @ ReactEventEmitterMixin.js?8a20:29handleTopLevelImpl @ ReactEventListener.js?2365:73Mixin.perform @ Transaction.js?6dff:136ReactDefaultBatchingStrategy.batchedUpdates @ ReactDefaultBatchingStrategy.js?ef70:63batchedUpdates @ ReactUpdates.js?ce09:97ReactEventListener.dispatchEvent @ ReactEventListener.js?2365:150
warning.js?8a56:44 Warning: Using `null` as a rangeBehavior value is deprecated. Use `ignore` to avoid refetching a range.

<% if (!dev) { %>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/assets/sw.js', { scope: '/assets/' }).then(function(reg) {

        if(reg.installing) {
          console.log('Service worker installing');
        } else if(reg.waiting) {
          console.log('Service worker installed');
        } else if(reg.active) {
          // registration worked
          console.log('Service worker active');
        }

      }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
      });
    };

  </script>

<% } %>

USER AGENT:
-----------

{
  "isMobile":false,
  "isDesktop":true,
  "isBot":false,
  .....
  "browser":"Chrome",
  "version":"17.0.963.79",
  "os":"Windows 7",
  "platform":"Microsoft Windows",
  "source":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79..."
}


Category of enterprises

Entreprise de service général
Entreprise de générales du produit

Debug on device:

https://egghead.io/lessons/react-react-native-debugging-on-an-ios-device

Provision iOS:

https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html

https://developer.apple.com/library/ios/referencelibrary/GettingStarted/DevelopiOSAppsSwift/Lesson1.html#//apple_ref/doc/uid/TP40015214-CH3-SW1

fb graphi API:

https://developers.facebook.com/docs/graph-api/reference/user/photos/

https://developers.facebook.com/apps/447146248743195/settings/basic/

https://gist.github.com/wbroek/9321145

https://developers.facebook.com/tools/explorer

https://gist.github.com/cbosco/4626891

keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64

ga0RGNYHvNM5d0SLGQfpQWAPGJ8=

https://developers.facebook.com/docs/ios/getting-started

http://blog.robkerr.com/tutorial-using-amazon-aws-s3-storage-with-your-ios-swift-app/
http://stackoverflow.com/questions/23643886/xcode-aws-s3-list-objects-from-a-specific-s3-folder

iOS App icon:

https://appicontemplate.com/ios9/
https://appicontemplate.com/ios9/

http://code.tutsplus.com/tutorials/iphone-icon-design-creating-a-logo-for-bankapp--mobile-3764
https://appicontemplate.com/iphonescreenshot/

by Antar

/*

Access Key ID: AKIAJONYWMRBY6DSQBRQ
Secret Access Key: 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

dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    // Call long-running code on background thread
    // You can invoke callback from any thread/queue
    resolve(@[]);
  });

arn:aws:iam::347570046428:role/Cognito_fbPhotos447146248743195Unauth_Role

// Initialize the Amazon Cognito credentials provider
CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
    getApplicationContext(),
    "us-east-1:5dee37c6-089e-42db-b45d-1008017953b2", // Identity Pool ID
    Regions.US_EAST_1 // Region
);

#import <AWSCore/AWSCore.h>
#import <AWSCognito/AWSCognito.h>

// Initialize the Amazon Cognito credentials provider

AWSCognitoCredentialsProvider *credentialsProvider = [[AWSCognitoCredentialsProvider alloc]
   initWithRegionType:AWSRegionUSEast1
   identityPoolId:@"us-east-1:5dee37c6-089e-42db-b45d-1008017953b2"];

AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] initWithRegion:AWSRegionUSEast1 credentialsProvider:credentialsProvider];

[AWSServiceManager defaultServiceManager].defaultServiceConfiguration = configuration;


*/