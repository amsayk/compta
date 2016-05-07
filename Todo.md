Colors: http://www.hexcolortool.com/#00db7c

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
